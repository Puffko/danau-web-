// Shared, language-independent data and the shapes of the per-language content (sk.ts, en.ts).

export type ServiceIconName = 'project' | 'security' | 'gdpr' | 'analytics' | 'data' | 'delivery'
export type IllustrationName = 'lock' | 'shield' | 'document' | 'chart' | 'database' | 'screen' | 'dsymbol'

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

export interface LegalPage {
  title: string
  intro: string
  sections: { title: string; paragraphs: string[] }[]
}

/** One part of the About paragraph: plain text, or an area that links to its service. */
export type AreaPart = string | { area: ServiceId; text: string }
