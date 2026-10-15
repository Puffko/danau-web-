import { useEffect, useRef } from 'react'
import { hash, noise2 } from '../lib/noise'

/**
 * A corner fragment of the pixel sphere from "Ako pracujeme?": a ragged quarter disc of
 * blue mosaic pixels anchored in the top-right corner of its box. At rest it sits still in
 * the brand blues; when `active` (card hovered or focused) it ripples outward from the
 * corner in pale blues meant for a blue ground and keeps flowing slowly until released.
 */

const REST = ['#1010dc', '#1818ec', '#2a35ff', '#4a55ff', '#5d68ff', '#8796ff', '#b3c2ff', '#dae3ff']
const LIVE = ['#2a35ff', '#4a55ff', '#5d68ff', '#8796ff', '#b3c2ff', '#dae3ff', '#eef1ff', '#ffffff']

interface Props {
  active?: boolean
  className?: string
  seed?: number
  /** Disc radius at rest, in px; it grows by a third while active. */
  radius?: number
  cell?: number
  /** Palette while active: pale blues for a blue or night ground, or the resting blues for light cards. */
  activeRamp?: 'live' | 'rest'
  /** At rest only a faint hint of a few pixels in the corner; the mosaic ripples out while active. */
  sparse?: boolean
}

export function PixelCluster({
  active = false,
  className,
  seed = 0,
  radius = 130,
  cell = 11,
  activeRamp = 'live',
  sparse = false,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const kickRef = useRef<() => void>(() => {})

  useEffect(() => {
    activeRef.current = active
    kickRef.current()
  }, [active])

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let changedAt = -1e9
    let wasActive = activeRef.current
    let last = 0

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      raf = 0
      const on = activeRef.current
      if (on !== wasActive) {
        wasActive = on
        changedAt = now
      }
      const since = now - changedAt
      const settling = !reduce && since < 900
      if (!settling && on && !reduce && now - last < 40) {
        raf = requestAnimationFrame(draw)
        return
      }
      last = now

      const t = reduce ? 0 : now
      const R = radius * (on ? 1.34 : 1)
      const ramp = on && activeRamp === 'live' ? LIVE : REST
      const cols = Math.ceil(w / cell)
      const rows = Math.ceil(h / cell)
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // distance from the top-right corner (column i counts leftwards from the right edge)
          const dx = (i + 0.5) * cell
          const dy = (j + 0.5) * cell
          const d = Math.hypot(dx, dy)
          const edge = R * (0.74 + 0.32 * noise2(i * 0.33, j * 0.33, seed + 3))
          const stray = d < R * 1.28 && hash(i, j, seed + 11) < 0.1
          if (d > edge && !stray) continue

          // the resting pixels: stray ones around a full corner, or in sparse mode a faint few
          const scatter = sparse ? d < radius * 0.5 && hash(i, j, seed + 17) < 0.2 : stray

          let grow = 1
          if (sparse && !scatter) {
            // the full mosaic: ripples out from the corner on hover, shrinks back into it after
            const p = (since - (on ? (d / R) * 420 : (1 - d / R) * 260) - hash(i, j, seed + 5) * 120) / 340
            if (on) {
              if (settling && p <= 0) continue
              if (settling && p < 1) grow = 1 - Math.pow(1 - p, 3)
            } else {
              if (!settling || p >= 1) continue
              if (p > 0) grow = Math.pow(1 - p, 2)
            }
          } else if (settling) {
            const p = (since - (d / R) * 420 - hash(i, j, seed + 5) * 140) / 320
            if (p <= 0) {
              // cells that only exist in the larger, active disc wait for the ripple
              if (on && d > radius) continue
              grow = on ? 1 : 0.6
            } else if (p < 1) grow = 1 - Math.pow(1 - p, 3) * (on ? 0.6 : 0)
          }

          let v =
            noise2(i * 0.24 + t * 0.00005, j * 0.24 - t * 0.00003, seed + 41) * 0.7 +
            noise2(i * 0.6, j * 0.6, seed + 7) * 0.3
          v += (d / R) * 0.45 - 0.15
          const k = Math.max(0, Math.min(ramp.length - 1, Math.floor(v * ramp.length)))
          const s = (cell - 1) * grow
          // the sparse hint stays quiet at rest
          ctx.globalAlpha = sparse && !on && scatter ? 0.4 : 1
          ctx.fillStyle = ramp[k]
          ctx.fillRect(w - (i + 1) * cell + (cell - s) / 2, j * cell + (cell - s) / 2, s, s)
        }
      }

      ctx.globalAlpha = 1
      if (settling || (on && !reduce)) raf = requestAnimationFrame(draw)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    kickRef.current = kick

    resize()
    kick()
    const ro = new ResizeObserver(() => {
      resize()
      kick()
    })
    ro.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      kickRef.current = () => {}
    }
  }, [seed, radius, cell, activeRamp, sparse])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
