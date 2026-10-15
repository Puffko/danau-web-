# danau.sk

Web spoločnosti DANAU, s.r.o. — React 18 + TypeScript + Vite, animácie cez `motion`, plynulé scrollovanie cez Lenis.

## Príkazy

| príkaz | čo robí |
| --- | --- |
| `npm install` | nainštaluje závislosti |
| `npm run dev` | vývojový server na <http://localhost:5173> |
| `npm run build` | typová kontrola (`tsc -b`) a produkčný build do `dist/` |
| `npm run preview` | lokálne spustí hotový `dist/` |

Kontaktný formulár posiela JSON na `/api/contact.php` (rovnako ako doterajší web). Pri vývoji ho
môžete presmerovať na živý server: `DANAU_API=https://danau.sk npm run dev`.

## Štruktúra

```
src/
  data/site.ts        všetok text webu (služby, sekcie, kontakty) – obsah meňte tu
  pages/              jedna stránka = jedna route
  components/         hlavička, pätička, karty, animácie
    PixelMountains    canvas s pixelovými horami v hero
    PixelSphere       pixelová guľa v sekcii „Ako pracujeme?“
  styles/global.css   farby, typografia a všetky štýly
public/
  .htaccess           presmerovanie pre SPA na Apache (necháva /api/ bez zmeny)
  favicon.svg         ikona webu (symbol D)
```

## Nasadenie

1. `npm run build`
2. Obsah `dist/` nahrajte do koreňa webu. Priečinok `api/` (s `contact.php`) na serveri ponechajte.
3. Server musí neznáme cesty presmerovať na `index.html` – pre Apache to robí priložený `.htaccess`.

## Logá partnerov

Sekcia „Naši partneri“ na hlavnej stránke zatiaľ zobrazuje zástupné logá. Skutočné logá pridáte
takto: súbor (ideálne SVG) vložte do `public/partneri/` a v `src/data/site.ts` doplňte pri
príslušnej položke v `home.partners.items` napr. `{ name: 'Názov firmy', logo: '/partneri/firma.svg', href: 'https://…' }`.

## Náhľad v jednom súbore

`npm run build:preview` vytvorí `dist-preview/index.html` – celý web v jednom HTML súbore (navigácia cez `#/…`),
vhodný na rýchle zdieľanie náhľadu. Nie je určený na nasadenie (formulár v ňom neodosiela).
