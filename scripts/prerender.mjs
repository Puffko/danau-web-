// Writes one static HTML file per page (both languages), a 404 page, sitemap.xml and llms.txt
// into dist/, from the server build in dist-ssr/. Run after `vite build` (see package.json).
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const { render, headFor, headHtml, llmsTxt, pagePairs, sitemapXml } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--seo:start-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('index.html is missing the <!--seo:start--> / <!--seo:end--> markers or the empty #root')
}
function page(route) {
  const head = headFor(route)
  const app = render(route)
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${head.lang}"`)
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, headHtml(head))
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
}

function write(file, html) {
  const out = path.join(dist, file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
}

// "/" -> index.html, "/o-nas" -> o-nas.html, "/en/about" -> en/about.html (see public/.htaccess)
const routes = pagePairs().flatMap((p) => [p.sk, p.en])
for (const route of routes) write(route === '/' ? 'index.html' : `${route.slice(1)}.html`, page(route))
write('404.html', page('/404'))

const today = new Date().toISOString().slice(0, 10)
write('sitemap.xml', sitemapXml(today))
write('llms.txt', llmsTxt())
fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerendered ${routes.length} pages + 404, sitemap.xml (${routes.length} URLs), llms.txt`)
