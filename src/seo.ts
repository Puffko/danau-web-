import { contact, type Service } from './data/site'
import { CONTENT, PATHS, alternatePath, langOf, serviceBySlug, servicePath, type Lang } from './i18n'

/**
 * Everything search engines and link previews read: per-page title, description, canonical URL,
 * hreflang alternates, Open Graph / Twitter tags and schema.org JSON-LD, plus the sitemap and
 * llms.txt. Used by the build's prerender (scripts/prerender.mjs) and by the client on navigation.
 */

export const SITE = 'https://danau.sk'
const LANGS: Lang[] = ['sk', 'en']
const ORG_ID = `${SITE}/#organization`
const SITE_ID = `${SITE}/#website`

type PageKind = 'home' | 'about' | 'contact' | 'privacy' | 'cookies' | 'service' | 'notFound'

export interface Head {
  lang: Lang
  title: string
  description: string
  /** Absolute canonical URL; absent on pages that must not be indexed (404). */
  canonical?: string
  alternates: { hreflang: string; href: string }[]
  robots?: string
  ogType: 'website'
  ogLocale: string
  ogLocaleAlternate: string
  image: string
  imageAlt: string
  jsonLd: Record<string, unknown>
}

const norm = (pathname: string) => pathname.replace(/\/+$/, '').toLowerCase() || '/'
export const absolute = (path: string) => (path === '/' ? `${SITE}/` : `${SITE}${path}`)

/** Which page a path shows, in its language. */
function pageAt(pathname: string): { kind: PageKind; lang: Lang; service?: Service } {
  const lang = langOf(pathname)
  const paths = PATHS[lang]
  const p = norm(pathname)
  for (const kind of ['home', 'about', 'contact', 'privacy', 'cookies'] as const) {
    if (norm(paths[kind]) === p) return { kind, lang }
  }
  const prefix = `${paths.services}/`
  if (p.startsWith(prefix)) {
    const service = serviceBySlug(lang, p.slice(prefix.length))
    if (service) return { kind: 'service', lang, service }
  }
  return { kind: 'notFound', lang }
}

/** Every indexable page, once per language, as [sk path, en path] pairs. */
export function pagePairs(): { sk: string; en: string }[] {
  const pairs: { sk: string; en: string }[] = []
  for (const kind of ['home', 'about', 'contact', 'privacy', 'cookies'] as const) {
    pairs.push({ sk: PATHS.sk[kind], en: PATHS.en[kind] })
  }
  for (const service of CONTENT.sk.services) pairs.push({ sk: servicePath('sk', service), en: alternatePath(servicePath('sk', service), 'en') })
  return pairs
}

const organization = () => ({
  '@type': 'ProfessionalService',
  '@id': ORG_ID,
  name: contact.company,
  alternateName: 'Danau',
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: `${SITE}/logo.png`, width: 512, height: 512 },
  image: `${SITE}/og/danau-sk.png`,
  email: contact.email,
  telephone: contact.phoneHref.replace('tel:', ''),
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.street,
    postalCode: contact.city.slice(0, 6),
    addressLocality: contact.city.slice(7),
    addressCountry: 'SK',
  },
  knowsAbout: CONTENT.sk.services.map((s) => s.cardTitle),
})

export function headFor(pathname: string): Head {
  const { kind, lang, service } = pageAt(pathname)
  const t = CONTENT[lang]
  const other: Lang = lang === 'sk' ? 'en' : 'sk'
  const image = `${SITE}/og/danau-${lang}.png`

  let title: string
  let description: string
  if (kind === 'service' && service) {
    const seo = t.meta.services[service.id]
    title = seo.title
    description = seo.description ?? service.heroText
  } else if (kind === 'privacy' || kind === 'cookies') {
    title = t.meta[kind].title
    description = t[kind].intro
  } else if (kind === 'notFound') {
    title = t.meta.notFound.title
    description = t.meta.notFound.description
  } else {
    const page = t.meta[kind as 'home' | 'about' | 'contact']
    title = page.title
    description = page.description
  }

  const base = {
    lang,
    title,
    description,
    ogType: 'website' as const,
    ogLocale: t.meta.locale,
    ogLocaleAlternate: CONTENT[other].meta.locale,
    image,
    imageAlt: t.meta.imageAlt,
  }

  if (kind === 'notFound') {
    return { ...base, alternates: [], robots: 'noindex, follow', jsonLd: { '@context': 'https://schema.org', '@graph': [organization()] } }
  }

  const path = norm(pathname) === '/' ? '/' : norm(pathname)
  // the canonical spelling of this page (paths match case-insensitively and with a slash)
  const canonicalPath = kind === 'service' && service ? servicePath(lang, service) : PATHS[lang][kind as Exclude<PageKind, 'service' | 'notFound'>]
  const canonical = absolute(canonicalPath)
  const own = { [lang]: canonical, [other]: absolute(alternatePath(path, other)) } as Record<Lang, string>
  const alternates = [
    ...LANGS.map((l) => ({ hreflang: l, href: own[l] })),
    { hreflang: 'x-default', href: own.sk },
  ]

  const pageType = kind === 'about' ? 'AboutPage' : kind === 'contact' ? 'ContactPage' : 'WebPage'
  const crumbs = [{ name: t.meta.breadcrumbHome, url: absolute(PATHS[lang].home) }]
  if (kind === 'service' && service) crumbs.push({ name: service.navLabel, url: canonical })
  else if (kind !== 'home') crumbs.push({ name: title.split(' | ')[0].split(' – ')[0], url: canonical })

  const graph: Record<string, unknown>[] = [
    organization(),
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      url: `${SITE}/`,
      name: 'Danau',
      inLanguage: LANGS,
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': pageType,
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { '@id': SITE_ID },
      about: { '@id': ORG_ID },
      primaryImageOfPage: { '@type': 'ImageObject', url: image },
      ...(kind === 'home' ? {} : { breadcrumb: { '@id': `${canonical}#breadcrumb` } }),
    },
  ]
  if (kind !== 'home') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
    })
  }
  if (kind === 'service' && service) {
    graph.push({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: service.cardTitle,
      serviceType: service.navLabel,
      description: service.cardText,
      url: canonical,
      inLanguage: lang,
      provider: { '@id': ORG_ID },
    })
  }
  if (kind === 'home') {
    graph.push({
      '@type': 'ItemList',
      '@id': `${canonical}#services`,
      name: t.home.services.title,
      itemListElement: t.services.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.cardTitle,
        url: absolute(servicePath(lang, s)),
      })),
    })
  }

  return { ...base, canonical, alternates, jsonLd: { '@context': 'https://schema.org', '@graph': graph } }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The head tags for a page; every tag carries data-seo so the client can swap them on navigation. */
