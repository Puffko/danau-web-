import { useEffect, useRef } from 'react'
import { hash } from '../lib/noise'

// The footer wordmark's pale ramp, bluest at the baseline; every step is above 6:1 on the night hero.
const RAMP = ['#b3c2ff', '#c8d3ff', '#dae3ff', '#eef1ff', '#ffffff', '#ffffff']

/**
 * A word set in the site's pixel mosaic, like the footer wordmark: the real text stays in place
 * (transparent, so it keeps the line's metrics, wraps, selects and reads aloud as usual) and a
 * canvas over it paints each glyph as square cells with hairline gaps, coloured like the footer
 * wordmark. Only cells the glyph really fills are drawn, so no stray pixels stick out. The cells
 * assemble from left to right after the headline's reveal, then the word stays still.
 */

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
    let visible = true
    let top = 0
    let bottom = 1
    let dpr = 1

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
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // about 17 cells to the em: fine enough to keep the font's exact letterforms
      cell = Math.max(2, size / 16)
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

      // Rasterise each character on its own, exactly where the browser laid it out (kerning and
      // tracking included), and remember which letter owns each cell. Tightly set pairs like
      // "rn" or "IT" would otherwise melt into one shape on the grid.
      const range = document.createRange()
      const best = new Float32Array(cols * rows)
      const owner = new Int16Array(cols * rows).fill(-1)
      for (let c = 0; c < text.length; c++) {
        if (text[c] === ' ') continue
        range.setStart(node, c)
        range.setEnd(node, c + 1)
        const r = range.getBoundingClientRect()
        const x = r.left - box.left
        o.save()
        o.setTransform(1, 0, 0, 1, 0, 0)
        o.clearRect(0, 0, off.width, off.height)
        o.restore()
        o.fillText(text[c], x, r.top - box.top + padTop + ascent)
        // only the columns this glyph can reach (with room for overhangs) need sampling
        const i0 = Math.max(0, Math.floor((x - size * 0.2) / cell))
        const i1 = Math.min(cols - 1, Math.ceil((x + r.width + size * 0.2) / cell))
        const sx = i0 * ss
        const sw = (i1 - i0 + 1) * ss
        const data = o.getImageData(sx, 0, sw, off.height).data
        for (let i = i0; i <= i1; i++) {
          for (let j = 0; j < rows; j++) {
            let cover = 0
            for (let a = 0; a < ss; a++)
              for (let b = 0; b < ss; b++) cover += data[((j * ss + b) * sw + ((i - i0) * ss + a)) * 4 + 3]
            cover /= ss * ss * 255
            const at = i * rows + j
            if (cover > best[at]) {
              best[at] = cover
              owner[at] = c
            }
          }
        }
      }

      const next: Cell[] = []
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const at = i * rows + j
          const cover = best[at]
          if (cover <= 0.5) continue
          // keep one empty column between neighbouring letters: a cell that touches a cell of
          // another letter directly to its left (or diagonally) gives way to it
          let touches = false
          if (i > 0) {
            for (let dj = -1; dj <= 1; dj++) {
              const jj = j + dj
              if (jj < 0 || jj >= rows) continue
              const left = (i - 1) * rows + jj
              if (best[left] > 0.5 && owner[left] !== owner[at]) touches = true
            }
          }
          if (touches) continue
          next.push({
            x: i * cell,
            y: j * cell,
            edge: cover < 0.6,
            delay: delay + (i / cols) * 520 + hash(i, j, 7) * 160,
          })
        }
      }
      cells = next
      top = Math.min(...next.map((c) => c.y), h)
      bottom = Math.max(...next.map((c) => c.y + cell), 1)
    }

    const draw = (now: number) => {
      raf = 0
      if (start < 0) start = now
      const t = reduce ? 1e9 : now - start
      const intro = !reduce && t < delay + 1100
      ctx.clearRect(0, 0, w, h)
      // square cells with a hairline gap, coloured like the footer wordmark: white at the top of
      // the letters, stepping down through pale blues to the brand's light blue at the baseline
      const gap = Math.max(0.6, cell * 0.14)
      for (const c of cells) {
        let grow = 1
        if (intro) {
          const p = (t - c.delay) / 420
          if (p <= 0) continue
          if (p < 1) grow = 1 - Math.pow(1 - p, 3)
        }
        const v = 1 - (c.y + cell / 2 - top) / Math.max(1, bottom - top)
        const k = Math.max(0, Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)))
        const s = (cell - gap) * grow
        ctx.globalAlpha = Math.min(1, grow * 1.3)
        ctx.fillStyle = RAMP[k]
        ctx.fillRect(c.x + (cell - s) / 2, c.y + (cell - s) / 2, s, s)
      }
      ctx.globalAlpha = 1
      if (intro) schedule()
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
