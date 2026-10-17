// Slovak copy, taken verbatim from the live danau.sk. Edit content here, not in components;
// en.ts mirrors this file key for key.
import type { AreaPart, LegalPage, Service, ServiceId } from './site'

const services: Service[] = [
  {
    id: 'projektove-riadenie',
    slug: 'projektove-riadenie',
    name: 'Projektové a programové riadenie',
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
          'vedenie projektov podľa vyhlášky č. 401/2023 Z. z.',
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
    id: 'kyberneticka-bezpecnost',
    slug: 'kyberneticka-bezpecnost',
    name: 'Kybernetická bezpečnosť',
    cardText:
      'Pomáhame organizáciám pripraviť sa na audit, overiť stav procesov, doplniť dokumentáciu, riadiť nápravné opatrenia a zabezpečiť odbornú kapacitu manažéra kybernetickej bezpečnosti (MKB) formou outsourcingu alebo priebežnej podpory.',
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
          'Prípravu na audit kybernetickej bezpečnosti',
          'validáciu procesov',
          'dokumentáciu',
          'vedenie počas auditu',
          'outsourcing manažéra kybernetickej bezpečnosti (MKB)',
          'rizikové analýzy a riadenie kontinuity činností (BCM)',
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
    id: 'gdpr-a-dpo',
    slug: 'gdpr-a-dpo',
    name: 'GDPR a outsourcing DPO',
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
          'podporu pri právach dotknutých osôb, incidentoch a posúdení vplyvu na ochranu údajov (DPIA)',
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
    id: 'analyza-a-data',
    slug: 'analyza-a-data',
    name: 'Analytické činnosti',
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
        body: 'Pomáhame nastaviť základný rámec práce s dátami, zodpovednosti, dátové roly a princípy, ktoré podporujú kvalitu dát a ich využitie v rozhodovaní, reportingu a ďalšom rozvoji.',
        service: 'data-governance',
      },
    ],
    ctaTitle: 'Potrebujete procesnú analýzu, analytické podklady alebo zavedenie dátového manažmentu?',
  },
  {
    id: 'data-governance',
    slug: 'data-governance',
    name: 'Data governance a manažment dát',
    cardText:
      'Pomáhame zavádzať dátový manažment, pravidlá práce s dátami, zodpovednosti a dátové princípy, ktoré podporujú riadenie organizácie aj ďalší rozvoj IT.',
    icon: 'data',
    illustration: 'database',
    heroTitle: 'Nastavíme dátové riadenie tak, aby podporovalo spoľahlivé dáta a ich reálnu hodnotu',
    heroText:
      'Pomáhame organizáciám určiť, kto za dáta zodpovedá, ako sa s nimi pracuje a ako sa stráži ich kvalita.',
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
    id: 'realizacia-it',
    slug: 'realizacia-it',
    name: 'Realizácia IT projektov',
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

const home = {
  hero: {
    // a non-breaking space keeps 'IT projektov' together on one line
    title: 'Riadenie IT projektov, kybernetická bezpečnosť, GDPR a odborná podpora',
    text: 'Pomáhame organizáciám pripraviť, riadiť a doručiť zmeny v oblastiach IT, bezpečnosti, ochrany osobných údajov, dát a procesov. Spájame projektové riadenie, kybernetickú bezpečnosť, GDPR, analytiku a realizáciu riešení do jedného funkčného celku.',
    primary: 'Kontakt',
    secondary: 'Naše služby',
  },
  partner: {
    title: 'Partner pre verejný aj komerčný sektor',
    // The live copy, split across the diagram: lead -> "Pre koho", body -> "Prístup" + "Výsledok".
    lead: 'DANAU, s.r.o. je odborný partner pre orgány verejnej moci, štátne a verejné inštitúcie, regulované organizácie aj komerčné spoločnosti, ktoré potrebujú zvládnuť projekt, audit, modernizáciu prostredia alebo posilniť svoje interné kapacity.',
    approach:
      'Naše služby sú postavené na prepájaní odborného obsahu, metodiky, riadenia a praktickej realizácie. Nepomáhame iba pripraviť dokument.',
    outcome:
      'Pomáhame klientovi pripraviť rozhodnutie, nastaviť projekt, doplniť dokumentáciu, stabilizovať riadenie a dodať výsledok, ktorý obstojí vecne, procesne aj prevádzkovo.',
    labels: { lead: 'Pre koho', approach: 'Prístup', outcome: 'Výsledok' },
  },
  services: {
    title: 'Komplexné riešenia pre vaše IT a bezpečnostné výzvy',
    more: 'Zistiť viac',
  },
  process: {
    title: 'Ako pracujeme?',
    // The two paragraphs, split across the diagram: the first one's last sentence is the need.
    challenge:
      'Organizácie dnes často riešia projekty a zmeny, ktoré presahujú jednu odbornú oblasť. Nestačí mať iba dobrý zámer alebo technické riešenie.',
    need: 'Potrebné je prepojiť riadenie, analýzu, dokumentáciu, bezpečnosť, GDPR, kvalitu a schopnosť doručiť výsledok.',
    solution:
      'DANAU vstupuje práve tam, kde organizácia potrebuje externé know-how, odbornú kapacitu alebo partnera, ktorý prevezme konkrétnu rolu. Pomáhame pripraviť projekt, stabilizovať jeho riadenie, zvládnuť audit, doplniť dokumentáciu, nastaviť bezpečnostné procesy, GDPR agendu alebo realizovať vybrané IT riešenie.',
    labels: { challenge: 'Výzva', need: 'Potreba', solution: 'Riešenie' },
  },
  expertise: {
    title: 'Odbornosť a skúsenosti',
    lead: 'Staviame na kombinácii praktických skúseností a odborných certifikácií v oblastiach projektového riadenia, kybernetickej bezpečnosti, ochrany osobných údajov, informačnej bezpečnosti, enterprise architektúry a riadenia IT služieb.',
    listIntro: 'Súčasťou odborného zázemia DANAU sú kompetencie a certifikácie ako:',
    // The certifications, grouped under the areas the lead names (in its order).
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

const about = {
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
  ] as AreaPart[],
  whatEdge: 'Našou výhodou je schopnosť prepájať tieto oblasti do jedného zrozumiteľného a riaditeľného prístupu.',
  skillsTitle: 'Kľúčové odbornosti',
  // Each expertise with the area it belongs to (the areas named under "Odbornosť a skúsenosti").
  skills: [
    { name: 'IPMA', area: 'Projektové riadenie' },
    { name: 'PRINCE2', area: 'Projektové riadenie' },
    { name: 'Lead Auditor ISO/IEC 27001', area: 'Informačná bezpečnosť' },
    { name: 'ITIL', area: 'Riadenie IT služieb' },
    { name: 'TOGAF', area: 'Enterprise architektúra' },
    { name: 'Manažér kybernetickej bezpečnosti (MKB)', area: 'Kybernetická bezpečnosť' },
    { name: 'Audit kybernetickej bezpečnosti', area: 'Kybernetická bezpečnosť' },
    { name: 'Certifikovaní DPO', area: 'Ochrana osobných údajov' },
  ],
}

const contactPage = {
  title: 'Kontakt',
  text: 'Hľadáte partnera pre prípravu projektu, podporu verejného obstarávania, vedenie projektu, audit kybernetickej bezpečnosti, GDPR agendu, analytické činnosti, dátový manažment alebo realizáciu IT riešenia? Napíšte nám. Ozveme sa vám a dohodneme si úvodnú konzultáciu.',
  formTitle: 'Napíšte nám',
  success: 'Správa bola úspešne odoslaná. Ozveme sa vám čo najskôr.',
  failure: 'Správu sa nepodarilo odoslať. Skúste to, prosím, neskôr.',
  consent: 'Súhlasím so spracovaním osobných údajov za účelom kontaktovania.',
  submit: 'Odoslať správu',
  sending: 'Odosielam…',
  hint: 'Polia označené * sú povinné.',
  fields: {
    fullName: { label: 'Meno a priezvisko', placeholder: 'Zadajte vaše meno' },
    organization: { label: 'Organizácia', placeholder: 'Názov vašej organizácie' },
    email: { label: 'E-mail', placeholder: 'vas@email.sk' },
    phone: { label: 'Telefón', placeholder: '+421' },
    message: { label: 'Správa', placeholder: 'Ako vám môžeme pomôcť?' },
  },
  errors: {
    fullName: 'Vyplňte meno a priezvisko.',
    email: 'Vyplňte e-mail, aby sme vám mohli odpovedať.',
    emailFormat: 'E-mail nemá správny tvar, napr. meno@firma.sk.',
    message: 'Napíšte, s čím vám môžeme pomôcť.',
    consent: 'Bez súhlasu vás nemôžeme kontaktovať.',
  },
  newWindow: ' (otvorí sa v novom okne)',
  writeUs: 'Prípadne nám napíšte na',
  preview: 'Toto je náhľad návrhu webu, formulár sa z neho neodosiela.',
}

const footer = {
  claim: 'Povedzte nám, čo potrebujete vyriešiť.',
  servicesTitle: 'Služby',
  linksTitle: 'Rýchle odkazy',
  contactTitle: 'Kontakt',
  copyright: `© ${new Date().getFullYear()} DANAU, s.r.o. Všetky práva vyhradené.`,
}

const privacy: LegalPage = {
  title: 'Ochrana osobných údajov',
  intro:
    'Na tejto stránke nájdete informácie o tom, aké osobné údaje spracúvame pri obchodnej komunikácii, projektovej spolupráci a prevádzke webu spoločnosti DANAU, s.r.o., na aký účel, ako dlho a aké máte práva.',
  updated: 'Posledná aktualizácia: 16. 10. 2026',
  sections: [
    {
      title: 'Prevádzkovateľ a kontakt',
      paragraphs: [
        'Prevádzkovateľom je DANAU, s.r.o., so sídlom Doležalova 15/C, 821 04 Bratislava, IČO 54 908 159, zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka č. 164139/B.',
        'Pre otázky o ochrane osobných údajov a na uplatnenie vašich práv nás môžete kontaktovať na adrese info@danau.sk alebo telefonicky na čísle +421 948 222 666.',
      ],
    },
    {
      title: 'Aké údaje spracúvame a na aký účel',
      paragraphs: [
        'Spracúvame najmä identifikačné a kontaktné údaje, ktoré nám poskytnete pri dopyte, pri príprave projektu, pri zmluvnej komunikácii alebo pri priebežnej spolupráci. Rozsah údajov vždy viažeme na konkrétny účel:',
      ],
      list: [
        'Kontaktný formulár, e-mail a telefón – meno a priezvisko, organizáciu, e-mailovú adresu, telefónne číslo a obsah správy spracúvame, aby sme vám odpovedali a dohodli si úvodnú konzultáciu. Právnym základom je váš súhlas (čl. 6 ods. 1 písm. a) GDPR), a ak dopyt smeruje k uzavretiu zmluvy, aj opatrenia pred jej uzavretím (čl. 6 ods. 1 písm. b) GDPR).',
        'Príprava ponuky a zmluvná spolupráca – identifikačné a kontaktné údaje kontaktných osôb spracúvame na prípravu ponuky, plnenie zmluvy a súvisiacu komunikáciu (čl. 6 ods. 1 písm. b) GDPR) a na plnenie zákonných povinností, napríklad v účtovníctve (čl. 6 ods. 1 písm. c) GDPR).',
        'Meranie návštevnosti webu – iba s vaším súhlasom používame Google Analytics 4 (čl. 6 ods. 1 písm. a) GDPR). Podrobnosti nájdete na stránke Cookies.',
        'Prevádzka a bezpečnosť webu – pri návšteve webu môže server zaznamenať technické údaje, ako je IP adresa, čas prístupu a navštívená adresa, aby bol web dostupný a chránený pred zneužitím (oprávnený záujem, čl. 6 ods. 1 písm. f) GDPR).',
      ],
    },
    {
      title: 'Komu údaje sprístupňujeme',
      paragraphs: [
        'Osobné údaje sprístupňujeme len v nevyhnutnom rozsahu: poskytovateľom, ktorí pre nás ako sprostredkovatelia zabezpečujú hosting webu a e-mailu, a pri meraní návštevnosti spoločnosti Google Ireland Limited. Údaje poskytneme aj orgánom verejnej moci, ak nám to ukladá zákon.',
      ],
    },
    {
      title: 'Prenos mimo Európskej únie',
      paragraphs: [
        'Údaje z Google Analytics môže spoločnosť Google spracúvať aj v USA. Spoločnosť Google LLC je certifikovaná v rámci EÚ – USA rámca na ochranu osobných údajov (Data Privacy Framework), na ktorý sa vzťahuje rozhodnutie Európskej komisie o primeranosti ochrany.',
      ],
    },
    {
      title: 'Ako dlho údaje uchovávame',
      paragraphs: [
        'Údaje z dopytov uchovávame počas ich vybavenia a následnej komunikácie. Ak z dopytu nevznikne spolupráca, vymažeme ich, keď už nie sú potrebné na účel, na ktorý sme ich získali, alebo keď odvoláte svoj súhlas.',
        'Údaje zo zmluvnej spolupráce uchovávame počas trvania zmluvy a po jej skončení po dobu, ktorú vyžadujú právne predpisy, napríklad účtovné doklady 10 rokov podľa zákona č. 431/2002 Z. z. o účtovníctve.',
        'Údaje v Google Analytics sa uchovávajú najviac 14 mesiacov a analytické cookies majú platnosť najviac 2 roky.',
      ],
    },
    {
      title: 'Vaše práva',
      paragraphs: ['V súvislosti so spracúvaním osobných údajov máte právo:'],
      list: [
        'požiadať o prístup k svojim osobným údajom (čl. 15 GDPR),',
        'požiadať o ich opravu (čl. 16 GDPR) alebo výmaz (čl. 17 GDPR),',
        'požiadať o obmedzenie spracúvania (čl. 18 GDPR),',
        'na prenosnosť údajov (čl. 20 GDPR),',
        'namietať proti spracúvaniu na základe oprávneného záujmu (čl. 21 GDPR),',
        'kedykoľvek odvolať súhlas bez vplyvu na zákonnosť spracúvania pred jeho odvolaním (čl. 7 ods. 3 GDPR).',
      ],
      after: [
        'Ak sa domnievate, že s údajmi nakladáme nesprávne, môžete sa obrátiť priamo na nás a zároveň máte právo podať návrh na začatie konania na Úrade na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, www.dataprotection.gov.sk.',
      ],
    },
    {
      title: 'Povinnosť poskytnúť údaje',
      paragraphs: [
        'Poskytnutie údajov v kontaktnom formulári je dobrovoľné. Bez mena a e-mailovej adresy vám však nevieme odpovedať. Nevykonávame automatizované individuálne rozhodovanie ani profilovanie.',
      ],
    },
  ],
}

const cookies: LegalPage = {
  title: 'Cookies',
  intro:
    'Na tejto stránke nájdete, aké cookies a podobné technológie web danau.sk používa, na aký účel a ako môžete svoj súhlas kedykoľvek zmeniť.',
  updated: 'Posledná aktualizácia: 16. 10. 2026',
  sections: [
    {
      title: 'Čo sú cookies',
      paragraphs: [
        'Cookies sú malé súbory uložené v prehliadači, ktoré si web zapamätá medzi jednotlivými návštevami. Podobne funguje aj lokálne úložisko prehliadača (localStorage).',
      ],
    },
    {
      title: 'Aké cookies používame',
      paragraphs: ['Web danau.sk používa iba tieto položky:'],
      cookies: {
        labels: { provider: 'Poskytovateľ', expiry: 'Platnosť' },
        groups: [
          {
            title: 'Nevyhnutné',
            note: 'Vždy aktívne',
            consent: false,
            items: [
              {
                name: 'danau-consent-v1',
                provider: 'danau.sk',
                purpose: 'Uloží vašu voľbu v lište cookies (lokálne úložisko).',
                expiry: 'Kým voľbu nezmeníte alebo nevymažete údaje prehliadača',
              },
            ],
          },
          {
            title: 'Analytické',
            note: 'Len s vaším súhlasom',
            consent: true,
            items: [
              {
                name: '_ga',
                provider: 'Google',
                purpose: 'Rozlišuje návštevníkov pre súhrnnú štatistiku návštevnosti.',
                expiry: '2 roky',
              },
              {
                name: '_ga_0RPSMNFFCV',
                provider: 'Google',
                purpose: 'Uchováva stav návštevy pre štatistiku návštevnosti.',
                expiry: '2 roky',
              },
            ],
          },
        ],
      },
      after: [
        'Nevyhnutná položka nepotrebuje súhlas, lebo bez nej by web nevedel rešpektovať vašu voľbu. Reklamné cookies ani cookies sociálnych sietí nepoužívame. Písma a ostatné súbory webu sa načítavajú z nášho servera.',
      ],
    },
    {
      title: 'Analytické cookies (Google Analytics)',
      paragraphs: [
        'Návštevnosť meriame službou Google Analytics 4 od spoločnosti Google Ireland Limited, a to iba s vaším súhlasom. Bez súhlasu sa Google Analytics nenačíta a žiadne analytické cookies sa neukladajú.',
        'Po udelení súhlasu sa ukladajú cookies _ga a _ga_* s platnosťou do 2 rokov. Údaje vyhodnocujeme v súhrnnej podobe; reklamné funkcie, Google signály a prispôsobenie reklám sú vypnuté. Google Analytics 4 neukladá IP adresy. Viac o spracúvaní údajov nájdete na stránke Ochrana osobných údajov.',
      ],
    },
    {
      title: 'Ako môžete svoj súhlas zmeniť',
      paragraphs: [
        'Svoj súhlas môžete kedykoľvek zmeniť alebo odvolať tlačidlom nižšie alebo odkazom „Nastavenia cookies“ v pätičke webu. Po odvolaní súhlasu analytické cookies vymažeme.',
        'Cookies môžete obmedziť alebo vymazať aj vo svojom prehliadači. Po zmene nastavení sa môže niektoré správanie webu upraviť alebo obmedziť podľa dostupných funkcií.',
      ],
      consentButton: true,
    },
  ],
}

/** Interface text that is not page copy: navigation, labels, accessible names. */
const ui = {
  country: 'Slovensko',
  company: {
    ico: 'IČO',
    dic: 'DIČ',
    icDph: 'IČ DPH',
    register: 'Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka č. 164139/B',
  },
  cookieBar: {
    label: 'Súhlas s cookies',
    text: 'S vaším súhlasom používame analytické cookies (Google Analytics), aby sme vedeli, ako sa web používa. Bez súhlasu sa nenačítajú.',
    more: 'Viac o cookies',
    accept: 'Prijať',
    reject: 'Odmietnuť',
    settings: 'Nastavenia cookies',
  },
  skip: 'Preskočiť na obsah',
  brandLabel: 'Danau – domov',
  mainNav: 'Hlavná navigácia',
  mobileNav: 'Mobilná navigácia',
  openMenu: 'Otvoriť hlavnú navigáciu',
  closeMenu: 'Zatvoriť hlavnú navigáciu',
  nav: { home: 'Domov', services: 'Služby', about: 'O nás', contact: 'Kontakt' },
  allServices: 'Všetky služby',
  language: 'Jazyk',
  backToServices: 'Späť na služby',
  moreServices: 'Ďalšie služby',
  ctaAction: 'Ozvite sa nám',
  seat: 'Sídlo spoločnosti',
  notFound: {
    title: 'Táto stránka ešte neexistuje.',
    text: 'Adresa, ktorú ste otvorili, na webe nie je. Pokračujte na hlavnú stránku alebo do prehľadu služieb.',
    home: 'Otvoriť hlavnú stránku',
    services: 'Naše služby',
  },
}

/**
 * Search and sharing metadata: titles (under ~60 characters, keyword first, brand last) and
 * descriptions (~150-160 characters) built from the page copy above, nothing beyond it.
 */
const meta = {
  locale: 'sk_SK',
  home: {
    title: 'Riadenie IT projektov, kybernetická bezpečnosť a GDPR | Danau',
    description:
      'Pomáhame organizáciám pripraviť, riadiť a doručiť zmeny v oblastiach IT, bezpečnosti, ochrany osobných údajov, dát a procesov. DANAU, s.r.o., Bratislava.',
  },
  about: {
    title: 'O nás – odborný partner pre IT, bezpečnosť a GDPR | Danau',
    description:
      'Sme odborný partner pre organizácie, ktoré potrebujú kvalitne pripraviť, riadiť a realizovať projekty alebo posilniť interné odborné kapacity.',
  },
  contact: {
    title: 'Kontakt – Danau, Doležalova 15/C, Bratislava',
    description:
      'Napíšte nám na info@danau.sk alebo zavolajte na +421 948 222 666. Ozveme sa vám a dohodneme si úvodnú konzultáciu. DANAU, s.r.o., Bratislava.',
  },
  privacy: { title: 'Ochrana osobných údajov | Danau' },
  cookies: { title: 'Používanie cookies | Danau' },
  /** Per service, by id; the description falls back to the service's hero text. */
  services: {
    'projektove-riadenie': { title: 'Projektové a programové riadenie IT projektov | Danau' },
    'kyberneticka-bezpecnost': { title: 'Kybernetická bezpečnosť a príprava na audit | Danau' },
    'gdpr-a-dpo': {
      title: 'GDPR a outsourcing zodpovednej osoby (DPO) | Danau',
      description:
        'Pomáhame nastaviť ochranu osobných údajov, GDPR dokumentáciu, procesy a zodpovednosti. Poskytujeme aj externú zodpovednú osobu alebo seniornú podporu interného DPO.',
    },
    'analyza-a-data': { title: 'Analýza procesov a analytické činnosti | Danau' },
    'data-governance': {
      title: 'Data governance a manažment dát | Danau',
      // the hero text is shared with "Analytika a dáta"; the card text is this page's own
      description:
        'Pomáhame zavádzať dátový manažment, pravidlá práce s dátami, zodpovednosti a dátové princípy, ktoré podporujú riadenie organizácie aj ďalší rozvoj IT.',
    },
    'realizacia-it': { title: 'Realizácia IT projektov a riešení | Danau' },
  } as Record<ServiceId, { title: string; description?: string }>,
  breadcrumbHome: 'Domov',
  imageAlt: 'Danau – riadenie IT projektov, kybernetická bezpečnosť, GDPR a odborná podpora',
  notFound: { title: 'Stránka neexistuje | Danau', description: 'Stránka, ktorú hľadáte, na webe danau.sk neexistuje.' },
}

export const sk = { services, home, about, contactPage, footer, privacy, cookies, ui, meta }

export type Content = typeof sk
