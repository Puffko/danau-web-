import { useEffect, useRef } from 'react'
import { hash, noise2 } from '../lib/noise'

/**
 * A word set in the site's pixel mosaic, like the footer wordmark: the real text stays in place
 * (transparent, so it keeps the line's metrics, wraps, selects and reads aloud as usual) and a
 * canvas over it paints each glyph as square cells in pale blues. The cells assemble from left to
 * right after the headline's reveal, then shimmer slowly.
 */

// Pale end of the brand ramp only: every step stays well above 7:1 on the night hero.
const RAMP = ['#b3c2ff', '#c4cfff', '#dae3ff', '#eef1ff', '#ffffff']
// The clipping mask of the headline reveal leaves this much room around a word (in em).
const PAD_TOP = 0.08
const PAD_BOTTOM = 0.12

interface Cell {
  x: number
  y: number
  edge: boolean
  delay: number
}

export function PixelWord({ text, delay = 0 }: { text: string; delay?: number }) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const textEl = textRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !textEl || !canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cells: Cell[] = []
    let cell = 4
    let w = 0
    let h = 0
    let raf = 0
    let start = -1
    let last = 0
    let visible = true

    const build = () => {
      const node = textEl.firstChild
      if (!node) return
      const style = getComputedStyle(textEl)
      const size = parseFloat(style.fontSize)
      const box = wrap.getBoundingClientRect()
      const padTop = size * PAD_TOP
      w = box.width
      h = box.height + padTop + size * PAD_BOTTOM
      canvas.style.top = `${-padTop}px`
      canvas.style.height = `${h}px`
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // about 17 cells to the em: crisp letterforms, still clearly pixels
      cell = Math.max(2.2, size / 17)
      const cols = Math.ceil(w / cell)
      const rows = Math.ceil(h / cell)
      const ss = 4
      const off = document.createElement('canvas')
      off.width = cols * ss
      off.height = rows * ss
      const o = off.getContext('2d')
      if (!o) return
      const k = ss / cell
      o.scale(k, k)
      o.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      o.fillStyle = '#fff'
      o.textBaseline = 'alphabetic'
      const ascent = o.measureText('Hg').fontBoundingBoxAscent || size * 0.8

      // draw each character exactly where the browser laid it out (kerning, tracking included)
      const range = document.createRange()
      for (let i = 0; i < text.length; i++) {
        range.setStart(node, i)
        range.setEnd(node, i + 1)
        const r = range.getBoundingClientRect()
        o.fillText(text[i], r.left - box.left, r.top - box.top + padTop + ascent)
      }

      const data = o.getImageData(0, 0, off.width, off.height).data
      const next: Cell[] = []
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let cover = 0
          for (let a = 0; a < ss; a++)
            for (let b = 0; b < ss; b++) cover += data[((j * ss + b) * off.width + (i * ss + a)) * 4 + 3]
          cover /= ss * ss * 255
          if (cover <= 0.45) continue
          next.push({
            x: i * cell,
            y: j * cell,
            edge: cover < 0.75,
            delay: delay + (i / cols) * 520 + hash(i, j, 7) * 160,
          })
        }
      }
      cells = next
    }

    const draw = (now: number) => {
      raf = 0
      if (start < 0) start = now
      const t = reduce ? 1e9 : now - start
      const intro = !reduce && t < delay + 1100
      if (!intro && now - last < 90) {
        schedule()
        return
      }
      last = now
      ctx.clearRect(0, 0, w, h)
      const flow = reduce ? 0 : now
      const gap = Math.max(0.5, cell * 0.12)
      for (const c of cells) {
        let grow = 1
        if (intro) {
          const p = (t - c.delay) / 420
          if (p <= 0) continue
          if (p < 1) grow = 1 - Math.pow(1 - p, 3)
        }
        const i = c.x / cell
        const j = c.y / cell
        // white at the top of the letters, settling into pale blue towards the baseline (as the
        // footer wordmark), with a slow drift of light across
        let v = 1.05 - (c.y / h) * 0.75 + (noise2(i * 0.07 + flow * 0.00004, j * 0.1, 23) - 0.5) * 0.35
        if (c.edge) v -= 0.2
        const k = Math.max(0, Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)))
        const s = (cell - gap) * grow
        ctx.globalAlpha = Math.min(1, grow * 1.3)
        ctx.fillStyle = RAMP[k]
        ctx.fillRect(c.x + (cell - s) / 2, c.y + (cell - s) / 2, s, s)
      }
      ctx.globalAlpha = 1
      if (!reduce) schedule()
    }

    const schedule = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw)
    }

    let ready = false
    const init = () => {
      if (ready) return
      ready = true
      build()
      schedule()
    }
    // wait for the web font so the pixels follow the real letterforms
    if (document.fonts?.status === 'loaded') init()
    else document.fonts?.ready.then(init) ?? init()

    const ro = new ResizeObserver(() => {
      if (!ready) return
      build()
      schedule()
    })
    ro.observe(wrap)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      schedule()
    })
    io.observe(wrap)
    const onVis = () => schedule()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [text, delay])

  return (
    <span ref={wrapRef} className="pixel-word">
      <span ref={textRef} className="pixel-word__text">
        {text}
      </span>
      <canvas ref={canvasRef} className="pixel-word__canvas" aria-hidden="true" />
    </span>
  )
}
