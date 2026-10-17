import { useEffect, useRef } from 'react'
import { hash, noise1, noise2, smooth } from '../lib/noise'
import { fitCanvas } from '../lib/canvas'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Dot-matrix mountain range drawn on a canvas.
 *
 * One fixed magnitude ramp (size + colour) carries height and light: dots are
 * small and blue on the ridges and grow paler and denser towards the base, where
 * the hero's glow is brightest. On load the range fills in bottom-up as a calm
 * wave, then idles with sparse twinkles; the pointer acts as a lens that
 * enlarges and brightens nearby dots.
 *
 * Only the intro repaints the whole canvas. Once it is over, a frame repaints just
 * the cells whose twinkle flipped and the box around the lens, so an idle hero
 * costs next to nothing to keep alive.
 */

type Variant = 'hero' | 'low'

interface Props {
  variant?: Variant
  /** Shifts the peaks so every page gets its own skyline. */
  seed?: number
  className?: string
}

/** The matrix pitch for a canvas this wide; anything drawn on the same grid (PixelMark) uses it too. */
export const matrixCell = (width: number) => (width < 700 ? 6 : width > 1600 ? 9 : 8)

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
  col: number
  row: number
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

    const reduce = prefersReducedMotion()
    let dots: Dot[] = []
    let twinkles: number[] = []
    let lit = new Uint8Array(0)
    // dot index per grid cell (column-major, row 0 at the bottom), -1 where the cell is empty
    let grid = new Int32Array(0)
    let cols = 0
    let rows = 0
    let lensBox: [number, number, number, number] | null = null
    let lastIdle = 0
    let cell = 8
    let width = 0
    let height = 0
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
      // dots are crisp squares; 1.5x is indistinguishable from 2x and paints ~45% fewer pixels
      fitCanvas(canvas, ctx, width, height, 1.5)

      const narrow = width < 700
      cell = matrixCell(width)
      cols = Math.ceil(width / cell)
      rows = Math.ceil(height / cell)
      const next: Dot[] = []
      grid = new Int32Array(cols * rows).fill(-1)

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

          grid[i * rows + j] = next.length
          next.push({
            x: i * cell + cell / 2,
            y: height - yb - cell / 2,
            col: i,
            row: j,
            level,
            delay: (yb / height) * 1100 + Math.abs(u - 0.6) * 260 + hash(j, i, seed + 3) * 110,
            phase: hash(i, j, seed + 5) * Math.PI * 2,
            twinkle: hash(i, j, seed + 7) < 0.16,
          })
        }
      }
      dots = next
      twinkles = []
      for (let k = 0; k < dots.length; k++) if (dots[k].twinkle) twinkles.push(k)
      lit = new Uint8Array(dots.length)
      lensBox = null
    }

    const levelSizes = new Float32Array(6)
    const lensRadius = () => (width < 700 ? 90 : 150)

    /** Size and level of a settled dot right now: its twinkle and the lens can lift it. */
    const paintDot = (d: Dot, k: number) => {
      let lvl = d.level
      if (lit[k]) lvl = Math.min(5, lvl + 1)
      let size = levelSizes[d.level]
      if (pointer.active) {
        const dx = d.x - pointer.x
        const dy = d.y - pointer.y
        const dist2 = dx * dx + dy * dy
        const lensR = lensRadius()
        if (dist2 < lensR * lensR) {
          const f = 1 - Math.sqrt(dist2) / lensR
          size *= 1 + f * 0.9
          if (f > 0.35) lvl = Math.min(5, lvl + 1)
        }
      }
      const s = Math.min(size, cell - 1)
      ctx.fillStyle = COLORS[lvl]
      ctx.globalAlpha = ALPHA[lvl]
      ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s)
    }

    /** Clear and repaint a block of grid cells (inclusive bounds, clamped to the grid). */
    const paintCells = (i0: number, i1: number, j0: number, j1: number) => {
      i0 = Math.max(0, i0)
      j0 = Math.max(0, j0)
      i1 = Math.min(cols - 1, i1)
      j1 = Math.min(rows - 1, j1)
      if (i0 > i1 || j0 > j1) return
      ctx.clearRect(i0 * cell, height - (j1 + 1) * cell, (i1 - i0 + 1) * cell, (j1 - j0 + 1) * cell)
      for (let i = i0; i <= i1; i++) {
        for (let j = j0; j <= j1; j++) {
          const k = grid[i * rows + j]
          if (k >= 0) paintDot(dots[k], k)
        }
      }
    }

    const paintAll = () => {
      ctx.clearRect(0, 0, width, height)
      for (let k = 0; k < dots.length; k++) paintDot(dots[k], k)
      ctx.globalAlpha = 1
    }

    /** The grid cells under the lens, or null when the pointer is away. */
    const currentLensBox = (): [number, number, number, number] | null => {
      if (!pointer.active) return null
      const r = lensRadius()
      return [
        Math.floor((pointer.x - r) / cell),
        Math.ceil((pointer.x + r) / cell),
        Math.floor((height - pointer.y - r) / cell),
        Math.ceil((height - pointer.y + r) / cell),
      ]
    }

    const drawIntro = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      const lensR = lensRadius()
      let anyIntro = false
      for (let pass = 0; pass < 6; pass++) {
        ctx.fillStyle = COLORS[pass]
        ctx.globalAlpha = ALPHA[pass]
        for (let k = 0; k < dots.length; k++) {
          const d = dots[k]
          let grow = 1
          let lvl = d.level
          const p = (t - d.delay) / 760
          if (p <= 0) {
            anyIntro = true
            continue
          }
          if (p < 1) {
            anyIntro = true
            // dots grow and fade in together: a calm rising wave, no flashing front
            grow = 1 - Math.pow(1 - p, 3)
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
          ctx.globalAlpha = ALPHA[pass] * grow
          ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s)
        }
      }
      ctx.globalAlpha = 1
      return anyIntro
    }

    let needsFull = true
    const draw = (now: number) => {
      raf = 0
      if (startedAt < 0) startedAt = now
      const t = now - startedAt
      for (let l = 0; l < 6; l++) levelSizes[l] = SIZE[l] * cell
      pointer.x += (pointer.tx - pointer.x) * 0.14
      pointer.y += (pointer.ty - pointer.y) * 0.14

      if (!introDone) {
        if (!drawIntro(t)) {
          introDone = true
          needsFull = true
        }
      }
      if (introDone) {
        if (needsFull) {
          needsFull = false
          paintAll()
          lensBox = currentLensBox()
        } else {
          // the lens: repaint where it was and where it is now, only when it has moved
          const box = currentLensBox()
          const moved = Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.3
          if ((box && (moved || !lensBox)) || (!box && lensBox)) {
            const a = box ?? lensBox!
            const b = lensBox ?? box!
            paintCells(Math.min(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.max(a[3], b[3]))
          }
          lensBox = box
          // twinkles: ~25 times a second is plenty for a slow sparkle
          if (!reduce && now - lastIdle > 40) {
            lastIdle = now
            for (const k of twinkles) {
              const on = Math.sin(t * 0.0011 + dots[k].phase) > 0.93 ? 1 : 0
              if (on === lit[k]) continue
              lit[k] = on
              const d = dots[k]
              paintCells(d.col, d.col, d.row, d.row)
            }
          }
          ctx.globalAlpha = 1
        }
      }

      if (reduce && introDone && !pointer.active && !lensBox) return
      if (visible && !document.hidden) raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw)
    }

    build()
    start()

    const ro = new ResizeObserver(() => {
      build()
      needsFull = true
      if (!raf) raf = requestAnimationFrame(draw)
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(canvas)

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
      } else start()
    }
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
