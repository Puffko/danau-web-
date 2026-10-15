import '@fontsource-variable/geist'
import '@fontsource-variable/pixelify-sans'
import 'lenis/dist/lenis.css'
import './styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import App from './App'
import { SmoothScroll } from './hooks/smoothScroll'
import { isPreview } from './lib/env'

// The single-file preview has no server behind it (and may run inside a sandboxed frame),
// so it keeps the route in memory instead of the address bar.
const Router = isPreview ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <Router>
        <SmoothScroll>
          <App />
          {isPreview && (
            <p className="preview-badge" role="note">
              Náhľad návrhu webu
            </p>
          )}
        </SmoothScroll>
      </Router>
    </MotionConfig>
  </StrictMode>,
)