export function headHtml(head: Head) {
  const tags = [
    `<meta data-seo name="description" content="${esc(head.description)}" />`,
    head.robots ? `<meta data-seo name="robots" content="${head.robots}" />` : '',
    head.canonical ? `<link data-seo rel="canonical" href="${head.canonical}" />` : '',
    ...head.alternates.map((a) => `<link data-seo rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`),
    `<meta data-seo property="og:type" content="${head.ogType}" />`,
    `<meta data-seo property="og:site_name" content="Danau" />`,
    `<meta data-seo property="og:title" content="${esc(head.title)}" />`,
    `<meta data-seo property="og:description" content="${esc(head.description)}" />`,
    head.canonical ? `<meta data-seo property="og:url" content="${head.canonical}" />` : '',
    `<meta data-seo property="og:locale" content="${head.ogLocale}" />`,
    `<meta data-seo property="og:locale:alternate" content="${head.ogLocaleAlternate}" />`,
    `<meta data-seo property="og:image" content="${head.image}" />`,
    `<meta data-seo property="og:image:width" content="1200" />`,
    `<meta data-seo property="og:image:height" content="630" />`,
    `<meta data-seo property="og:image:alt" content="${esc(head.imageAlt)}" />`,
    `<meta data-seo name="twitter:card" content="summary_large_image" />`,
    `<meta data-seo name="twitter:title" content="${esc(head.title)}" />`,
    `<meta data-seo name="twitter:description" content="${esc(head.description)}" />`,
    `<meta data-seo name="twitter:image" content="${head.image}" />`,
    // '<' is escaped so no copy can close the script element
    `<script data-seo type="application/ld+json">${JSON.stringify(head.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
  return tags.filter(Boolean).join('\n    ')
}

/** Brings the live document's head in line with a page (client-side navigation). */
export function applyHead(head: Head) {
  document.title = head.title
  document.documentElement.lang = head.lang
  document.head.querySelectorAll('[data-seo], meta[name="description"]').forEach((el) => el.remove())
  const tpl = document.createElement('template')
  tpl.innerHTML = headHtml(head)
  document.head.append(tpl.content)
}

/** sitemap.xml: every page in both languages, each with its hreflang cluster. */
export function sitemapXml(lastmod: string) {
  const urls = pagePairs().flatMap((pair) =>
    LANGS.map((lang) => {
      const links = [...LANGS.map((l) => [l, pair[l]] as const), ['x-default', pair.sk] as const]
        .map(([hl, p]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${absolute(p)}"/>`)
        .join('\n')
      return `  <url>\n    <loc>${absolute(pair[lang])}</loc>\n    <lastmod>${lastmod}</lastmod>\n${links}\n  </url>`
    }),
  )
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
}

/** llms.txt: a plain summary of who DANAU is and where each service lives, for AI assistants. */
export function llmsTxt() {
  const sk = CONTENT.sk
  const en = CONTENT.en
  const list = (lang: Lang) =>
    CONTENT[lang].services.map((s) => `- [${s.cardTitle}](${absolute(servicePath(lang, s))}): ${s.cardText}`).join('\n')
  return `# ${contact.company}

> ${sk.home.hero.text}

${sk.home.partner.lead}

Kontakt: ${contact.email}, ${contact.phone.replace(/\u00a0/g, ' ')}, ${contact.street}, ${contact.city}, ${sk.ui.country}. Web: ${SITE}/ (slovensky), ${SITE}/en (English).

## Služby

${list('sk')}

## Stránky

- [O nás](${absolute(PATHS.sk.about)}): ${sk.about.text}
- [Kontakt](${absolute(PATHS.sk.contact)}): ${sk.contactPage.text}

## English

> ${en.home.hero.text}

${list('en')}

- [About us](${absolute(PATHS.en.about)}): ${en.about.text}
- [Contact](${absolute(PATHS.en.contact)}): ${en.contactPage.text}
`
}
