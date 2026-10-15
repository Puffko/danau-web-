import { useContext, useEffect, useRef } from 'react'
import { hash, noise2 } from '../lib/noise'
import { SYMBOL } from './Logo'
import { matrixCell } from './PixelMountains'
import { RAMP } from './PixelWordmark'
import { RevealReady } from './Reveal'

/**
 * The Danau "D" at hero scale, built from the site's matrix. The four logo quadrants are sampled
 * onto a square grid and assemble one after another out of a faint field once the first-load
 * screen lifts, coloured like the loader's D (same noise, same ramp, brightest at the crown).
 * Where the CSS says the mark stands in the range (--mark-snap: 1), its grid is the mountains'
 * grid, so mark and range share one field. Idles briefly, then holds still until the pointer
 * comes back.
 */

const SYMBOL_BOX = 30.0249
// build order by SYMBOL index: [0] bottom-left, [2] bottom-right, [1] top-right, [3] the wedge last
const QUAD_AT = [0, 320, 160, 520]
// size of a cell's square per ramp step; 0 is the resting field, 1 the field under the lens
const SIZE = [0.18, 0.3, 0.7, 0.74, 0.78, 0.82, 0.86]
const GROW = 480
const RISE = 2 // cells a pixel rises while it lands
const FLOW_MS = 8000 // ambient flow after the intro
const WAKE_MS = 4000 // flow kept alive after the last pointer move
const IDLE_FRAME = 66 // ~15fps while flowing
const LENS = 8 // lens radius in cells

interface Cell {
  x: number
  y: number
  i: number
  j: number
  q: number // quadrant (SYMBOL index), -1 for field dots
  edge: boolean
  delay: number
}

