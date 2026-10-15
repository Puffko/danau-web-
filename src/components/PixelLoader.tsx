import { useEffect, useRef } from 'react'
import { hash, noise2 } from '../lib/noise'
import { MARK_H, RAMP, VIEW_W, sampleWordmark } from './PixelWordmark'

/**
 * First-load screen. The footer's pixel wordmark builds itself in the middle, the view zooms
 * into it until its pixels are tiles, the rest of the screen fills with tiles in the same grid,
 * and the tiles then drop away one by one from the centre out, uncovering the loaded page.
 */

const COLS = 104
const NIGHT = '#05061a'
/** Tiles that fill the screen around the mark: the site's deep blues. */
const DEEP = ['#0b0d4a', '#0f1278', '#1416b0', '#1818ec', '#2f37f5', '#4a55ff']

// timeline, ms from the first frame
const BUILD = 900
const ZOOM_AT = 1000
const ZOOM = 850
const FILL_AT = ZOOM_AT + ZOOM - 250
const FILL_SPREAD = 380
const TILE_IN = 280
const GONE_SPREAD = 560
const GONE_SCATTER = 200
const TILE_OUT = 380

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeIn = (t: number) => t * t * t

interface Props {
  /** Fonts are in: the tiles may start dropping away. Until then they hold the full screen. */
  ready: boolean
  /** The tiles start to drop: show the page underneath. */
  onReveal: () => void
  /** The last tile is gone. */
  onDone: () => void
}

