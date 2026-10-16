// Shared, language-independent data and the shapes of the per-language content (sk.ts, en.ts).

export type ServiceIconName = 'project' | 'security' | 'gdpr' | 'analytics' | 'data' | 'delivery'
export type IllustrationName = 'lock' | 'shield' | 'document' | 'chart' | 'database' | 'screen'

/** A service's identity across languages (its Slovak slug); URLs use each language's own `slug`. */
export type ServiceId =
  | 'projektove-riadenie'
  | 'kyberneticka-bezpecnost'
  | 'gdpr-a-dpo'
  | 'analyza-a-data'
  | 'data-governance'
  | 'realizacia-it'

export const contact = {
  company: 'DANAU, s.r.o.',
  email: 'info@danau.sk',
  // non-breaking spaces keep the number on one line
  phone: '+421\u00a0948\u00a0222\u00a0666',
  phoneHref: 'tel:+421948222666',
  street: 'Doležalova 15/C',
  city: '821 04 Bratislava',
  // Obchodný register Mestského súdu Bratislava III, Register účtovných závierok and EU VIES (checked 16 Oct 2026)
  ico: '54 908 159',
  dic: '2121824309',
  icDph: 'SK2121824309',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Dolezalova+15%2FC%2C+821+04+Bratislava',
}

export type ServiceDetailBlock =
  | { kind: 'text'; title: string; body: string; listTitle?: string; list?: string[] }
  | { kind: 'link'; title: string; body: string; service: ServiceId }

export interface Service {
  id: ServiceId
  /** URL slug in this language. */
  slug: string
  /** Short name used in navigation and footer. */
  navLabel: string
  /** Card title on the home page. */
  cardTitle: string
  cardText: string
  icon: ServiceIconName
  illustration: IllustrationName
  heroTitle: string
  heroText: string
  blocks: ServiceDetailBlock[]
  ctaTitle: string
}

/** One stored item in the cookie overview. */
interface CookieItem {
  name: string
  provider: string
  purpose: string
  expiry: string
}

/** The cookie overview: items grouped by whether they need consent. */
interface CookieRegister {
  /** Labels of the provider and expiry values. */
  labels: { provider: string; expiry: string }
  groups: { title: string; note: string; consent: boolean; items: CookieItem[] }[]
}

interface LegalSection {
  title: string
  paragraphs: string[]
  /** A bulleted list after the paragraphs. */
  list?: string[]
  /** The cookie overview after the list. */
  cookies?: CookieRegister
  /** Paragraphs after the list or overview. */
  after?: string[]
  /** Ends the section with the button that reopens the cookie bar. */
  consentButton?: boolean
}

export interface LegalPage {
  title: string
  intro: string
  /** "Last updated" line under the sections. */
  updated: string
  sections: LegalSection[]
}

/** One part of the About paragraph: plain text, or an area that links to its service. */
export type AreaPart = string | { area: ServiceId; text: string }
