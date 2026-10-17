import { useEffect, useRef, type ReactNode } from 'react'
import { prefersReducedMotion } from '../lib/motion'
import './ShinyText.css'

/**
 * A band of light sweeps across the text, painted as a gradient clipped to the glyphs. After
 * ShinyText from React Bits (reactbits.dev), cut down to the looping sweep this site uses. Pauses
 * offscreen; with reduced motion it stays plain text.
 */

type Rgba = [number, number, number, number]

const FALLOFF = [0, 0.2, 0.4, 0.6, 0.8, 1]

const smooth = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

let paint: CanvasRenderingContext2D | null = null

const parseColor = (value: string): Rgba | null => {
  if (typeof document === 'undefined') return null
  if (!paint) paint = document.createElement('canvas').getContext('2d')
  if (!paint) return null
  paint.fillStyle = '#000000'
  paint.fillStyle = value
  const resolved = String(paint.fillStyle)
  if (resolved.startsWith('#')) {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(resolved.slice(i, i + 2), 16))
    return [r, g, b, 1]
  }
  const parts = resolved.match(/[\d.]+/g)
  if (!parts || parts.length < 3) return null
  return [Number(parts[0]), Number(parts[1]), Number(parts[2]), parts.length > 3 ? Number(parts[3]) : 1]
}

const blend = (from: Rgba, to: Rgba, amount: number) => {
  const channel = (a: number, b: number) =>
    Math.round(Math.pow(Math.pow(a / 255, 2.2) * (1 - amount) + Math.pow(b / 255, 2.2) * amount, 1 / 2.2) * 255)
  const alpha = from[3] * (1 - amount) + to[3] * amount
  if (alpha <= 0) return 'rgba(0, 0, 0, 0)'
  const weigh = (a: number, b: number) => (a * from[3] * (1 - amount) + b * to[3] * amount) / alpha
  const r = from[3] === to[3] ? channel(from[0], to[0]) : Math.round(weigh(from[0], to[0]))
  const g = from[3] === to[3] ? channel(from[1], to[1]) : Math.round(weigh(from[1], to[1]))
  const b = from[3] === to[3] ? channel(from[2], to[2]) : Math.round(weigh(from[2], to[2]))
  return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 1000) / 1000})`
}

/**
 * The site's sheen: a soft, darker band drifts slowly and steadily across the heading. On night
 * grounds the letters stay pure white and the band is a soft grey (still ~7.5:1 on the night); on
 * white grounds ink passes through a grey that keeps 4.8:1, so text never fades out.
 */
export const glint = (tone: 'light' | 'dark') => ({
  color: tone === 'light' ? '#ffffff' : '#111827',
  shineColor: tone === 'light' ? '#9ca3af' : '#6b7280',
  /** Seconds one sweep takes. */
  speed: 3.6,
  /** Seconds between sweeps. */
  delay: 0.8,
  /** Width of the band, in % of the text. */
  shineWidth: 34,
  /** 0 = hard-edged band, 1 = all falloff. */
  softness: 0.9,
  angle: 112,
})

type Settings = ReturnType<typeof glint> & { disabled: boolean }

interface Props extends ReturnType<typeof glint> {
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function ShinyText({ children, disabled = false, className = '', ...look }: Props) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const settingsRef = useRef<Settings>({ ...look, disabled })
  settingsRef.current = { ...look, disabled }
  const syncRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    syncRef.current?.()
  })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const get = () => settingsRef.current

    const reduce = prefersReducedMotion()
    const state = {
      pos: null as number | null,
      phase: 'idle' as 'idle' | 'sweep' | 'wait',
      from: 0,
      to: 0,
      start: 0,
      duration: 1,
      resume: 0,
      visible: true,
      colors: '',
    }
    let base: Rgba | null = null
    let shine: Rgba | null = null
    let raf = 0
    let timer = 0
    let alive = true

    // the band enters past the right edge and leaves past the left one
    const extent = () => get().shineWidth / 2 + 2
    const entry = () => 100 + extent()
    const exit = () => -extent()

    const gradient = (pos: number, fill: Rgba) => {
      const s = get()
      const half = s.shineWidth / 2
      const core = half * (1 - s.softness)
      const fade = half - core
      const stops: [number, number][] = []
      for (const side of [-1, 1]) {
        for (const f of FALLOFF) stops.push([pos + side * (core + fade * (1 - f)), f * f * (3 - 2 * f)])
      }
      stops.sort((a, b) => a[0] - b[0])
      const list = stops.map(([at, amount]) => `${blend(fill, shine as Rgba, amount)} ${at.toFixed(2)}%`)
      return `linear-gradient(${s.angle}deg, ${blend(fill, shine as Rgba, 0)} 0%, ${list.join(', ')}, ${blend(fill, shine as Rgba, 0)} 100%)`
    }

    const draw = () => {
      const s = get()
      const key = `${s.color}|${s.shineColor}`
      if (key !== state.colors) {
        state.colors = key
        base = parseColor(s.color)
        shine = parseColor(s.shineColor)
      }
      root.style.backgroundImage =
        !base || !shine || state.pos === null || s.disabled ? `linear-gradient(${s.color}, ${s.color})` : gradient(state.pos, base)
    }

    const sweep = (now: number) => {
      state.phase = 'sweep'
      state.from = entry()
      state.to = exit()
      state.start = now
      state.duration = get().speed * 1000
    }

    const wake = () => {
      if (raf || !alive) return
      window.clearTimeout(timer)
      timer = 0
      raf = requestAnimationFrame(tick)
    }

    const tick = (now: number) => {
      raf = 0
      if (!alive) return
      const s = get()
      if (s.disabled) {
        state.pos = null
        state.phase = 'idle'
        draw()
        return
      }
      if (state.phase === 'sweep') {
        const t = clamp((now - state.start) / state.duration, 0, 1)
        state.pos = state.from + (state.to - state.from) * smooth(t)
        draw()
        if (t < 1) {
          raf = requestAnimationFrame(tick)
          return
        }
        state.phase = 'wait'
        state.resume = now + s.delay * 1000
      }
      if (state.phase === 'wait') {
        if (!state.visible) return
        if (now < state.resume) {
          window.clearTimeout(timer)
          timer = window.setTimeout(wake, state.resume - now)
          return
        }
        sweep(now)
        raf = requestAnimationFrame(tick)
        return
      }
      if (state.phase === 'idle' && !reduce && state.visible) {
        sweep(now)
        raf = requestAnimationFrame(tick)
      }
    }

    const observer = new IntersectionObserver((entries) => {
      state.visible = entries.some((item) => item.isIntersecting)
      if (state.visible) wake()
    })
    observer.observe(root)

    syncRef.current = () => {
      if (get().disabled) {
        state.pos = null
        state.phase = 'idle'
      }
      draw()
      wake()
    }
    draw()
    wake()

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      observer.disconnect()
      syncRef.current = null
    }
  }, [])

  return (
    <span
      ref={rootRef}
      className={`shiny-text${className ? ` ${className}` : ''}`}
      style={{ backgroundImage: `linear-gradient(${look.color}, ${look.color})` }}
    >
      {children}
    </span>
  )
}
