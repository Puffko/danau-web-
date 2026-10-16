import '@fontsource-variable/geist'
import 'lenis/dist/lenis.css'
import './styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import App from './App'
import { SmoothScroll } from './hooks/smoothScroll'
import { isPreview } from './lib/env'

// A load or reload always opens at the top of the page, on its hero: no restored scroll position
// and no jump to a #section left in the address. Done before the router reads the URL.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
if (window.location.hash) history.replaceState(history.state, '', window.location.pathname + window.location.search)
window.scrollTo(0, 0)

// The single-file preview has no server behind it (and may run inside a sandboxed frame),
// so it keeps the route in memory instead of the address bar.
const Router = isPreview ? MemoryRouter : BrowserRouter

// The prerendered HTML (scripts/prerender.mjs) stays readable without JS; the app renders afresh.
document.getElementById('ssr-visible')?.remove()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <Router>
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </Router>
    </MotionConfig>
  </StrictMode>,
)
