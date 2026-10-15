import { useEffect, useRef } from 'react'
import type { IllustrationName } from '../data/site'
import { hash } from '../lib/noise'
import { ART } from './illustrations'

/**
 * A service illustration rasterised into the same dot matrix as the hero range:
 * the stroke paths are sampled onto a square grid and every covered cell becomes
 * a pixel. Cells ignite on load, idle with sparse twinkles and swell under the pointer.
 */

// On night grounds the glyph glows pale; on light grounds it is drawn in the brand blues.
const TONES = {
  dark: { colors: ['#4A55FF', '#9AA8FF', '#D4DCFF', '#FFFFFF'], alpha: [0.35, 0.9, 1, 1] },
  light: { colors: ['#B3C2FF', '#5D68FF', '#1818EC', '#1010DC'], alpha: [0.55, 1, 1, 1] },
}

interface Cell {
  x: number
  y: number
  level: number
  delay: number
  phase: number
}

interface Props {
  name: IllustrationName
  className?: string
  tone?: keyof typeof TONES
  /** Multiplies the ignite timing; below 1 assembles faster (the boot screen uses 0.4). */
  pace?: number
}

export function PixelGlyph({ name, className, tone = 'dark', pace = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const art = ART[name]
    let cells: Cell[] = []
    let size = 0
    let cell = 0
    let raf = 0
    let start = -1
    let visible = true
    const pointer = { x: -1e4, y: -1e4, on: false }

    const build = () => {
      size = canvas.getBoundingClientRect().width
      if (!size) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(size * dpr)
      canvas.height = Math.round(size * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const n = size < 220 ? 26 : 34
      cell = size / n
      // rasterise the strokes at 4 samples per cell
      const res = n * 4
      const off = document.createElement('canvas')
      off.width = off.height = res
      const o = off.getContext('2d')
      if (!o) return
      const [, , vw, vh] = art.viewBox.split(' ').map(Number)
      const pad = 0.14
      const scale = (res * (1 - pad * 2)) / Math.max(vw, vh)
      o.translate((res - vw * scale) / 2, (res - vh * scale) / 2)
      o.scale(scale, scale)
      o.lineWidth = art.stroke * 0.9
      o.lineCap = 'round'
      o.lineJoin = 'round'
      o.strokeStyle = '#fff'
      o.fillStyle = '#fff'
      for (const d of art.paths) {
        if (art.fill) o.fill(new Path2D(d))
        else o.stroke(new Path2D(d))
      }
      const data = o.getImageData(0, 0, res, res).data

      const next: Cell[] = []
      const c = n / 2
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          let cover = 0
          for (let a = 0; a < 4; a++)
            for (let b = 0; b < 4; b++) cover += data[((j * 4 + b) * res + (i * 4 + a)) * 4 + 3]
          cover /= 16 * 255
          const dist = Math.hypot(i + 0.5 - c, j + 0.5 - c) / c
          let level: number
          if (cover > 0.55) level = 3
          else if (cover > 0.2) level = 2
          else if (dist < 0.98 && hash(i, j, 5) < 0.55 - dist * 0.35) level = 0 // faint field around the glyph
          else continue
          next.push({
            x: i * cell,
            y: j * cell,
            level,
            delay: ((1 - j / n) * 700 + hash(i, j, 2) * 400) * pace,
            phase: hash(j, i, 8) * Math.PI * 2,
          })
        }
      }
      cells = next
    }

    const draw = (now: number) => {
      raf = 0
      if (start < 0) start = now
      const t = reduce ? 1e9 : now - start
      ctx.clearRect(0, 0, size, size)
      let pending = false
      for (let pass = 0; pass < 4; pass++) {
        ctx.fillStyle = TONES[tone].colors[pass]
        ctx.globalAlpha = TONES[tone].alpha[pass]
        for (const k of cells) {
          let lvl = k.level
          let grow = 1
          const p = (t - k.delay) / (520 * pace)
          if (p < 1) {
            pending = true
            if (p <= 0) continue
            grow = 1 - Math.pow(1 - p, 4)
            if (p < 0.3 && lvl > 0) lvl = 3
          } else if (!reduce && lvl === 2 && Math.sin(t * 0.0012 + k.phase) > 0.94) lvl = 3
          let s = cell * (lvl === 0 ? 0.26 : 0.8) * grow
          if (pointer.on) {
            const dd = Math.hypot(k.x + cell / 2 - pointer.x, k.y + cell / 2 - pointer.y) / (cell * 4)
            if (dd < 1) {
              s = Math.min(cell - 0.5, s * (1 + (1 - dd) * 0.5))
              if (lvl === 0 && dd < 0.6) lvl = 1
            }
          }
          if (lvl !== pass) continue
          ctx.fillRect(k.x + (cell - s) / 2, k.y + (cell - s) / 2, s, s)
        }
      }
      ctx.globalAlpha = 1
      if (visible && !document.hidden && (!reduce || pending || pointer.on)) raf = requestAnimationFrame(draw)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    build()
    kick()
    const ro = new ResizeObserver(() => {
      build()
      kick()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) kick()
    })
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
      kick()
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
  }, [name, tone, pace])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
