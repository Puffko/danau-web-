import { useEffect, useRef } from 'react'
import { hash, noise2 } from '../lib/noise'
import { fitCanvas } from '../lib/canvas'
import { prefersReducedMotion } from '../lib/motion'
import { LETTERS, SYMBOL } from './Logo'

/**
 * The Danau wordmark built from the site's pixel mosaic: the logo paths are sampled onto a
 * grid and every covered cell becomes a square pixel in pale blues that flow slowly. Pixels
 * ignite from the bottom when the mark scrolls into view; the pointer brightens them.
 */

export const RAMP = ['#4a55ff', '#5d68ff', '#8796ff', '#b3c2ff', '#dae3ff', '#eef1ff', '#ffffff']

interface Cell {
  x: number
  y: number
  edge: boolean
  delay: number
}

/** Space above the drawn mark in the wordmark's viewBox; `crop` removes it so the mark centres. */
const CROP_TOP = 12.1
/** The cropped mark's height in viewBox units (its width is VIEW_W). */
export const MARK_H = 30.04
export const VIEW_W = 134

/**
 * The grid cells the logo really fills when its width is split into `cols` columns: only cells
 * more than half covered, so no stray or half-covered pixels stick out of the letters.
 */
export function sampleWordmark(cols: number, rows: number, crop: boolean) {
  const ss = 3 // samples per cell edge
  const off = document.createElement('canvas')
  off.width = cols * ss
  off.height = rows * ss
  const o = off.getContext('2d')
  const out: { i: number; j: number; cover: number }[] = []
  if (!o) return out
  // one uniform scale maps logo units onto the sample grid
  const scale = (cols * ss) / VIEW_W
  o.scale(scale, scale)
  if (crop) o.translate(0, -CROP_TOP)
  o.fillStyle = '#fff'
  o.save()
  o.translate(0, 12.1131)
  for (const d of SYMBOL) o.fill(new Path2D(d))
  o.restore()
  o.save()
  o.translate(33, 41.6829)
  o.fill(new Path2D(LETTERS))
  o.restore()
  const data = o.getImageData(0, 0, off.width, off.height).data
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cover = 0
      for (let a = 0; a < ss; a++)
        for (let b = 0; b < ss; b++) cover += data[((j * ss + b) * off.width + (i * ss + a)) * 4 + 3]
      cover /= ss * ss * 255
      if (cover > 0.5) out.push({ i, j, cover })
    }
  }
  return out
}

export function PixelWordmark({
  className,
  columns = 150,
}: {
  className?: string
  columns?: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = prefersReducedMotion()
    let cells: Cell[] = []
    let w = 0
    let h = 0
    let cell = 8
    let raf = 0
    let start = -1
    let visible = false
    let last = 0
    const pointer = { x: -1e4, y: -1e4, on: false }

    const build = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      if (!w || !h) return
      fitCanvas(canvas, ctx, w, h)

      const cols = w < 600 ? Math.round(columns * 0.6) : columns
      cell = w / cols
      const rows = Math.ceil(h / cell)
      const next: Cell[] = []
      for (const c of sampleWordmark(cols, rows, false)) {
        next.push({
          x: c.i * cell,
          y: c.j * cell,
          edge: c.cover < 0.8,
          delay: (1 - c.j / rows) * 650 + (c.i / cols) * 350 + hash(c.i, c.j, 4) * 250,
        })
      }
      cells = next
    }

    const draw = (now: number) => {
      raf = 0
      if (start < 0) start = now
      const t = reduce ? 1e9 : now - start
      const intro = !reduce && t < 1600
      if (!intro && !pointer.on && now - last < 60) {
        if (visible && !reduce) raf = requestAnimationFrame(draw)
        return
      }
      last = now
      ctx.clearRect(0, 0, w, h)
      const flow = reduce ? 0 : now
      for (const c of cells) {
        let grow = 1
        if (intro) {
          const p = (t - c.delay) / 420
          if (p <= 0) continue
          if (p < 1) grow = 1 - Math.pow(1 - p, 3)
        }
        const i = c.x / cell
        const j = c.y / cell
        let v = noise2(i * 0.12 + flow * 0.00004, j * 0.12 - flow * 0.00003, 61) * 0.65 + (1 - c.y / h) * 0.45
        if (pointer.on) {
          const d = Math.hypot(c.x + cell / 2 - pointer.x, c.y + cell / 2 - pointer.y) / (cell * 9)
          if (d < 1) v += (1 - d) * 0.5
        }
        const k = Math.max(0, Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)))
        const s = (cell - Math.max(1, cell * 0.12)) * grow
        ctx.fillStyle = RAMP[k]
        ctx.fillRect(c.x + (cell - s) / 2, c.y + (cell - s) / 2, s, s)
      }
      if (visible && !document.hidden && !reduce) raf = requestAnimationFrame(draw)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    build()
    const ro = new ResizeObserver(() => {
      build()
      kick()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(
      ([e]) => {
        // the intro clock starts on the first frame drawn, i.e. when the mark first comes into view
        visible = e.isIntersecting
        if (visible) kick()
      },
      { threshold: 0.2 },
    )
    io.observe(canvas)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.on = true
      kick()
    }
    const onLeave = () => {
      pointer.on = false
    }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', kick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', kick)
    }
  }, [columns])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
