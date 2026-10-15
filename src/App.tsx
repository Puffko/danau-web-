import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LoaderMark } from './components/LoaderMark'
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

const OUT = { duration: 300, easing: 'cubic-bezier(0.4, 0, 1, 1)' }
const IN = { duration: 950, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }

export default function App() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const lenis = useLenis()
  const reduce = useRef(prefersReducedMotion()).current
  const pageRef = useRef<HTMLDivElement>(null)

  // The page on screen. With motion on, it changes only once the old page has faded out,
  // so the swap and the jump to the new scroll position happen while nothing is visible.
  const [shown, setShown] = useState(location)
  const [loading, setLoading] = useState(!reduce)

  const positions = useRef(new Map<string, number>())
  // The history entry whose page is on screen; null while pages are swapping.
  const shownKey = useRef<string | null>(location.key)
  const shownPath = useRef(location.pathname)
  const hasNavigated = useRef(false)
  const navSeq = useRef(0)
  const latest = useRef({ location, type: navigationType })
  latest.current = { location, type: navigationType }
  useDocumentMeta(shown.pathname)

  const fadeOut = async () => {
    const el = pageRef.current
    if (!el) return
    await el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], OUT).finished
    el.style.opacity = '0'
  }
  const fadeIn = () => {
    const el = pageRef.current
    if (!el) return
    el.style.opacity = ''
    el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], IN)
  }

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // First load: the wordmark assembles, then the screen lifts away once the fonts are in.
  useEffect(() => {
    if (reduce) return
    let cancelled = false
    Promise.all([document.fonts?.ready ?? Promise.resolve(), wait(1350)]).then(() => {
      if (cancelled) return
      setLoading(false)
      fadeIn()
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // a new page waits for the old one to fade out.
  useLayoutEffect(() => {
    if (location.key === shown.key) return
    if (shownKey.current) positions.current.set(shownKey.current, window.scrollY)
    const seq = ++navSeq.current
    if (location.pathname === shownPath.current || reduce) {
      setShown(location)
      return
    }
    shownKey.current = null
    fadeOut().then(() => {
      if (seq === navSeq.current) setShown(latest.current.location)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  // The shown page changed: place it (top, saved position or hash target), then fade it in.
  // A layout effect, so the new page is positioned and transparent before its first paint.
  useLayoutEffect(() => {
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
      if (!reduce) fadeIn()
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
    const el = hashTarget(location.hash)
    if (el && !hasNavigated.current) requestAnimationFrame(() => goToSection(lenis, el))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Header />
      <div id="page" ref={pageRef} key={shown.pathname} style={loading ? { opacity: 0 } : undefined}>
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
      </div>
      {!reduce && (
        <div className={`loader${loading ? '' : ' is-done'}`} aria-hidden="true">
          <LoaderMark className="loader__logo" />
          <span className="loader__pixels">
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} style={{ ['--i' as string]: i }} />
            ))}
          </span>
        </div>
      )}
    </>
  )
}
