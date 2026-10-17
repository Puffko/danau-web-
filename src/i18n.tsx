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

/** The pages every language has, besides the service pages. */
export const PAGES = ['home', 'about', 'contact', 'privacy', 'cookies'] as const
export type PageName = (typeof PAGES)[number]

/** Paths match case-insensitively and with a trailing slash. */
const norm = (pathname: string) => pathname.replace(/\/+$/, '').toLowerCase() || '/'

export const langOf = (pathname: string): Lang => (/^\/en(\/|$)/i.test(pathname) ? 'en' : 'sk')

export const servicePath = (lang: Lang, service: Service) => `${PATHS[lang].services}/${service.slug}`

export const serviceBySlug = (lang: Lang, slug: string | undefined) =>
  CONTENT[lang].services.find((s) => s.slug === slug?.toLowerCase())

const serviceById = (lang: Lang, id: ServiceId) => CONTENT[lang].services.find((s) => s.id === id)

/** What a path shows: one of the pages, a service, or neither (a 404). */
export function routeOf(pathname: string): { lang: Lang; page?: PageName; service?: Service } {
  const lang = langOf(pathname)
  const p = norm(pathname)
  const page = PAGES.find((k) => norm(PATHS[lang][k]) === p)
  if (page) return { lang, page }
  const prefix = `${PATHS[lang].services}/`
  return { lang, service: p.startsWith(prefix) ? serviceBySlug(lang, p.slice(prefix.length)) : undefined }
}

/** The same page in another language; its home page when the page has no counterpart. */
export function alternatePath(pathname: string, to: Lang) {
  const { page, service } = routeOf(pathname)
  if (page) return PATHS[to][page]
  const other = service && serviceById(to, service.id)
  return other ? servicePath(to, other) : PATHS[to].home
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
