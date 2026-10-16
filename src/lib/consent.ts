import { isPreview } from './env'

/**
 * Cookie consent and Google Analytics 4. GA is never loaded before the visitor accepts analytics
 * cookies (and never in the single-file preview). The choice is kept in localStorage; turning it
 * down later stops GA and removes its cookies.
 */

export const GA_ID = 'G-0RPSMNFFCV'
const KEY = 'danau-consent-v1'
/** Fired on window to open the cookie bar again (footer "Cookie settings"). */
export const OPEN_EVENT = 'danau:consent-open'

export type Consent = 'granted' | 'denied'

type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

export function storedConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

function store(value: Consent) {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    /* private mode: the choice lasts for this page view only */
  }
}

let loaded = false

/** The Google tag, with Consent Mode v2: analytics on, every advertising signal off. */
function loadAnalytics() {
  if (loaded || isPreview || typeof window === 'undefined') return
  loaded = true
  window.dataLayer = window.dataLayer || []
  // gtag must push the arguments object itself, as in Google's snippet
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
}

/** Removes GA's cookies (_ga, _ga_<id>) from this host and the parent domain. */
function clearAnalyticsCookies() {
  const host = location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim()
    if (!/^_ga(_|$)/.test(name)) continue
    for (const d of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ''}`
    }
  }
}

export function setConsent(value: Consent) {
  store(value)
  if (value === 'granted') {
    loadAnalytics()
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
  } else {
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    clearAnalyticsCookies()
  }
}

/** On start: a visitor who accepted before gets GA right away. */
export function initConsent() {
  if (storedConsent() === 'granted') loadAnalytics()
}
