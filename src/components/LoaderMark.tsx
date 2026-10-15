import { useEffect, useRef } from 'react'
import { hash } from '../lib/noise'
import { LETTERS, SYMBOL } from './Logo'

/**
 * The loading screen's wordmark. The crisp logo fades in, then turns into pixels: a sweep runs
 * left to right, wiping the vector away while the same shape is laid down in square cells, as
 * the footer wordmark. The vector wipe is CSS (.loader-mark__vector), the pixels the canvas.
 */

// the wordmark's viewBox cropped to the drawn mark, so the logo centres exactly
const TOP = 12.1
const VIEW_W = 134
const VIEW_H = 30.04
const COLS = 72
const RAMP = ['#8796ff', '#b3c2ff', '#dae3ff', '#eef1ff', '#ffffff']
/** Matches the CSS wipe: it starts at SWEEP_AT ms and crosses the logo in SWEEP_MS. */
const SWEEP_AT = 720
const SWEEP_MS = 620

export function LoaderMark({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const r = canvas.getBoundingClientRect()
    const w = r.width
    const h = r.height
    if (!w || !h) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cell = w / COLS
    const rows = Math.ceil(h / cell)
    const ss = 4
    const off = document.createElement('canvas')
    off.width = COLS * ss
    off.height = rows * ss
    const o = off.getContext('2d')
    if (!o) return
    const k = (COLS * ss) / VIEW_W
    o.scale(k, k)
    o.translate(0, -TOP)
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

    const cells: { x: number; y: number; delay: number; c: string }[] = []
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < rows; j++) {
        let cover = 0
        for (let a = 0; a < ss; a++)
          for (let b = 0; b < ss; b++) cover += data[((j * ss + b) * off.width + (i * ss + a)) * 4 + 3]
        // only cells the logo really fills, so the pixel letters keep clean edges
        if (cover / (ss * ss * 255) <= 0.5) continue
        // white at the top of the mark, cooling to pale blue at the bottom
        const v = 1.05 - (j / rows) * 0.75 + (hash(i, j, 5) - 0.5) * 0.18
        cells.push({
          x: i * cell,
          y: j * cell,
          delay: SWEEP_AT + (i / COLS) * SWEEP_MS - 60 + hash(i, j, 2) * 90,
          c: RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)))],
        })
      }
    }

    const gap = Math.max(0.6, cell * 0.14)
    let raf = 0
    let start = -1
    const draw = (now: number) => {
      if (start < 0) start = now
      const t = now - start
      ctx.clearRect(0, 0, w, h)
      let pending = false
      for (const c of cells) {
        const p = Math.min(1, Math.max(0, (t - c.delay) / 280))
        if (p < 1) pending = true
        if (p <= 0) continue
        const g = 1 - Math.pow(1 - p, 3)
        const s = (cell - gap) * (0.55 + 0.45 * g)
        ctx.globalAlpha = g
        ctx.fillStyle = c.c
        ctx.fillRect(c.x + (cell - s) / 2, c.y + (cell - s) / 2, s, s)
      }
      ctx.globalAlpha = 1
      if (pending) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <span className={`loader-mark ${className ?? ''}`} role="img" aria-label="Danau">
      <svg className="loader-mark__vector" viewBox={`0 ${TOP} ${VIEW_W} ${VIEW_H}`} aria-hidden="true">
        <g transform="translate(0 12.1131)">
          {SYMBOL.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <path d={LETTERS} transform="translate(33 41.6829)" />
      </svg>
      <canvas ref={ref} className="loader-mark__pixels" aria-hidden="true" />
    </span>
  )
}
