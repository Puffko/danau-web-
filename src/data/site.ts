// All copy is taken verbatim from the live danau.sk. Edit content here, not in components.

export type ServiceIconName = 'project' | 'security' | 'gdpr' | 'analytics' | 'data' | 'delivery'
export type IllustrationName = 'lock' | 'shield' | 'document' | 'chart' | 'database' | 'screen' | 'dsymbol'

export const contact = {
  company: 'DANAU, s.r.o.',
  email: 'info@danau.sk',
  // non-breaking spaces keep the number on one line
  phone: '+421\u00a0948\u00a0222\u00a0666',
  phoneHref: 'tel:+421948222666',
  street: 'Doležalova 15/C',
  city: '821 04 Bratislava',
  country: 'Slovensko',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Dolezalova+15%2FC%2C+821+04+Bratislava',
}

export const routes = {
  home: '/',
  services: '/#sluzby',
  about: '/o-nas',
  contact: '/kontakt',
  privacy: '/ochrana-osobnych-udajov',
  cookies: '/cookies',
}

export type ServiceDetailBlock =
  | { kind: 'text'; title: string; body: string; listTitle?: string; list?: string[] }
  | { kind: 'link'; title: string; body: string; to: string }

export interface Service {
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

export const services: Service[] = [
  {
    slug: 'projektove-riadenie',
    navLabel: 'Projektové riadenie',
    cardTitle: 'Projektové / programové riadenie',
    cardText:
      'Pripravujeme podklady pre výzvy, projektové zámery a verejné obstarávanie. Nastavujeme riadenie projektu, preberáme odborný dohľad a zabezpečujeme dokumentáciu počas celej realizácie.',
    icon: 'project',
    illustration: 'lock',
    heroTitle: 'Pripravíme váš projekt tak, aby bol obhájiteľný, riaditeľný a realizovateľný',
    heroText:
      'Pomáhame organizáciám pripraviť projekty od prvotného zámeru až po ich vedenie počas realizácie. Zabezpečujeme odborné podklady, riadenie aj dokumentáciu.',
    blocks: [
      {
        kind: 'text',
        title: 'Projekt sa začína kvalitnou prípravou',
        body: 'Projekt sa nezačína obstarávaním ani podpisom zmluvy. Začína sa kvalitnou prípravou. Pomáhame klientom správne definovať cieľ, rozsah, prínosy, riadiaci model a podklady, na ktorých bude projekt postavený.',
        listTitle: 'Čo zabezpečujeme',
        list: [
          'Prípravu podkladov pre výzvy',
          'odborné podklady pre verejné obstarávanie',
          'vedenie projektov podľa 401/2023',
          'projektovú dokumentáciu počas realizácie',
        ],
      },
      {
        kind: 'text',
        title: 'Ako klientovi pomáhame',
        body: 'Vstupujeme tam, kde organizácia potrebuje pripraviť projekt ešte pred obstarávaním, doplniť metodické vedenie, získať externú odbornú kapacitu alebo stabilizovať riadenie počas realizácie. Poskytujeme aj outsourcing projektového manažéra alebo PMO podpory.',
      },
    ],
    ctaTitle: 'Potrebujete pripraviť projekt alebo stabilizovať jeho riadenie?',
  },
  {
    slug: 'kyberneticka-bezpecnost',
    navLabel: 'Kybernetická bezpečnosť',
    cardTitle: 'Kybernetická bezpečnosť',
    cardText:
      'Pomáhame organizáciám pripraviť sa na audit, overiť stav procesov, doplniť dokumentáciu, riadiť nápravné opatrenia a zabezpečiť odbornú kapacitu MKB formou outsourcingu alebo priebežnej podpory.',
    icon: 'security',
    illustration: 'shield',
    heroTitle: 'Pripravíme vašu organizáciu na audit a posilníme riadenie kybernetickej bezpečnosti',
    heroText:
      'Podporujeme organizácie pri príprave na audit, nastavovaní procesov, dopĺňaní dokumentácie a pri zabezpečení odbornej kapacity v oblasti kybernetickej bezpečnosti.',
    blocks: [
      {
        kind: 'text',
        title: 'Bezpečnosť ako riadiaca disciplína',
        body: 'Kybernetická bezpečnosť zasahuje do procesov, dokumentácie, aktív, rizík, kontinuity činností aj zodpovedností vo vnútri organizácie. Potrebné je mať bezpečnosť uchopenú systematicky, preukázateľne a dlhodobo udržateľne.',
        listTitle: 'Čo zabezpečujeme',
        list: [
          'Prípravu na audit KB',
          'validáciu procesov',
          'dokumentáciu',
          'vedenie počas auditu',
          'outsourcing MKB',
          'rizikové analýzy a BCM',
        ],
      },
      {
        kind: 'text',
        title: 'Ako klientovi pomáhame',
        body: 'Najprv posúdime aktuálny stav organizácie, identifikujeme medzery a pripravíme plán krokov. Následne pomáhame s dokumentáciou, procesmi, dôkazmi, koordináciou a komunikáciou tak, aby organizácia obstála nielen pri audite, ale aj v reálnej prevádzke.',
      },
    ],
    ctaTitle: 'Potrebujete pripraviť organizáciu na audit alebo zabezpečiť kapacitu MKB?',
  },
  {
    slug: 'gdpr-a-dpo',
    navLabel: 'GDPR a DPO',
    cardTitle: 'GDPR a outsourcing DPO',
    cardText:
      'Pomáhame nastaviť ochranu osobných údajov, GDPR dokumentáciu, procesy a zodpovednosti. Poskytujeme aj externú zodpovednú osobu alebo seniornú podporu interného DPO.',
    icon: 'gdpr',
    illustration: 'document',
    heroTitle: 'GDPR a outsourcing DPO pre verejný aj komerčný sektor',
    heroText:
      'Pomáhame organizáciám nastaviť ochranu osobných údajov tak, aby bola odborne správna, praktická a dlhodobo udržateľná. Poskytujeme služby v oblasti GDPR aj outsourcing zodpovednej osoby.',
    blocks: [
      {
        kind: 'text',
        title: 'Ochrana osobných údajov ako riadená agenda',
        body: 'GDPR dnes nie je iba o formálnej dokumentácii. Zasahuje do procesov organizácie, interných pravidiel, zodpovedností, prevádzky informačných systémov aj každodennej práce s údajmi.',
        listTitle: 'Čo zabezpečujeme',
        list: [
          'Outsourcing DPO',
          'podporu interného DPO',
          'gap assessment',
          'GDPR dokumentáciu a evidencie',
          'nastavenie procesov',
          'podporu pri právach dotknutých osôb, incidentoch a DPIA',
        ],
      },
      {
        kind: 'text',
        title: 'Ako klientovi pomáhame',
        body: 'Najprv identifikujeme stav súladu a priority. Následne pomáhame nastaviť dokumentáciu, procesy, roly a priebežný dohľad tak, aby ochrana osobných údajov fungovala v praxi a neostala iba formálnou povinnosťou.',
      },
    ],
    ctaTitle: 'Potrebujete zabezpečiť GDPR agendu alebo externú zodpovednú osobu?',
  },
  {
    slug: 'analyza-a-data',
    navLabel: 'Analytika a dáta',
    cardTitle: 'Analytické činnosti',
    cardText:
      'Analyzujeme procesy, potreby organizácie a funkcionalitu informačných systémov. Klient získava podklady pre kvalifikované rozhodnutie, zmenu alebo obstarávanie riešenia.',
    icon: 'analytics',
    illustration: 'chart',
    heroTitle: 'Analýza, ktorá pomáha rozhodnúť. Dáta, ktoré pomáhajú riadiť.',
    heroText:
      'Pomáhame organizáciám pochopiť procesy, potreby a informačné systémy tak, aby sa z analýzy stal základ pre reálnu zmenu.',
    blocks: [
      {
        kind: 'text',
        title: 'Analytické činnosti',
        body: 'Analyzujeme procesy organizácie, identifikujeme slabé miesta, neefektivity a bariéry, ktoré bránia lepšiemu fungovaniu. Posudzujeme aj funkcionalitu informačných systémov a hodnotíme, či skutočne podporujú potreby organizácie.',
      },
      {
        kind: 'link',
        title: 'Data governance - manažment dát',
        body: 'Pomáhame nastaviť základný rámec práce s dátami, zodpovednosti, dátové roly a princípy, ktoré podporujú kvalitu dát a ich využitie v rozhodovaní, reportingu a ďalšom rozvoji.',
        to: '/sluzby/data-governance',
      },
    ],
    ctaTitle: 'Potrebujete procesnú analýzu, analytické podklady alebo zavedenie dátového manažmentu?',
  },
  {
    slug: 'data-governance',
    navLabel: 'Data governance',
    cardTitle: 'Data governance a manažment dát',
    cardText:
      'Pomáhame zavádzať dátový manažment, pravidlá práce s dátami, zodpovednosti a dátové princípy, ktoré podporujú riadenie organizácie aj ďalší rozvoj IT.',
    icon: 'data',
    illustration: 'database',
    heroTitle: 'Nastavíme dátové riadenie tak, aby podporovalo spoľahlivé a reálnu hodnotu dát',
    heroText:
      'Pomáhame organizáciám pochopiť procesy, potreby a informačné systémy tak, aby sa z analýzy stal základ pre reálnu zmenu.',
    blocks: [
      {
        kind: 'text',
        title: 'Dáta potrebujú jasné pravidlá a vlastníctvo',
        body: 'Dáta neprinášajú hodnotu samy o sebe. Hodnota vzniká až vtedy, keď sú správne riadené, dostupné, kvalitné a pochopené. Pomáhame klientom nastaviť princípy práce s dátami, definovať roly a zodpovednosti a vytvoriť prostredie, v ktorom sú dáta dôveryhodným základom pre rozhodovanie.',
        listTitle: 'Čo zabezpečujeme',
        list: [
          'Zavedenie dátového manažmentu',
          'návrh governance modelu',
          'definovanie rolí (napr. data owner, data steward)',
          'nastavenie princípov práce s dátami',
          'podporu dátovej kvality',
          'návrh rámca pre reporting a rozhodovanie',
        ],
      },
    ],
    ctaTitle:
      'Potrebujete zaviesť dátové riadenie alebo zlepšiť kvalitu dát? Pomôžeme vám nastaviť data governance, ktoré dá dátam poriadok a podporí rozhodovanie.',
  },
  {
    slug: 'realizacia-it',
    navLabel: 'Realizácia IT',
    cardTitle: 'Realizácia IT projektov',
    cardText:
      'Dodávame riešenia v oblastiach asset managementu, datawarehouse, webových stránok a corporate identity. Prepájame odborný návrh s praktickou realizáciou.',
    icon: 'delivery',
    illustration: 'screen',
    heroTitle: 'Od návrhu k realizácii',
    heroText:
      'Pomáhame klientom nielen s prípravou a riadením, ale aj s praktickým zavedením vybraných IT riešení.',
    blocks: [
      {
        kind: 'text',
        title: 'Riešenia s prevádzkovým a manažérskym prínosom',
        body: 'DANAU prepája odborný návrh, riadenie a implementáciu tak, aby výsledok neostal na úrovni konceptu, ale stal sa funkčnou súčasťou organizácie.',
        listTitle: 'Čo realizujeme',
        list: ['Asset management', 'datawarehouse', 'webové stránky', 'corporate identity'],
      },
    ],
    ctaTitle: 'Potrebujete dodať riešenie, nie iba pripraviť návrh?',
  },
]

export const serviceBySlug = (slug: string | undefined) => services.find((s) => s.slug === slug?.toLowerCase())

export const home = {
  hero: {
    title: 'Riadenie IT projektov, kybernetická bezpečnosť, GDPR a odborná podpora',
    text: 'Pomáhame organizáciám pripraviť, riadiť a doručiť zmeny v oblastiach IT, bezpečnosti, ochrany osobných údajov, dát a procesov. Spájame projektové riadenie, kybernetickú bezpečnosť, GDPR, analytiku a realizáciu riešení do jedného funkčného celku.',
    primary: 'Kontakt',
    // headline words set off with a marker stroke: "IT projektov", "kybernetická bezpečnosť", "GDPR"
    highlightWords: ['IT', 'projektov', 'kybernetická', 'bezpečnosť', 'GDPR'],
    secondary: 'Naše služby',
  },
  partner: {
    title: 'Partner pre verejný aj komerčný sektor',
    // The live copy, split across the diagram: lead -> "Pre koho", body -> "Prístup" + "Výsledok".
    lead: 'DANAU, s.r.o. je odborný partner pre orgány verejnej moci, štátne a verejné inštitúcie, regulované organizácie aj komerčné spoločnosti, ktoré potrebujú zvládnuť projekt, audit, modernizáciu prostredia alebo posilniť svoje interné kapacity.',
    approach: 'Naše služby sú postavené na prepájaní odborného obsahu, metodiky, riadenia a praktickej realizácie. Nepomáhame iba pripraviť dokument.',
    outcome: 'Pomáhame klientovi pripraviť rozhodnutie, nastaviť projekt, doplniť dokumentáciu, stabilizovať riadenie a dodať výsledok, ktorý obstojí vecne, procesne aj prevádzkovo.',
    labels: { lead: 'Pre koho', approach: 'Prístup', outcome: 'Výsledok' },
  },
  services: {
    title: 'Komplexné riešenia pre vaše IT a bezpečnostné výzvy',
    more: 'Zistiť viac',
  },
  process: {
    title: 'Ako pracujeme?',
    paragraphs: [
      'Organizácie dnes často riešia projekty a zmeny, ktoré presahujú jednu odbornú oblasť. Nestačí mať iba dobrý zámer alebo technické riešenie. Potrebné je prepojiť riadenie, analýzu, dokumentáciu, bezpečnosť, GDPR, kvalitu a schopnosť doručiť výsledok.',
      'DANAU vstupuje práve tam, kde organizácia potrebuje externé know-how, odbornú kapacitu alebo partnera, ktorý prevezme konkrétnu rolu. Pomáhame pripraviť projekt, stabilizovať jeho riadenie, zvládnuť audit, doplniť dokumentáciu, nastaviť bezpečnostné procesy, GDPR agendu alebo realizovať vybrané IT riešenie.',
      'Naším cieľom nie je vytvárať formálne výstupy bez využitia. Naším cieľom je dodať klientovi riešenie, ktoré bude použiteľné v rozhodovaní, v projekte aj v každodennej prevádzke.',
    ],
  },
  expertise: {
    title: 'Odbornosť a skúsenosti',
    lead: 'Staviame na kombinácii praktických skúseností a odborných certifikácií v oblastiach projektového riadenia, kybernetickej bezpečnosti, ochrany osobných údajov, informačnej bezpečnosti, enterprise architektúry a riadenia IT služieb.',
    listIntro: 'Súčasťou odborného zázemia DANAU sú kompetencie a certifikácie ako:',
    items: ['IPMA', 'PRINCE2', 'Lead Auditor ISO/IEC 27001', 'ITIL', 'TOGAF', 'MKB', 'DPO'],
    // The same certifications, grouped under the areas the lead names (in its order).
    domains: [
      { area: 'Projektové riadenie', certs: ['IPMA', 'PRINCE2'] },
      { area: 'Kybernetická bezpečnosť', certs: ['MKB'] },
      { area: 'Ochrana osobných údajov', certs: ['DPO'] },
      { area: 'Informačná bezpečnosť', certs: ['Lead Auditor ISO/IEC 27001'] },
      { area: 'Enterprise architektúra', certs: ['TOGAF'] },
      { area: 'Riadenie IT služieb', certs: ['ITIL'] },
    ],
  },
  clients: {
    title: 'Pre koho pracujeme?',
    items: [
      {
        title: 'Orgány verejnej moci',
        text: 'Podpora pri príprave projektov, verejnom obstarávaní, projektovej dokumentácii, kybernetickej bezpečnosti, GDPR a riadení zmien.',
      },
      {
        title: 'Štátne a verejné inštitúcie',
        text: 'Metodická, analytická a realizačná podpora pri riadení IT projektov, bezpečnosti, ochrane osobných údajov a modernizácii prostredia.',
      },
      {
        title: 'Samosprávy a ich organizácie',
        text: 'Praktická pomoc pri zavádzaní procesov, systémov, bezpečnostných opatrení, GDPR a dátového manažmentu.',
      },
      {
        title: 'Regulované organizácie',
        text: 'Podpora pri audit readiness, riadení rizík, nastavovaní bezpečnostného a compliance prostredia.',
      },
      {
        title: 'Komerčné organizácie',
        text: 'Projektové riadenie, bezpečnostné služby, GDPR, analytika, data governance a realizácia IT riešení s dôrazom na funkčný výsledok.',
      },
    ],
  },
}

export const about = {
  title: 'O nás',
  text: 'Sme odborný partner pre organizácie, ktoré potrebujú kvalitne pripraviť, riadiť a realizovať projekty, nastaviť bezpečnostné a riadiace procesy alebo posilniť interné odborné kapacity.',
  whatTitle: 'Čo robíme?',
  // The live paragraph; the six areas it names link to their service pages.
  whatParts: [
    'Pôsobíme na rozhraní ',
    { area: 'projektove-riadenie', text: 'projektového riadenia' },
    ', ',
    { area: 'analyza-a-data', text: 'analytiky' },
    ', ',
    { area: 'kyberneticka-bezpecnost', text: 'kybernetickej bezpečnosti' },
    ', ',
    { area: 'gdpr-a-dpo', text: 'ochrany osobných údajov' },
    ', ',
    { area: 'data-governance', text: 'dátového manažmentu' },
    ' a ',
    { area: 'realizacia-it', text: 'realizácie IT riešení' },
    '.',
  ] as (string | { area: string; text: string })[],
  whatEdge:
    'Našou výhodou je schopnosť prepájať tieto oblasti do jedného zrozumiteľného a riaditeľného prístupu.',
  // The six areas named in the paragraph, in its order, as the services they correspond to.
  areas: ['projektove-riadenie', 'analyza-a-data', 'kyberneticka-bezpecnost', 'gdpr-a-dpo', 'data-governance', 'realizacia-it'],
  skillsTitle: 'Kľúčové odbornosti',
  // Each expertise with the area it belongs to (the areas named under "Odbornosť a skúsenosti").
  skills: [
    { name: 'IPMA', area: 'Projektové riadenie' },
    { name: 'PRINCE2', area: 'Projektové riadenie' },
    { name: 'Lead Auditor ISO/IEC 27001', area: 'Informačná bezpečnosť' },
    { name: 'ITIL', area: 'Riadenie IT služieb' },
    { name: 'TOGAF', area: 'Enterprise architektúra' },
    { name: 'MKB', area: 'Kybernetická bezpečnosť' },
    { name: 'Audit kybernetickej bezpečnosti', area: 'Kybernetická bezpečnosť' },
    { name: 'Certifikovaní DPO', area: 'Ochrana osobných údajov' },
  ],
}

export const contactPage = {
  title: 'Kontakt',
  text: 'Hľadáte partnera pre prípravu projektu, podporu verejného obstarávania, vedenie projektu, audit kybernetickej bezpečnosti, GDPR agendu, analytické činnosti, dátový manažment alebo realizáciu IT riešenia? Napíšte nám. Ozveme sa vám a dohodneme si úvodnú konzultáciu.',
  formTitle: 'Napíšte nám',
  success: 'Správa bola úspešne odoslaná. Ozveme sa vám čo najskôr.',
  failure: 'Správu sa nepodarilo odoslať. Skúste to, prosím, neskôr.',
  consent: 'Súhlasím so spracovaním osobných údajov za účelom kontaktovania.',
  submit: 'Odoslať správu',
}

export const footer = {
  claim: 'Odborný partner pre orgány verejnej moci, štátne inštitúcie a komerčné spoločnosti.',
  servicesTitle: 'Služby',
  linksTitle: 'Rýchle odkazy',
  contactTitle: 'Kontakt',
  copyright: `© ${new Date().getFullYear()} DANAU, s.r.o. Všetky práva vyhradené.`,
}

export interface LegalPage {
  title: string
  intro: string
  sections: { title: string; paragraphs: string[] }[]
}

export const privacy: LegalPage = {
  title: 'Ochrana osobných údajov',
  intro:
    'Na tejto stránke nájdete základné informácie o tom, aké údaje spracúvame pri obchodnej komunikácii, projektovej spolupráci a prevádzke webu spoločnosti DANAU, s.r.o.',
  sections: [
    {
      title: 'Prevádzkovateľ a kontakt',
      paragraphs: [
        'Prevádzkovateľom je DANAU, s.r.o., Doležalova 15/C, 821 04 Bratislava. Pre otázky o ochrane osobných údajov nás môžete kontaktovať na adrese info@danau.sk alebo telefonicky na čísle +421\u00a0948\u00a0222\u00a0666.',
      ],
    },
    {
      title: 'Aké údaje spracúvame',
      paragraphs: [
        'Spracúvame najmä identifikačné a kontaktné údaje, ktoré nám poskytnete pri dopyte, pri príprave projektu, pri zmluvnej komunikácii alebo pri priebežnej spolupráci.',
        'Rozsah údajov vždy viažeme na konkrétny účel, aby sme vedeli pripraviť ponuku, zabezpečiť odborné plnenie alebo splniť zákonné a zmluvné povinnosti.',
      ],
    },
    {
      title: 'Vaše práva',
      paragraphs: [
        'Máte právo požiadať o prístup k údajom, ich opravu, obmedzenie spracúvania, výmaz alebo prenosnosť, ak to umožňuje právny základ spracúvania.',
        'Ak sa domnievate, že s údajmi nakladáme nesprávne, môžete sa obrátiť priamo na nás a zároveň máte právo podať podnet aj dozornému orgánu.',
      ],
    },
  ],
}

export const cookies: LegalPage = {
  title: 'Cookies',
  intro:
    'Používanie cookies slúži na základnú prevádzku stránky, meranie návštevnosti a zlepšovanie používateľského zážitku pri ďalších návštevách.',
  sections: [
    {
      title: 'Čo sú cookies',
      paragraphs: [
        'Cookies sú malé súbory uložené v prehliadači, ktoré si web zapamätá medzi jednotlivými návštevami. Pomáhajú udržať stabilné fungovanie stránky a lepšie porozumieť tomu, ako je obsah používaný.',
      ],
    },
    {
      title: 'Na čo ich používame',
      paragraphs: [
        'Používame nevyhnutné cookies pre základnú funkčnosť a podľa nastavení návštevníka môžeme pracovať aj s analytickými údajmi, ktoré nám pomáhajú vyhodnocovať výkonnosť stránky a upravovať obsah.',
      ],
    },
    {
      title: 'Ako ich môžete spravovať',
      paragraphs: [
        'Cookies môžete obmedziť alebo vymazať vo svojom prehliadači. Po zmene nastavení sa môže niektoré správanie webu upraviť alebo obmedziť podľa dostupných funkcií.',
      ],
    },
  ],
}

export const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Danau — Riadenie IT projektov, kybernetická bezpečnosť a GDPR',
    description: home.hero.text,
  },
  '/o-nas': { title: 'O nás — Danau', description: about.text },
  '/kontakt': { title: 'Kontakt — Danau', description: contactPage.text },
  '/ochrana-osobnych-udajov': { title: 'Ochrana osobných údajov — Danau', description: privacy.intro },
  '/cookies': { title: 'Cookies — Danau', description: cookies.intro },
  ...Object.fromEntries(
    services.map((s) => [`/sluzby/${s.slug}`, { title: `${s.navLabel} — Danau`, description: s.heroText }]),
  ),
}
