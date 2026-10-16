import { MotionConfig } from 'motion/react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import { SmoothScroll } from './hooks/smoothScroll'

export { headFor, headHtml, llmsTxt, pagePairs, sitemapXml } from './seo'

/**
 * Build-time render of one page (scripts/prerender.mjs), so every URL ships its full text and
 * links in the HTML for crawlers and link previews. In the browser the app renders afresh.
 */
export function render(url: string) {
  return renderToString(
    <MotionConfig reducedMotion="user">
      <StaticRouter location={url}>
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </StaticRouter>
    </MotionConfig>,
  )
}
