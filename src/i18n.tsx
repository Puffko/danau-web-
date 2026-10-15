import { createContext, useContext } from 'react'
import { en } from './data/en'
import { sk, type Content } from './data/sk'
import type { Service, ServiceId } from './data/site'

/**
 * Two languages: Slovak at the root, English under /en with its own slugs. The language of a page
 * follows from its path, so every URL is shareable and the switch is just a link.
 */
export type Lang = 'sk' | 'en'

export const CONTENT: Record<Lang, Content> = { sk, en }

interface Paths {
  home: string
  /** Prefix of the service pages; each service adds its own slug. */
  services: string
  about: string
  contact: string
  privacy: string
  cookies: string
  /** Id of the services section on the home page. */
  servicesAnchor: string
}

export const PATHS: Record<Lang, Paths> = {
  sk: {
    home: '/',
    services: '/sluzby',
    about: '/o-nas',
    contact: '/kontakt',
    privacy: '/ochrana-osobnych-udajov',
    cookies: '/cookies',
    servicesAnchor: 'sluzby',
  },
  en: {
    home: '/en',
    services: '/en/services',
    about: '/en/about',
    contact: '/en/contact',
    privacy: '/en/privacy',
    cookies: '/en/cookies',
    servicesAnchor: 'services',
  },
}

const PAGES = ['home', 'about', 'contact', 'privacy', 'cookies'] as const

/** Paths match case-insensitively and with a trailing slash. */
const norm = (pathname: string) => pathname.replace(/\/+$/, '').toLowerCase() || '/'

export const langOf = (pathname: string): Lang => (/^\/en(\/|$)/i.test(pathname) ? 'en' : 'sk')

export const servicePath = (lang: Lang, service: Service) => `${PATHS[lang].services}/${service.slug}`

export const serviceBySlug = (lang: Lang, slug: string | undefined) =>
  CONTENT[lang].services.find((s) => s.slug === slug?.toLowerCase())

export const serviceById = (lang: Lang, id: ServiceId) => CONTENT[lang].services.find((s) => s.id === id)

/** The service a path shows, if any. */
function serviceAt(pathname: string) {
  const lang = langOf(pathname)
  const prefix = `${PATHS[lang].services}/`
  const p = norm(pathname)
  return p.startsWith(prefix) ? serviceBySlug(lang, p.slice(prefix.length)) : undefined
}

/** The same page in another language; its home page when the page has no counterpart. */
export function alternatePath(pathname: string, to: Lang) {
  const from = langOf(pathname)
  const p = norm(pathname)
  const page = PAGES.find((k) => norm(PATHS[from][k]) === p)
  if (page) return PATHS[to][page]
  const service = serviceAt(pathname)
  const other = service && serviceById(to, service.id)
  return other ? servicePath(to, other) : PATHS[to].home
}

/** Document title and description for a path. */
export function pageMeta(pathname: string) {
  const lang = langOf(pathname)
  const t = CONTENT[lang]
  const paths = PATHS[lang]
  const p = norm(pathname)
  if (p === norm(paths.home)) return { title: t.meta.homeTitle, description: t.home.hero.text }
  if (p === paths.about) return { title: `${t.about.title} — Danau`, description: t.about.text }
  if (p === paths.contact) return { title: `${t.contactPage.title} — Danau`, description: t.contactPage.text }
  if (p === paths.privacy) return { title: `${t.privacy.title} — Danau`, description: t.privacy.intro }
  if (p === paths.cookies) return { title: `${t.cookies.title} — Danau`, description: t.cookies.intro }
  const service = serviceAt(pathname)
  if (service) return { title: `${service.navLabel} — Danau`, description: service.heroText }
  return t.meta.notFound
}

const LangContext = createContext<Lang>('sk')
export const LangProvider = LangContext.Provider

/** The language of the page on screen, its copy and its paths. */
export function useI18n() {
  const lang = useContext(LangContext)
  const paths = PATHS[lang]
  return {
    lang,
    t: CONTENT[lang],
    paths,
    /** Link to the services section of the home page. */
    servicesSection: `${paths.home}#${paths.servicesAnchor}`,
    servicePath: (service: Service) => servicePath(lang, service),
    serviceById: (id: ServiceId) => serviceById(lang, id),
  }
}