export function PixelLoader({ ready, onReveal, onDone }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const readyRef = useRef(ready)
  readyRef.current = ready
  const cb = useRef({ onReveal, onDone })
  cb.current = { onReveal, onDone }

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let w = 0
    let h = 0
    let rows = 0
    let logo = new Set<number>()
    let cells: { i: number; j: number }[] = []
    // the D symbol's box in grid cells: the zoom dives into it until it fills the screen
    let symbol = { i0: 0, i1: 1, j0: 0, j1: 1 }
    let raf = 0
    let start = -1
    let goneAt = -1
    let revealed = false
    const key = (i: number, j: number) => i * 4096 + j

    const build = () => {
      w = window.innerWidth
      h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rows = Math.ceil(COLS * (MARK_H / VIEW_W)) + 1
      cells = sampleWordmark(COLS, rows, true)
      logo = new Set(cells.map((c) => key(c.i, c.j)))
      // the symbol is everything left of the letters, which start 33 units into the 134-unit mark
      const mark = cells.filter((c) => c.i < (33 / VIEW_W) * COLS - 1)
      symbol = {
        i0: Math.min(...mark.map((c) => c.i)),
        i1: Math.max(...mark.map((c) => c.i)) + 1,
        j0: Math.min(...mark.map((c) => c.j)),
        j1: Math.max(...mark.map((c) => c.j)) + 1,
      }
    }

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      if (start < 0) start = now
      const t = now - start

      // the mark at rest, as the CSS used to size it: clamp(220px, 30vw, 320px), centred
      const markW = Math.max(220, Math.min(320, w * 0.3))
      const cell0 = markW / COLS
      const ox = (w - markW) / 2
      const oy = (h - markW * (MARK_H / VIEW_W)) / 2
      // the zoom ends with the D filling most of the screen
      const target = Math.min((w * 0.62) / (symbol.i1 - symbol.i0), (h * 0.56) / (symbol.j1 - symbol.j0))
      const zoom = target / cell0
      // the D's centre ends up dead centre
      const fx = ox + ((symbol.i0 + symbol.i1) / 2) * cell0
      const fy = oy + ((symbol.j0 + symbol.j1) / 2) * cell0

      const pz = easeInOut(clamp01((t - ZOOM_AT) / ZOOM))
      const s = Math.exp(Math.log(zoom) * pz)
      const ax = fx + (w / 2 - fx) * pz
      const ay = fy + (h / 2 - fy) * pz
      const cs = cell0 * s
      // screen position of grid cell (0, 0)
      const gx = ax + (ox - fx) * s
      const gy = ay + (oy - fy) * s
      const gap = Math.min(cs * 0.12, 1.5 + cs * 0.035)

      // tiles start to go once the screen is full and the fonts are in
      const filled = t > FILL_AT + FILL_SPREAD + TILE_IN - 40
      if (filled && goneAt < 0 && readyRef.current) goneAt = t
      if (goneAt >= 0 && !revealed) {
        revealed = true
        canvas.parentElement?.classList.add('is-revealing')
        cb.current.onReveal()
      }
      const tg = goneAt < 0 ? -1 : t - goneAt
      if (tg > GONE_SPREAD + GONE_SCATTER + TILE_OUT) {
        cancelAnimationFrame(raf)
        raf = 0
        cb.current.onDone()
        return
      }

      ctx.clearRect(0, 0, w, h)
      const flow = now * 0.00004
      const colour = (i: number, j: number, inMark: boolean) => {
        if (inMark) {
          const v = noise2(i * 0.12 + flow, j * 0.12 - flow, 61) * 0.65 + (1 - j / rows) * 0.45
          return RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)))]
        }
        const v = noise2(i * 0.21 + flow * 3, j * 0.21 - flow * 2, 23) * 0.8 + hash(i, j, 7) * 0.35
        return DEEP[Math.max(0, Math.min(DEEP.length - 1, Math.floor(v * DEEP.length)))]
      }

      if (tg < 0 && t < FILL_AT) {
        // the mark alone: build, hold, zoom
        if (!revealed) {
          ctx.fillStyle = NIGHT
          ctx.fillRect(0, 0, w, h)
        }
        for (const c of cells) {
          const x = gx + c.i * cs
          const y = gy + c.j * cs
          if (x > w || y > h || x + cs < 0 || y + cs < 0) continue
          const delay = ((1 - c.j / rows) * 0.55 + (c.i / COLS) * 0.3 + hash(c.i, c.j, 4) * 0.15) * (BUILD - 380)
          const p = clamp01((t - delay) / 380)
          if (p <= 0) continue
          const size = (cs - gap) * easeOut(p)
          ctx.fillStyle = colour(c.i, c.j, true)
          ctx.fillRect(x + (cs - size) / 2, y + (cs - size) / 2, size, size)
        }
        return
      }

      // the whole screen as one grid of tiles
      const i0 = Math.floor(-gx / cs)
      const i1 = Math.ceil((w - gx) / cs)
      const j0 = Math.floor(-gy / cs)
      const j1 = Math.ceil((h - gy) / cs)
      const maxD = Math.hypot(w / 2, h / 2)
      for (let i = i0; i < i1; i++) {
        for (let j = j0; j < j1; j++) {
          const x = gx + i * cs
          const y = gy + j * cs
          const inMark = logo.has(key(i, j))
          const d = Math.hypot(x + cs / 2 - w / 2, y + cs / 2 - h / 2) / maxD
          let size = cs - gap
          let ground = 1
          if (!inMark) {
            // fill: tiles ripple out from the mark
            const p = clamp01((t - FILL_AT - (d * 0.75 + hash(i, j, 3) * 0.25) * FILL_SPREAD) / TILE_IN)
            size *= easeOut(p)
          }
          if (tg >= 0) {
            // drop away from the centre out, a little scattered
            const q = clamp01(
              (tg - (d * 0.8 + hash(i, j, 9) * 0.2) * GONE_SPREAD - hash(j, i, 5) * GONE_SCATTER) / TILE_OUT,
            )
            if (q >= 1) continue
            // the ground goes first, the tile itself then shrinks away over the page
            ground = 1 - easeOut(clamp01(q * 4))
            size *= 1 - easeIn(q)
          }
          if (ground > 0) {
            ctx.globalAlpha = ground
            ctx.fillStyle = NIGHT
            ctx.fillRect(x, y, cs, cs)
            ctx.globalAlpha = 1
          }
          if (size <= 0.5) continue
          ctx.fillStyle = colour(i, j, inMark)
          ctx.fillRect(x + (cs - size) / 2, y + (cs - size) / 2, size, size)
        }
      }
    }

    build()
    window.addEventListener('resize', build)
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
    }
  }, [])

  return (
    <div className="loader" aria-hidden="true">
      <canvas ref={ref} className="loader__canvas" />
    </div>
  )
}
