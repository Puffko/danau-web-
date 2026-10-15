import '@fontsource-variable/geist'
import 'lenis/dist/lenis.css'
import './styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import App from './App'
import { SmoothScroll } from './hooks/smoothScroll'

// The single-file preview build (vite.preview.config.ts) has no server rewrites, so it routes by hash.
const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter

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
