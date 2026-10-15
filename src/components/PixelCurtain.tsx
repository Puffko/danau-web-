import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'
import { hash } from '../lib/noise'

/**
 * Full-screen pixel curtain for page changes. `cover()` fills the screen with blue mosaic
 * pixels in a diagonal wave from the bottom-left; `reveal()` clears them in the same
 * direction, so the new page is uncovered behind the wave. The first load starts covered
 * and reveals once the app is ready.
 */

const COLORS = ['#1818ec', '#1010dc', '#2a35ff', '#0d0f9e', '#1818ec', '#4a55ff']
const COVER_MS = 520
const REVEAL_MS = 640
const CELL_MS = 200

export interface CurtainHandle {
  cover: () => Promise<void>
  reveal: () => Promise<void>
}

export function PixelCurtain({ handle, startCovered }: { handle: Ref<CurtainHandle>; startCovered: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const state = useRef({ mode: startCovered ? 'covered' : 'idle', start: 0, resolve: null as null | (() => void) })
  const run = useRef<() => void>(() => {})

  useImperativeHandle(handle, () => ({
    cover: () =>
      new Promise<void>((resolve) => {
        if (state.current.mode === 'covered') return resolve()
        state.current = { mode: 'cover', start: performance.now(), resolve }
        run.current()
      }),
    reveal: () =>
      new Promise<void>((resolve) => {
        state.current = { mode: 'reveal', start: performance.now(), resolve }
        run.current()
      }),
  }))

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let w = 0
    let h = 0
    let cell = 56
    let cols = 0
    let rows = 0
    let raf = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cell = w < 700 ? 40 : 56
      cols = Math.ceil(w / cell)
      rows = Math.ceil(h / cell)
    }

    // Each cell's place in the wave: 0 at the bottom-left corner, 1 at the top-right.
    const order = (i: number, j: number) => {
      const diag = (i / Math.max(1, cols - 1) + (rows - 1 - j) / Math.max(1, rows - 1)) / 2
      return Math.min(1, Math.max(0, diag * 0.82 + hash(i, j, 3) * 0.18))
    }

    const frame = (now: number) => {
      raf = 0
      const st = state.current
      ctx.clearRect(0, 0, w, h)
      canvas.style.visibility = st.mode === 'idle' ? 'hidden' : 'visible'
      if (st.mode === 'idle') return

      const total = st.mode === 'cover' ? COVER_MS : REVEAL_MS
      const t = now - st.start
      const span = total - CELL_MS
      let done = true

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // 0 = empty cell, 1 = full cell
          let fill = 1
          if (st.mode === 'cover' || st.mode === 'reveal') {
            const p = Math.min(1, Math.max(0, (t - order(i, j) * span) / CELL_MS))
            if (p < 1) done = false
            const eased = 1 - Math.pow(1 - p, 3)
            fill = st.mode === 'cover' ? eased : 1 - eased
          }
          if (fill <= 0.01) continue
          const s = cell * fill + (fill > 0.98 ? 1 : 0)
          ctx.fillStyle = COLORS[Math.floor(hash(j, i, 9) * COLORS.length)]
          ctx.fillRect(i * cell + (cell - s) / 2, j * cell + (cell - s) / 2, s, s)
        }
      }

      if ((st.mode === 'cover' || st.mode === 'reveal') && done) {
        const resolve = st.resolve
        state.current = { mode: st.mode === 'cover' ? 'covered' : 'idle', start: 0, resolve: null }
        resolve?.()
        if (state.current.mode === 'idle') {
          ctx.clearRect(0, 0, w, h)
          canvas.style.visibility = 'hidden'
          return
        }
      }
      if (state.current.mode !== 'covered') raf = requestAnimationFrame(frame)
    }

    run.current = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    resize()
    run.current()
    const onResize = () => {
      resize()
      run.current()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      run.current = () => {}
    }
  }, [])

  return <canvas ref={ref} className="pixel-curtain" aria-hidden="true" />
}
