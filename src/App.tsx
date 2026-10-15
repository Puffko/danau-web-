import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { EASE_OUT } from './components/Reveal'
import { cookies, pageMeta, privacy } from './data/site'
import { scrollToTarget, useLenis } from './hooks/smoothScroll'
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

export default function App() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const lenis = useLenis()
  const reduce = useReducedMotion()
  const firstRender = useRef(true)
  const positions = useRef(new Map<string, number>())
  // The history entry whose page is on screen right now; null while pages are swapping.
  const shownKey = useRef<string | null>(location.key)
  const hasNavigated = useRef(false)
  // AnimatePresence calls exit callbacks from the render that started the exit; read the latest here.
  const latest = useRef({ key: location.key, hash: location.hash, type: navigationType })
  latest.current = { key: location.key, hash: location.hash, type: navigationType }
  useDocumentMeta(location.pathname)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

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

  // A route change starts: stop recording until the next page is in place.
  useLayoutEffect(() => {
    if (shownKey.current && shownKey.current !== location.key) {
      positions.current.set(shownKey.current, window.scrollY)
      shownKey.current = null
      hasNavigated.current = true
    }
  }, [location.key])

  // Same-page navigation (no route change): hash links and links to the current page.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const el = hashTarget(location.hash)
    if (el) goToSection(lenis, el)
    // links to the page already showing (logo, "Domov") arrive as PUSH or REPLACE
    else if (!location.hash && navigationType !== 'POP') scrollToTarget(lenis, 0)
    // location.key changes on every navigation, even to the same URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  const onExitComplete = () => {
    scrollToTarget(lenis, 0, true)
    window.scrollTo(0, 0)
  }

  // The same handlers also fire for the exiting copy of the page; ignore those.
  const isExit = (def: unknown) => typeof def === 'object' && def !== null && (def as { opacity?: number }).opacity === 0

  const onEnterStart = (def: unknown) => {
    if (isExit(def)) return
    requestAnimationFrame(() => {
      const { key, type } = latest.current
      // Back/forward returns to where that page was left; any other arrival starts at the top.
      // Lenis still holds the previous page's height until told otherwise.
      const y = type === 'POP' ? (positions.current.get(key) ?? 0) : 0
      if (hasNavigated.current) {
        lenis?.resize()
        scrollToTarget(lenis, y, true)
        window.scrollTo(0, y)
      }
      shownKey.current = key
    })
  }

  const onEntered = (def: unknown) => {
    if (isExit(def)) return
    const el = hashTarget(latest.current.hash)
    if (el) {
      goToSection(lenis, el)
      return
    }
    // After a client-side page change, put focus at the start of the new content.
    if (latest.current.type !== 'POP' && hasNavigated.current) {
      document.getElementById('obsah')?.focus({ preventScroll: true })
    }
  }

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        <motion.div
          id="page"
          key={location.pathname}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          onAnimationStart={onEnterStart}
          onAnimationComplete={onEntered}
        >
          <main id="obsah" tabIndex={-1}>
            <Routes location={location}>
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
      </AnimatePresence>
    </>
  )
}
