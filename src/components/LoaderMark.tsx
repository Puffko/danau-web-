import { useEffect, useRef } from 'react'
import { hash } from '../lib/noise'
import { LETTERS, SYMBOL } from './Logo'

/**
 * The loading screen's wordmark. The "D" symbol assembles from pixels along a diagonal, then the
 * crisp vector symbol settles over them while the letters slide out from behind it. Timing lives
 * in CSS (.loader__*), the pixel assembly in the canvas below.
 */

// symbol box inside the wordmark's 134 x 42.138 viewBox
const VIEW_W = 134
const VIEW_H = 42.138
const SYM_Y = 12.1131
const SYM = 30.03
const GRID = 10
const RAMP = ['#5d68ff', '#8796ff', '#b3c2ff', '#dae3ff', '#ffffff']

export function LoaderMark({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const r = canvas.getBoundingClientRect()
    const size = r.width
    if (!size) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = canvas.height = Math.round(size * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // which cells of a GRID x GRID raster the symbol covers
    const ss = 8
    const off = document.createElement('canvas')
    off.width = off.height = GRID * ss
    const o = off.getContext('2d')
    if (!o) return
    o.scale((GRID * ss) / SYM, (GRID * ss) / SYM)
    o.fillStyle = '#fff'
    for (const d of SYMBOL) o.fill(new Path2D(d))
    const data = o.getImageData(0, 0, off.width, off.height).data
    const cells: { i: number; j: number; delay: number; k: number }[] = []
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        let cover = 0
        for (let a = 0; a < ss; a++)
          for (let b = 0; b < ss; b++) cover += data[((j * ss + b) * off.width + (i * ss + a)) * 4 + 3]
        if (cover / (ss * ss * 255) < 0.45) continue
        cells.push({
          i,
          j,
          // a diagonal sweep from the bottom left, loosened a little per cell
          delay: (i + (GRID - 1 - j)) * 38 + hash(i, j, 3) * 60,
          k: Math.min(RAMP.length - 1, Math.floor(((GRID - 1 - j) / GRID) * RAMP.length * 0.6 + hash(i, j, 8) * 2.2)),
        })
      }
    }

    const cell = size / GRID
    let raf = 0
    let start = -1
    const draw = (now: number) => {
      if (start < 0) start = now
      const t = now - start
      ctx.clearRect(0, 0, size, size)
      let pending = false
      for (const c of cells) {
        const p = Math.min(1, Math.max(0, (t - c.delay) / 320))
        if (p < 1) pending = true
        if (p <= 0) continue
        const g = 1 - Math.pow(1 - p, 3)
        const s = (cell - 1.5) * g
        ctx.globalAlpha = Math.min(1, g * 1.4)
        ctx.fillStyle = RAMP[c.k]
        ctx.fillRect(c.i * cell + (cell - s) / 2, c.j * cell + (cell - s) / 2, s, s)
      }
      ctx.globalAlpha = 1
      if (pending) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <span className={`loader-mark ${className ?? ''}`}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="Danau">
        <g className="loader-mark__symbol" transform={`translate(0 ${SYM_Y})`}>
          {SYMBOL.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g className="loader-mark__letters">
          <path d={LETTERS} transform="translate(33 41.6829)" />
        </g>
      </svg>
      <canvas
        ref={ref}
        className="loader-mark__pixels"
        style={{
          top: `${(SYM_Y / VIEW_H) * 100}%`,
          width: `${(SYM / VIEW_W) * 100}%`,
          height: `${(SYM / VIEW_H) * 100}%`,
        }}
        aria-hidden="true"
      />
    </span>
  )
}
