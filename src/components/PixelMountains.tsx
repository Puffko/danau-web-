import { useEffect, useRef } from 'react'
import { hash, noise1, noise2, smooth } from '../lib/noise'

/**
 * Dot-matrix mountain range drawn on a canvas.
 *
 * One fixed magnitude ramp (size + colour) carries height and light: dots are
 * small and blue on the ridges and grow paler and denser towards the base, where
 * the hero's glow is brightest. On load the range ignites bottom-up in a scan
 * sweep, then idles with sparse twinkles and a slow scan band; the pointer acts
 * as a lens that enlarges and brightens nearby dots.
 */

type Variant = 'hero' | 'low'

interface Props {
  variant?: Variant
  /** Shifts the peaks so every page gets its own skyline. */
  seed?: number
  className?: string
}

// Magnitude ramp: index 0 is atmosphere, 5 is a solid "pixel" cell.
const COLORS = ['#4A55FF', '#5D68FF', '#7884FF', '#9AA8FF', '#BCC8FF', '#D4DCFF']
const ALPHA = [0.28, 0.62, 0.82, 0.94, 1, 1]
const SIZE = [0.13, 0.22, 0.32, 0.44, 0.58, 0.8] // fraction of the cell

/** Height of the range at horizontal position u (0..1), as a fraction of the canvas height. */
function profile(u: number, variant: Variant, seed: number, narrow: boolean) {
  const shift = ((seed % 7) - 3) * 0.035
  const peak = (c: number, h: number, w: number) => Math.max(0, h * (1 - Math.abs(u - c) / w))
  const scale = variant === 'hero' ? 1 : 0.62
  const main = narrow ? 0.5 : 0.6 + shift
  let h = Math.max(
    peak(main, 0.9, narrow ? 0.42 : 0.3),
    peak(0.27 + shift * 0.5, 0.44, 0.32),
    peak(0.04, 0.24, 0.2),
    // the range climbs out of frame on the right, like a near slope
    1.02 * smooth(Math.min(1, Math.max(0, (u - (narrow ? 0.62 : 0.7)) / (narrow ? 0.38 : 0.3)))),
    0.07,
  )
  h += (noise1(u * 9, seed) - 0.5) * 0.09 * Math.min(1, h * 3)
  return Math.max(0.04, h * scale)
}

interface Dot {
  x: number
  y: number
  level: number
  delay: number
  phase: number
  twinkle: boolean
}

