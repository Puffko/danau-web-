import Lenis from 'lenis'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

const LenisContext = createContext<Lenis | null>(null)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const ref = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 0.95 })
    ref.current = instance
    setLenis(instance)
    return () => {
      instance.destroy()
      ref.current = null
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

/** Scrolls to an element or the top, smoothly when Lenis runs and instantly otherwise. */
export function scrollToTarget(lenis: Lenis | null, target: string | HTMLElement | number, immediate = false) {
  const offset = typeof target === 'number' ? 0 : -88
  if (lenis) {
    // A navigation that closes the mobile menu scrolls while Lenis is still stopped. Restart it
    // first: starting it again afterwards would reset and cancel this scroll.
    if (lenis.isStopped) lenis.start()
    lenis.scrollTo(target, { offset, immediate, duration: immediate ? 0 : 1.1 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'auto' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'auto' })
}
