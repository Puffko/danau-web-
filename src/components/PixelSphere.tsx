import { useEffect, useRef } from 'react'
import { hash, noise2 } from '../lib/noise'

/**
 * A sphere of blue pixels, split down the middle: the left half is a crisp
 * pixel grid, the right half the same field seen out of focus. The field flows
 * slowly; cells near the pointer light up. On entry the sphere assembles from its core
 * outwards, each cell growing and brightening into place.
 */

// Live palette blues, deepest to palest.
const RAMP = ['#0b0d8a', '#0d0f9e', '#1010dc', '#1818ec', '#2a35ff', '#4a55ff', '#5d68ff', '#8796ff', '#b3c2ff', '#dae3ff']
// The out-of-focus half carries white text, so it keeps to the deep end of the ramp.
const DEEP = 6

interface Props {
  cells?: number
  className?: string
  /** The sphere is flipped with CSS (crisp half on the right); mirror the pointer to match. */
  mirrored?: boolean
  /** Varies the pixel field so two spheres on one page differ. */
  seed?: number
  /** Hold the entrance until true (for a parent that sequences it); undefined starts it on scroll-in. */
  play?: boolean
}

export function PixelSphere({ cells = 34, className, mirrored = false, seed = 0, play }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const crispRef = useRef<HTMLCanvasElement>(null)
  const softRef = useRef<HTMLCanvasElement>(null)
  const playRef = useRef(play ?? true)
  const kickRef = useRef<() => void>(() => {})

  useEffect(() => {
    playRef.current = play ?? true
    kickRef.current()
  }, [play])

  useEffect(() => {
    const wrap = wrapRef.current
    const crisp = crispRef.current
    const soft = softRef.current
    if (!wrap || !crisp || !soft) return
    const c1 = crisp.getContext('2d')
    const c2 = soft.getContext('2d')
    if (!c1 || !c2) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let size = 0
    let raf = 0
    let visible = false
    let started = -1
    let last = 0
    const pointer = { x: -1e4, y: -1e4, on: false }

    const resize = () => {
      size = wrap.getBoundingClientRect().width
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      for (const cv of [crisp, soft]) {
        cv.width = Math.round(size * dpr)
        cv.height = Math.round(size * dpr)
      }
      c1.setTransform(dpr, 0, 0, dpr, 0, 0)
      c2.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const field = (i: number, j: number, t: number) => {
      const n = cells
      let v = noise2(i * 0.2 + t * 0.00006, j * 0.2 - t * 0.00004, 41 + seed) * 0.75 + noise2(i * 0.55, j * 0.55, 7 + seed) * 0.25
      // paler towards the lower left, deeper in the core
      v += (j / n) * 0.32 - (i / n) * 0.12 - 0.08
      return Math.max(0, Math.min(0.999, v))
    }

    const draw = (now: number) => {
      raf = 0
      if (started < 0) started = now
      const t = reduce ? 0 : now - started
      // ~30fps is plenty for a slow flow
      if (now - last < 32 && started !== now) {
        schedule()
        return
      }
      last = now

      const n = cells
      const cell = size / n
      const c = n / 2
      // leave a margin of cells around the disc for the stray rim pixels
      const r = c - 1.4
      c1.clearRect(0, 0, size, size)
      c2.clearRect(0, 0, size, size)
      let intro = false

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const dx = i + 0.5 - c
          const dy = j + 0.5 - c
          const d = Math.sqrt(dx * dx + dy * dy)
          // stray pixels scattered just outside the rim of the crisp half
          const stray = d > r && d < r + 1.6 && i < c && hash(i, j, 13) < 0.22
          // the soft half paints a touch past the rim so its blur stays solid under the text
          if (d > r + 0.6 && !stray) continue
          // ragged pixel silhouette at the rim
          const crispCell = stray || (d <= r && !(d > r - 1.2 && hash(i, j, 3) < 0.4))

          let grow = 1
          let lift = 0
          if (!reduce) {
            // a wave from the core to the rim, loosened a little per cell
            const p = (t - ((d / r) * 900 + hash(i, j, 9) * 260)) / 620
            if (p < 1) {
              intro = true
              if (p <= 0) continue
              grow = 1 - Math.pow(1 - p, 3)
              // cells arrive pale and settle into their own blue
              lift = (1 - grow) * 4
            }
          }

          const v = field(i, j, t)
          const x = i * cell
          const y = j * cell

          if (i < c && crispCell) {
            let k = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length + lift))
            if (pointer.on) {
              const pd = Math.hypot(x + cell / 2 - pointer.x, y + cell / 2 - pointer.y) / cell
              if (pd < 3) k = Math.min(RAMP.length - 1, k + (pd < 1.5 ? 3 : 2))
            }
            const s = cell * grow
            c1.globalAlpha = Math.min(1, grow * 1.4)
            c1.fillStyle = RAMP[k]
            c1.fillRect(x + (cell - s) / 2, y + (cell - s) / 2, s + 0.5, s + 0.5)
          }
          if (i >= c - 2 && d <= r + 0.6) {
            c2.globalAlpha = grow
            c2.fillStyle = RAMP[Math.floor(v * DEEP)]
            c2.fillRect(x, y, cell + 0.5, cell + 0.5)
          }
        }
      }
      c1.globalAlpha = 1
      c2.globalAlpha = 1

      if (!reduce || intro || pointer.on) schedule()
    }

    const schedule = () => {
      if (!raf && visible && playRef.current && !document.hidden) raf = requestAnimationFrame(draw)
    }
    kickRef.current = schedule

    resize()
    const ro = new ResizeObserver(() => {
      resize()
      schedule()
    })
    ro.observe(wrap)
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        if (visible) schedule()
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    io.observe(wrap)

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const rect = wrap.getBoundingClientRect()
      pointer.x = mirrored ? rect.right - e.clientX : e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.on = true
      schedule()
    }
    const onLeave = () => {
      pointer.on = false
      schedule()
    }
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    const onVis = () => schedule()
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
      kickRef.current = () => {}
    }
  }, [cells, mirrored, seed])

  return (
    <div ref={wrapRef} className={`pixel-sphere ${className ?? ''}`} aria-hidden="true">
      <div className="pixel-sphere__soft">
        <canvas ref={softRef} />
      </div>
      <canvas ref={crispRef} className="pixel-sphere__crisp" />
    </div>
  )
}