export function PixelMark({ className, delay = 250 }: { className?: string; delay?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const ready = useContext(RevealReady)
  const readyRef = useRef(ready)
  const kickRef = useRef<() => void>(() => {})

  useEffect(() => {
    readyRef.current = ready
    if (ready) kickRef.current()
  }, [ready])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const host = (canvas.closest('[data-pixel-host]') as HTMLElement | null) ?? canvas.parentElement!
    let cells: Cell[] = []
    let n = 0 // D cells across
    let cell = 8
    let w = 0
    let h = 0
    let introEnd = 0
    let raf = 0
    let start = -1
    let last = 0
    // the flow's own clock: it runs only while the mark is flowing, so a wake after a rest,
    // a scroll back or a resize carries on from the pattern last shown instead of jumping
    let flowT = -1
    let flowAt = -1
    let flowUntil = 0
    let visible = false
    let dirty = true
    const pointer = { x: -1e4, y: -1e4, on: false }
    let k = new Uint8Array(0)

    const build = () => {
      const cr = canvas.getBoundingClientRect()
      const box = canvas.parentElement!.getBoundingClientRect()
      w = cr.width
      h = cr.height
      if (!w || !box.width) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const hr = host.getBoundingClientRect()
      const snap = getComputedStyle(canvas).getPropertyValue('--mark-snap').trim() === '1'
      cell = matrixCell(hr.width)
      // an even count puts the seam between the quadrants on a cell edge
      n = Math.max(20, Math.min(72, 2 * Math.round(box.width / cell / 2)))
      let ox: number
      let oy: number
      if (snap) {
        // the mountains' grid starts at the host's left and bottom edges
        const left = Math.round((box.left - hr.left) / cell) * cell
        const bottom = Math.round((hr.bottom - box.bottom) / cell) * cell
        ox = hr.left + left - cr.left
        oy = hr.bottom - bottom - n * cell - cr.top
      } else {
        // free: the D fills its box exactly (the tablet and phone lockup sits on its baseline)
        cell = box.width / n
        ox = box.left - cr.left
        oy = box.top - cr.top
      }

      // sample each quadrant alone at 4x4 per cell
      const ss = 4
      const res = n * ss
      const off = document.createElement('canvas')
      off.width = off.height = res
      const o = off.getContext('2d', { willReadFrequently: true })
      if (!o) return
      const quad = new Int8Array(n * n).fill(-1)
      const cover = new Float32Array(n * n)
      const bounds = SYMBOL.map(() => ({ j0: n, j1: 0 }))
      SYMBOL.forEach((d, q) => {
        o.setTransform(1, 0, 0, 1, 0, 0)
        o.clearRect(0, 0, res, res)
        o.scale(res / SYMBOL_BOX, res / SYMBOL_BOX)
        o.fillStyle = '#fff'
        o.fill(new Path2D(d))
        const data = o.getImageData(0, 0, res, res).data
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++) {
            let c = 0
            for (let a = 0; a < ss; a++) for (let b = 0; b < ss; b++) c += data[((j * ss + b) * res + (i * ss + a)) * 4 + 3]
            c /= ss * ss * 255
            if (c > 0.5 && c > cover[i * n + j]) {
              quad[i * n + j] = q
              cover[i * n + j] = c
              bounds[q].j0 = Math.min(bounds[q].j0, j)
              bounds[q].j1 = Math.max(bounds[q].j1, j)
            }
          }
      })

      const next: Cell[] = []
      // field: the grid around the mark, thinning with distance from its centre
      const a0 = Math.floor(-ox / cell)
      const a1 = Math.ceil((w - ox) / cell)
      const b0 = Math.floor(-oy / cell)
      const b1 = Math.ceil((h - oy) / cell)
      const half = Math.max(w, h) / 2 / cell
      for (let i = a0; i < a1; i++)
        for (let j = b0; j < b1; j++) {
          const inD = i >= 0 && j >= 0 && i < n && j < n && quad[i * n + j] >= 0
          const x = ox + i * cell
          const y = oy + j * cell
          if (inD) {
            const q = quad[i * n + j]
            const { j0, j1 } = bounds[q]
            const rel = j1 > j0 ? (j - j0) / (j1 - j0) : 1 // 0 at the quadrant's top, 1 at its bottom
            next.push({
              x, y, i, j, q,
              edge: cover[i * n + j] < 0.8,
              delay: delay + QUAD_AT[q] + (1 - rel) * 420 + hash(i, j, 4) * 140,
            })
          } else {
            const dist = Math.hypot(i + 0.5 - n / 2, j + 0.5 - n / 2) / half
            if (dist > 1 || hash(i + 4096, j + 4096, 5) > 0.62 - dist * 0.6) continue
            next.push({ x, y, i, j, q: -1, edge: false, delay: delay * 0.4 + dist * 200 })
          }
        }
      cells = next
      k = new Uint8Array(cells.length)
      introEnd = delay + Math.max(...QUAD_AT) + 420 + 140 + GROW
      dirty = true
    }

    const draw = (now: number) => {
      raf = 0
      if (!readyRef.current || !visible || document.hidden) return
      if (start < 0) {
        start = now
        flowUntil = now + introEnd + FLOW_MS
      }
      const t = reduce ? 1e9 : now - start
      const intro = t < introEnd
      const flowing = !reduce && now < flowUntil
      // between intro frames and pointer moves, flow repaints at ~15fps
      if (!intro && !dirty && (!flowing || now - last < IDLE_FRAME)) {
        if (flowing) raf = requestAnimationFrame(draw)
        return
      }
      last = now
      dirty = false
      if (flowT < 0) flowT = now
      if (flowing) {
        if (flowAt >= 0) flowT += Math.min(now - flowAt, IDLE_FRAME * 3)
        flowAt = now
      } else flowAt = -1
      const flow = reduce ? 0 : flowT * 0.00004
      const f = 2.8 / n // the loader's D spans ~23 cells at 0.12: keep its light pattern
      ctx.clearRect(0, 0, w, h)

      // the colour step of every cell this frame
      for (let c = 0; c < cells.length; c++) {
        const p = cells[c]
        if (p.q < 0) {
          k[c] = 0
        } else {
          const v = noise2(p.i * f + flow, p.j * f - flow, 61) * 0.65 + (1 - p.j / n) * 0.45
          k[c] = Math.max(2, Math.min(6, Math.floor(v * RAMP.length)))
        }
      }

      for (let pass = 0; pass < RAMP.length; pass++) {
        ctx.fillStyle = RAMP[pass]
        for (let c = 0; c < cells.length; c++) {
          const p = cells[c]
          let lvl = k[c]
          let s = SIZE[lvl]
          let dy = 0
          let alpha = 1
          if (p.q < 0) {
            const e = intro ? Math.min(1, Math.max(0, (t - p.delay) / 300)) : 1
            if (e <= 0) continue
            alpha = 0.32 * e
          } else if (intro) {
            const pr = (t - p.delay) / GROW
            if (pr <= 0) continue
            if (pr < 1) {
              const e = 1 - Math.pow(1 - pr, 4)
              s *= 0.16 + 0.84 * e
              dy = (1 - e) * RISE * cell
              if (pr < 0.25) lvl = 6
            }
          }
          if (p.edge) s *= 0.85
          if (pointer.on) {
            const d = Math.hypot(p.x + cell / 2 - pointer.x, p.y + cell / 2 - pointer.y) / cell
            if (p.q < 0 && d < LENS * 0.6) {
              lvl = 1
              s = SIZE[1]
              alpha = 0.6
            } else if (p.q >= 0 && d < LENS) {
              const fl = 1 - d / LENS
              lvl = Math.min(6, lvl + (fl > 0.5 ? 2 : 1))
              s = Math.min(0.92, s * (1 + fl * 0.12))
            }
          }
          if (lvl !== pass) continue
          const size = s * cell
          ctx.globalAlpha = alpha
          ctx.fillRect(p.x + (cell - size) / 2, p.y + (cell - size) / 2 + dy, size, size)
        }
      }
      ctx.globalAlpha = 1
      if (!reduce && (intro || flowing)) raf = requestAnimationFrame(draw)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    kickRef.current = kick

    build()
    const ro = new ResizeObserver(() => {
      build()
      kick()
    })
    ro.observe(canvas)
    ro.observe(host)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) {
        dirty = true
        kick()
      }
    })
    io.observe(canvas)
    // the lens only changes pixels near the mark; elsewhere a move just keeps the flow awake
    const near = (x: number, y: number) => {
      const reach = LENS * cell
      return x > -reach && y > -reach && x < w + reach && y < h + reach
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || reduce) return
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      // repaint when the lens reaches the mark, and once more as it leaves to clear it
      if (near(x, y) || (pointer.on && near(pointer.x, pointer.y))) dirty = true
      pointer.x = x
      pointer.y = y
      pointer.on = true
      flowUntil = Math.max(flowUntil, performance.now() + WAKE_MS)
      kick()
    }
    const onLeave = () => {
      pointer.on = false
      dirty = true
      kick()
    }
    const onVisibility = () => {
      dirty = true
      kick()
    }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      kickRef.current = () => {}
    }
  }, [delay])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