export function PixelMountains({ variant = 'hero', seed = 3, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dots: Dot[] = []
    let cell = 8
    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let startedAt = -1
    let introDone = reduce
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      if (!width || !height) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const narrow = width < 700
      cell = narrow ? 6 : width > 1600 ? 9 : 8
      const cols = Math.ceil(width / cell)
      const rows = Math.ceil(height / cell)
      const next: Dot[] = []

      for (let i = 0; i < cols; i++) {
        const u = (i + 0.5) / cols
        const top = profile(u, variant, seed, narrow) * height
        for (let j = 0; j < rows; j++) {
          const yb = j * cell // distance from the bottom edge
          const r = hash(i, j, seed)
          let level: number

          if (yb < top) {
            const rel = yb / top // 0 at the base, 1 on the ridge
            const grain = noise2(i * 0.12, j * 0.12, seed + 11) - 0.5
            let mag = (1 - rel) * 4.6 + 0.4 + grain * 2.2
            // dense "solid" mass in the near slope on the right
            if (u > (narrow ? 0.76 : 0.82) + grain * 0.12 && rel < 0.62 + grain * 0.3) mag = 5
            if (rel > 0.92) mag = Math.min(mag, 1.2)
            level = Math.max(0, Math.min(5, Math.round(mag)))
            // glitch holes and sparse ridge dithering
            if (r < (rel > 0.8 ? 0.38 : 0.07)) continue
          } else {
            // faint atmosphere grid above the range, thinning with altitude
            const above = (yb - top) / height
            if (r > 0.42 - above * 1.4) continue
            level = 0
          }

          next.push({
            x: i * cell + cell / 2,
            y: height - yb - cell / 2,
            level,
            delay: (yb / height) * 950 + Math.abs(u - 0.6) * 260 + hash(j, i, seed + 3) * 320,
            phase: hash(i, j, seed + 5) * Math.PI * 2,
            twinkle: hash(i, j, seed + 7) < 0.16,
          })
        }
      }
      dots = next
    }

    const levelSizes = new Float32Array(6)
    const draw = (now: number) => {
      if (startedAt < 0) startedAt = now
      const t = now - startedAt
      ctx.clearRect(0, 0, width, height)

      pointer.x += (pointer.tx - pointer.x) * 0.14
      pointer.y += (pointer.ty - pointer.y) * 0.14
      const lensR = width < 700 ? 90 : 150
      // slow scan band sweeping left to right
      const scanX = reduce ? -9999 : ((t / 7000) % 1.25) * width * 1.1 - width * 0.05
      for (let l = 0; l < 6; l++) levelSizes[l] = SIZE[l] * cell

      let anyIntro = false
      for (let pass = 0; pass < 6; pass++) {
        ctx.fillStyle = COLORS[pass]
        ctx.globalAlpha = ALPHA[pass]
        for (let k = 0; k < dots.length; k++) {
          const d = dots[k]
          let grow = 1
          let lvl = d.level
          if (!introDone) {
            const p = (t - d.delay) / 520
            if (p <= 0) {
              anyIntro = true
              continue
            }
            if (p < 1) {
              anyIntro = true
              grow = 1 - Math.pow(1 - p, 4)
              if (p < 0.35) lvl = Math.min(5, lvl + 2) // the ignition front flashes bright
            }
          } else if (!reduce) {
            if (d.twinkle && Math.sin(t * 0.0011 + d.phase) > 0.93) lvl = Math.min(5, lvl + 1)
            const sd = Math.abs(d.x - scanX)
            if (sd < 46 && d.level > 0) lvl = Math.min(5, lvl + (sd < 18 ? 2 : 1))
          }
          let size = levelSizes[d.level] * grow
          if (pointer.active) {
            const dx = d.x - pointer.x
            const dy = d.y - pointer.y
            const dist2 = dx * dx + dy * dy
            if (dist2 < lensR * lensR) {
              const f = 1 - Math.sqrt(dist2) / lensR
              size *= 1 + f * 0.9
              if (f > 0.35) lvl = Math.min(5, lvl + 1)
            }
          }
          if (lvl !== pass) continue
          const s = Math.min(size, cell - 1)
          ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s)
        }
      }
      ctx.globalAlpha = 1
      if (!introDone && !anyIntro) introDone = true

      if (reduce && introDone && !pointer.active) {
        raf = 0
        return
      }
      if (visible) raf = requestAnimationFrame(draw)
      else raf = 0
    }

    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw)
    }

    build()
    start()

    const ro = new ResizeObserver(() => {
      build()
      if (!raf) raf = requestAnimationFrame(draw)
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(canvas)

    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : ((raf = 0), start()))
    document.addEventListener('visibilitychange', onVisibility)

    const host = canvas.closest('[data-pixel-host]') ?? canvas.parentElement
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const rect = canvas.getBoundingClientRect()
      pointer.tx = e.clientX - rect.left
      pointer.ty = e.clientY - rect.top
      if (!pointer.active) {
        pointer.x = pointer.tx
        pointer.y = pointer.ty
      }
      pointer.active = true
      start()
    }
    const onLeave = () => {
      pointer.active = false
      pointer.tx = pointer.ty = -9999
    }
    host?.addEventListener('pointermove', onMove as EventListener)
    host?.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      host?.removeEventListener('pointermove', onMove as EventListener)
      host?.removeEventListener('pointerleave', onLeave)
    }
  }, [variant, seed])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
