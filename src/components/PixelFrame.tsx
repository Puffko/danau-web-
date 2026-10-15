import { useEffect, useRef } from 'react'
import { hash } from '../lib/noise'

/**
 * A light scatter of pixels along a card's edge, thinning towards the inside, so the card reads
 * as framed in the site's mosaic. It stays inside the card's padding and its rounded corners.
 * `active` repaints it in pale blues for the card's blue hover state.
 */

const REST = ['#dae3ff', '#b3c2ff', '#8796ff', '#5d68ff']
const LIVE = ['#ffffff', '#eef1ff', '#dae3ff', '#b3c2ff']

interface Props {
  active?: boolean
  className?: string
  seed?: number
  cell?: number
  radius?: number
}

export function PixelFrame({ active = false, className, seed = 0, cell = 8, radius = 24 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const paintRef = useRef<() => void>(() => {})

  useEffect(() => {
    activeRef.current = active
    paintRef.current()
  }, [active])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const paint = () => {
      const r = canvas.getBoundingClientRect()
      const w = r.width
      const h = r.height
      if (!w || !h) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const ramp = activeRef.current ? LIVE : REST
      const cols = Math.floor(w / cell)
      const rows = Math.floor(h / cell)
      const ox = (w - cols * cell) / 2
      const oy = (h - rows * cell) / 2
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const e = Math.min(i, j, cols - 1 - i, rows - 1 - j)
          if (e > 2) continue
          const chance = e === 0 ? 0.24 : e === 1 ? 0.09 : 0.03
          if (hash(i, j, seed + 31) >= chance) continue
          const cx = ox + (i + 0.5) * cell
          const cy = oy + (j + 0.5) * cell
          // keep inside the rounded corners
          const dx = Math.max(radius - cx, cx - (w - radius), 0)
          const dy = Math.max(radius - cy, cy - (h - radius), 0)
          if (dx && dy && Math.hypot(dx, dy) > radius - cell * 0.75) continue
          const k = Math.min(ramp.length - 1, Math.floor(hash(j, i, seed + 7) * ramp.length) + e)
          const s = cell - 2
          ctx.fillStyle = ramp[k]
          ctx.fillRect(ox + i * cell + 1, oy + j * cell + 1, s, s)
        }
      }
    }
    paintRef.current = paint
    paint()
    const ro = new ResizeObserver(paint)
    ro.observe(canvas)
    return () => {
      ro.disconnect()
      paintRef.current = () => {}
    }
  }, [seed, cell, radius])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
