# danau.sk

Web spoločnosti DANAU, s.r.o. — React 18 + TypeScript + Vite, animácie cez `motion`, plynulé scrollovanie cez Lenis.
Slovenčina je na koreni webu (`/`), angličtina pod `/en` (vlastné adresy, napr. `/en/services/cybersecurity`).

## Príkazy

| príkaz | čo robí |
| --- | --- |
| `npm install` | nainštaluje závislosti |
| `npm run dev` | vývojový server na <http://localhost:5173> |
| `npm run build` | typová kontrola, produkčný build a predgenerovanie všetkých stránok do `dist/` |
| `npm run preview` | lokálne spustí hotový `dist/` |
| `npm run build:preview` | celý web v jednom HTML súbore (`dist-preview/index.html`) na zdieľanie náhľadu |

Kontaktný formulár posiela JSON na `/api/contact.php` (rovnako ako doterajší web). Pri vývoji ho
môžete presmerovať na živý server: `DANAU_API=https://danau.sk npm run dev`.

## Štruktúra

```
src/
  data/sk.ts, en.ts   všetok text webu po slovensky a po anglicky (vrátane titulkov a popisov pre vyhľadávače)
  data/site.ts        spoločné údaje (kontakt, typy)
  i18n.tsx            jazyky, adresy stránok, prepínanie SK / EN
  seo.ts              titulok, popis, canonical, hreflang, Open Graph, JSON-LD, sitemap.xml, llms.txt
  entry-server.tsx    vykreslenie stránky pri builde (predgenerovanie)
  pages/              jedna stránka = jedna route
  components/         hlavička, pätička, karty, animácie (PixelLoader, PixelMountains, PixelMark, …)
  lib/                súhlas s cookies (consent.ts), krivky animácií (motion.ts), pomôcky pre canvas a šum
  styles/global.css   farby, typografia a všetky štýly
scripts/prerender.mjs po builde zapíše HTML každej stránky, 404.html, sitemap.xml a llms.txt
public/
  .htaccess           pravidlá pre Apache (adresy, 404, presmerovania, cache, kompresia)
  robots.txt          povolenie indexovania + odkaz na sitemap
  og/                 obrázky pre zdieľanie (1200×630, SK a EN)
  logo.png, ikony     logo pre vyhľadávače, favicony, ikony pre mobil
```

## SEO

- Každá stránka (SK aj EN, spolu 22) sa pri `npm run build` predgeneruje do samostatného HTML s celým textom,
  takže ju vyhľadávače aj AI asistenti prečítajú aj bez JavaScriptu. V prehliadači sa web potom spustí ako aplikácia.
- Každá stránka má vlastný titulok a popis (v `data/sk.ts` a `data/en.ts`, sekcia `meta`), canonical adresu,
  prepojenie jazykových verzií (`hreflang`), Open Graph a Twitter náhľady a štruktúrované dáta (organizácia s
  adresou a kontaktom, web, stránka, drobčeková navigácia, služba).
- `sitemap.xml` obsahuje všetky stránky v oboch jazykoch a vzniká pri builde. `robots.txt` na ňu odkazuje.
- `llms.txt` je stručný prehľad firmy a služieb pre AI asistentov.
- Neexistujúce adresy vracajú skutočnú chybu 404 (stránka `404.html`, `noindex`).

Po nasadení odporúčame: pridať web do Google Search Console a Bing Webmaster Tools, odoslať
`https://danau.sk/sitemap.xml` a skontrolovať štruktúrované dáta v Rich Results Test.

## Cookies a Google Analytics

- Google Analytics 4 (`G-0RPSMNFFCV`, nastavené v `src/lib/consent.ts`) sa načíta **až po súhlase** v lište cookies.
  Bez súhlasu sa nenačíta nič a neukladajú sa žiadne cookies. Reklamné signály sú vypnuté (Consent Mode v2).
- Voľba sa ukladá v prehliadači (`danau-consent-v1`). Odkaz „Nastavenia cookies“ v pätičke a tlačidlo na stránke
  Cookies lištu znova otvoria. Po odvolaní súhlasu sa cookies `_ga` vymažú.
- Texty lišty a stránok Cookies a Ochrana osobných údajov sú v `src/data/sk.ts` a `src/data/en.ts`.
- V Google Analytics odporúčame nastaviť uchovávanie údajov (Admin → Data retention) a prijať podmienky
  spracúvania údajov (Admin → Account details → Data processing terms).

## Nasadenie

1. `npm run build`
2. Obsah `dist/` nahrajte do koreňa webu (vrátane skrytého súboru `.htaccess`). Priečinok `api/` (s `contact.php`)
   na serveri ponechajte.
3. Server musí čisté adresy obslúžiť predgenerovanými súbormi: `/o-nas` → `o-nas.html`, `/en/about` → `en/about.html`,
   `/` → `index.html`; neznámu adresu → `404.html` so stavom 404. Pre Apache to robí priložený `.htaccess`
   (aj presmerovanie z www a z http na `https://danau.sk` a adries s lomkou na konci alebo s `.html`).
   Na nginx zodpovedá: `try_files $uri $uri.html =404; error_page 404 /404.html;`.
