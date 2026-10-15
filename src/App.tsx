import { motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PixelCurtain, type CurtainHandle } from './components/PixelCurtain'
import { PixelGlyph } from './components/PixelGlyph'
import { EASE_OUT } from './components/Reveal'
import { cookies, pageMeta, privacy } from './data/site'
import { prefersReducedMotion, scrollToTarget, useLenis } from './hooks/smoothScroll'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import Service from './pages/Service'

const NOT_FOUND_META = {
  title: 'Stránka neexistuje — Danau',
  description: 'Stránka, ktorú hľadáte, na webe danau.sk neexistuje.',
}

/** Route paths match case-insensitively and with a trailing slash, so the meta lookup does too. */
const metaKey = (pathname: string) => pathname.replace(/\/+$/, '').toLowerCase() || '/'

function useDocumentMeta(pathname: string) {
  useEffect(() => {
    const meta = pageMeta[metaKey(pathname)] ?? NOT_FOUND_META
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [pathname])
}

/** The element a URL hash points at. Never throws: hashes from outside can be anything. */
function hashTarget(hash: string) {
  if (!hash || hash.length < 2) return null
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)))
  } catch {
    return null
  }
}

/** Focus an element once nothing around it is inert (the mobile menu releases the page a frame later). */
function focusWhenReady(el: HTMLElement, tries = 12) {
  if (el.closest('[inert]') && tries > 0) {
    requestAnimationFrame(() => focusWhenReady(el, tries - 1))
    return
  }
  el.focus({ preventScroll: true })
}

/** Scroll to a section and move keyboard focus there without a second jump. */
function goToSection(lenis: ReturnType<typeof useLenis>, el: HTMLElement) {
  scrollToTarget(lenis, el)
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  focusWhenReady(el)
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function App() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const lenis = useLenis()
  const reduce = useRef(prefersReducedMotion()).current
  const curtain = useRef<CurtainHandle>(null)

  // The page on screen. With motion on, it changes only once the pixel curtain has covered
  // the old page, so the swap and the jump to the new scroll position happen out of sight.
  const [shown, setShown] = useState(location)
  const [booted, setBooted] = useState(reduce)
  const [bootMark, setBootMark] = useState(!reduce)

  const positions = useRef(new Map<string, number>())
  // The history entry whose page is on screen; null while pages are swapping.
  const shownKey = useRef<string | null>(location.key)
  const shownPath = useRef(location.pathname)
  const hasNavigated = useRef(false)
  const navSeq = useRef(0)
  const latest = useRef({ location, type: navigationType })
  latest.current = { location, type: navigationType }
  useDocumentMeta(shown.pathname)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // First load: the curtain starts closed with the pixel D, then opens once fonts are in.
  useEffect(() => {
    if (reduce) return
    let cancelled = false
    Promise.all([document.fonts?.ready ?? Promise.resolve(), wait(900)]).then(() => {
      if (cancelled) return
      setBooted(true)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setBootMark(false)
          curtain.current?.reveal()
        }),
      )
    })
    return () => {
      cancelled = true
    }
  }, [reduce])

  // Remember the scroll position of the page on screen, so Back/Forward can return to it.
  useEffect(() => {
    let raf = 0
    const save = () => {
      raf = 0
      if (shownKey.current) positions.current.set(shownKey.current, window.scrollY)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(save)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // A navigation starts. Same-page ones (hash links, links to this page) swap at once;
  // a new page waits for the curtain to cover the old one.
  useLayoutEffect(() => {
    if (location.key === shown.key) return
    if (shownKey.current) positions.current.set(shownKey.current, window.scrollY)
    const seq = ++navSeq.current
    if (location.pathname === shownPath.current || reduce || !curtain.current) {
      setShown(location)
      return
    }
    shownKey.current = null
    curtain.current.cover().then(() => {
      if (seq === navSeq.current) setShown(latest.current.location)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  // The shown page changed: place it (top, saved position or hash target), then open the curtain.
  useEffect(() => {
    if (shownKey.current === shown.key) return
    const pathChanged = shown.pathname !== shownPath.current
    const type = latest.current.type
    shownPath.current = shown.pathname
    hasNavigated.current = true

    const el = hashTarget(shown.hash)
    if (pathChanged) {
      // Lenis still holds the previous page's height until told otherwise.
      lenis?.resize()
      const y = type === 'POP' ? (positions.current.get(shown.key) ?? 0) : 0
      scrollToTarget(lenis, y, true)
      window.scrollTo(0, y)
      if (el) goToSection(lenis, el)
      else if (type !== 'POP') document.getElementById('obsah')?.focus({ preventScroll: true })
      requestAnimationFrame(() => curtain.current?.reveal())
    } else if (el) {
      goToSection(lenis, el)
    } else if (type !== 'POP') {
      // links to the page already showing (logo, "Domov") arrive as PUSH or REPLACE
      scrollToTarget(lenis, 0)
    }
    shownKey.current = shown.key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown.key])

  // Direct load with a hash (e.g. /#sluzby): go there once the page has rendered.
  useEffect(() => {
    if (!booted) return
    const el = hashTarget(location.hash)
    if (el && !hasNavigated.current) requestAnimationFrame(() => goToSection(lenis, el))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted])

  return (
    <>
      <Header />
      {booted && (
        <motion.div
          id="page"
          key={shown.pathname}
          initial={reduce ? { opacity: 0 } : { opacity: 0.001 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0.4 : 0.01, ease: EASE_OUT }}
        >
          <main id="obsah" tabIndex={-1}>
            <Routes location={shown}>
              <Route path="/" element={<Home />} />
              <Route path="/sluzby/:slug" element={<Service />} />
              <Route path="/o-nas" element={<About />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/ochrana-osobnych-udajov" element={<Legal page={privacy} seed={17} />} />
              <Route path="/cookies" element={<Legal page={cookies} seed={19} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </motion.div>
      )}
      {!reduce && <PixelCurtain handle={curtain} startCovered />}
      {!reduce && (
        <div className={`boot-mark${bootMark ? '' : ' is-gone'}`} aria-hidden="true">
          <PixelGlyph name="dsymbol" className="boot-mark__glyph" pace={0.4} />
        </div>
      )}
    </>
  )
}
