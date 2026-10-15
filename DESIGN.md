---
name: Danau
description: Calm grid under complex IT change; a night-blue world where one dot matrix assembles into landscape.
colors:
  brand-blue: "#1818ec"
  brand-blue-deep: "#1010dc"
  blue-300: "#8796ff"
  blue-200: "#b3c2ff"
  blue-100: "#dae3ff"
  tint: "#eeeeff"
  sky: "#bfdbfe"
  sky-2: "#93c5fd"
  night: "#05061a"
  night-2: "#0a0c34"
  ink: "#111827"
  ink-2: "#374151"
  muted: "#4b5563"
  subtle: "#6b7280"
  line: "#e5e7eb"
  surface: "#f4f4f4"
  surface-2: "#f9fafb"
  white: "#ffffff"
  ok-bg: "#ecfdf3"
  ok-line: "#bbf7d0"
  ok-ink: "#166534"
  err-bg: "#fef2f2"
  err-line: "#fecaca"
  err-ink: "#b91c1c"
typography:
  display:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.5rem, 1rem + 4.3vw, 4.75rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.042em"
    fontFeature: "'ss01', 'cv11'"
  display-page:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.1rem + 3.4vw, 4.25rem)"
    fontWeight: 300
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  display-list:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 0.9rem + 3vw, 3.75rem)"
    fontWeight: 290
    lineHeight: 1.16
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.25rem + 2.5vw, 3.5rem)"
    fontWeight: 300
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline-sm:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 1.2rem + 1.3vw, 2.375rem)"
    fontWeight: 330
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  statement:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 1.15rem + 1.35vw, 2.375rem)"
    fontWeight: 340
    lineHeight: 1.28
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 0.6vw, 1.625rem)"
    fontWeight: 380
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.45vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.012em"
  body:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 520
    lineHeight: 1.6
    letterSpacing: "-0.005em"
  small:
    fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  pill: "999px"
  xl: "32px"
  lg: "24px"
  md: "20px"
  sm: "14px"
  note: "12px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  container: "1240px"
  header: "76px"
  section: "clamp(88px, 11vw, 160px)"
  section-tight: "clamp(48px, 6vw, 80px)"
  grid-gap: "16px"
  grid-gap-sm: "12px"
  card-pad: "28px"
components:
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 22px 0 26px"
    height: "52px"
  button-light-hover:
    backgroundColor: "{colors.tint}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  button-primary:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 22px 0 26px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.brand-blue-deep}"
  button-header-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 20px"
    height: "44px"
  button-header-solid-hover:
    backgroundColor: "{colors.brand-blue}"
  icon-chip:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.brand-blue}"
    rounded: "{rounded.pill}"
    size: "46px"
  icon-chip-active:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.white}"
  service-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-pad}"
  service-card-hover:
    backgroundColor: "{colors.brand-blue}"
  link-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "clamp(24px, 3vw, 36px)"
  link-card-hover:
    backgroundColor: "{colors.tint}"
  cta-band:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "clamp(64px, 9vw, 128px) clamp(24px, 6vw, 96px)"
  input:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
  input-focus:
    backgroundColor: "{colors.white}"
  form-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "clamp(24px, 4vw, 48px)"
  nav-link:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "40px"
---

# Design System: Danau

## Overview

**Creative North Star: "The Assembling Field"**

Danau is the calm grid under complex IT change. The world is built from one material: a matrix of square blue cells that, on night ink, assembles into mountains, service glyphs, a sphere and the footer wordmark. Many separate disciplines resolve into one landscape. Everything else is quiet: white and pale-gray reading grounds, ink text, light Geist set large with tight tracking, generous whitespace, soft 24px surfaces and pill buttons.

Pages alternate between two climates. Night bands (hero, sub-page hero, the "Pre koho pracujeme?" list, the footer, the CTA band in brand blue) carry the glow and the matrix; light bands (white, #F4F4F4, #F9FAFB) carry the reading. The glow always rises from below: a radial wash of brand blue warming into pale periwinkle at the bottom edge of every dark ground, never a top-lit gradient.

Density is low and deliberate. Copy is the live danau.sk text verbatim; the system never adds invented proof, kickers or decorative labels to fill space. Motion is articulate but calm: words rise out of masks, blocks rise and unblur, the matrix ignites and then idles.

**Key Characteristics:**
- One shared dot/pixel matrix is the single signature material, on canvas and in SVG.
- Night grounds lit from below by a brand-blue glow; light grounds for reading.
- Geist Variable at light weights (280–340) for all display sizes, negative tracking.
- Pill buttons, circular icon chips, 24px cards, 32px feature panels.
- Shadows are soft, long, blue-tinted, and appear mostly on hover.
- Every motion has a reduced-motion path that keeps content static and visible.

## Colors

The live danau.sk palette: one saturated brand blue with its night and periwinkle family, set against cool Tailwind-gray neutrals.

### Primary
- **Danau Blue** (brand-blue): the brand voice. Primary submit button, icon-chip active state, checklist marks, focus outline, text selection, CTA band ground, the core stop of every bottom glow, active underline/progress accents.
- **Pressed Blue** (brand-blue-deep): hover state of blue buttons; a ramp stop in the sphere.

### Secondary
- **Periwinkle family** (blue-300, blue-200, blue-100): the light side of the glow and the matrix. blue-200 marks the active "pixel" in the clients list, footer contact icons, progress bars, the About underline. blue-100 is the hover border of light tiles. blue-300 is the scrollbar thumb.
- **Tint** (tint): icon-chip ground, dropdown "all services" row, link-card hover, light-button hover.
- **Sky** (sky, sky-2): pale-blue dot-matrix highlights named in the brand palette; reserved for matrix and glow work on night grounds.

### Neutral
- **Night** (night, night-2): grounds of hero, sub-page hero, clients list, footer, mobile menu and the html background. Gradient runs night at top to night-2 at bottom before the blue glow.
- **Ink** (ink): all body headings and text on light grounds; header CTA once the header turns solid.
- **Ink Soft** (ink-2): form labels, checklist items, partners title, consent copy.
- **Gray Copy** (muted): body copy, card descriptions, info labels.
- **Subtle** (subtle): placeholders only.
- **Hairline** (line): 1px borders on tiles, inputs, form card, marquee rules, section dividers.
- **Surface** (surface): service cards, checklist, link cards, the "Ako pracujeme?" band.
- **Surface Light** (surface-2): input fields, alternating section band, dropdown item hover.
- **Status** (ok-*, err-*): form notices and field errors only.

### Named Rules
**The Glow From Below Rule.** Every night ground is lit by a radial brand-blue glow anchored past its bottom edge (roughly 50% 108–120%), fading to night by ~75%. Never light a dark band from the top or the side.

**The One Blue Rule.** Danau Blue is the only saturated hue. Light-ground screens use it for actions, marks and focus only; large blue fields are reserved for the CTA band and the glows.

**The White-On-Night Opacity Rule.** Secondary text on night uses white at 0.7–0.8 alpha (rgba(255,255,255,0.78) for paragraphs); hairlines on night use white at 0.12–0.14.

## Typography

**Display Font:** Geist Variable (self-hosted, with Geist, ui-sans-serif, system-ui fallbacks)
**Body Font:** Geist Variable
**Label/Mono Font:** none distinct; tabular numerals on contact values.

**Character:** One variable family carrying the whole voice. Display sizes are feather-light (280–340) with tight negative tracking so long Slovak headlines read as calm, wide lines; weight rises (380, 420, 520) only as size drops. Stylistic sets ss01 and cv11 are on globally.

### Hierarchy
- **Display** (300, clamp 2.5–4.75rem, 1.02, -0.042em): home hero H1 only, bottom-left on night.
- **Display Page** (300, clamp 2.25–4.25rem, 1.04, -0.04em, max 20ch): sub-page hero H1.
- **Display List / Marquee** (280–290, up to 3.75–4.75rem, -0.04 to -0.045em): the sticky clients list names and the certification marquee.
- **Headline** (300, clamp 2–3.5rem, 1.06, -0.035em): section H2s. CTA band and footer claim use the same voice at 300, -0.035em.
- **Headline Small** (330, clamp 1.625–2.375rem, 1.12): service-detail block titles, "Ďalšie služby".
- **Statement** (340, clamp 1.625–2.375rem, 1.28): the large scroll-inked paragraph on About.
- **Title** (380, clamp 1.375–1.625rem, 1.15, -0.025em): card and link-card titles; info-card values at 380.
- **Lead** (400, clamp 1.125–1.375rem, 1.5): opening paragraph of a split section, ink color.
- **Body** (400, 1.0625rem, 1.7, gray copy, max 68ch): running text.
- **Label** (520, 0.9375rem): buttons, nav, card "more" rows, footer column titles, checklist titles.
- **Small** (400, 0.875rem): form hints, info labels, footer legal row.

### Named Rules
**The Light Display Rule.** Anything set above ~1.6rem is weight 380 or lighter, with negative tracking of at least -0.025em. Never bold a headline.

**The Mask Rule.** Headings enter word by word, each word rising from its own clipping mask (y 108% to 0, 0.9s, ease-out, ~0.035s stagger). The mask carries padding for diacritics and descenders; keep it when adding headings.

## Layout

A 1240px container with a fluid gutter (clamp 16–40px). Sections breathe at clamp(88px, 11vw, 160px) vertically; tight sections (CTA band wrapper, related services) at clamp(48px, 6vw, 80px).

The recurring structure is the **split**: a 5fr heading column beside a 6fr body column (gap up to 112px), used on About; consecutive splits are separated by a hairline rule with symmetric padding. Grids: services 3 columns (2 under 960px, 1 under 640px, gap 16px); skills 4 columns; partners and related services 6/5 columns, collapsing to 3 then 2 (gap 12px).

The home hero is full-viewport (min 720px / 100svh) with H1 bottom-left across 1.55fr and the paragraph plus actions in the right 1fr, aligned to the H1's baseline; the lower ~56% is the matrix range. Sub-page heroes put the title top-left with an optional aside (pixel glyph or wordmark) at 7fr/4fr. The About hero is its own sibling: the four-quadrant D of the logo drawn in the matrix (on the mountains' grid, assembling quadrant by quadrant) stands in the range on the left (5fr), the H1 at display scale with the grey glint and about.text as a statement on the right (6fr), then a hairline with one periwinkle pixel and a signature row (Kontakt pill; company, address, e-mail and phone as pixel-dash links). Under 960px the D and the H1 lock up like the wordmark, H1 on the D's baseline. The "Pre koho pracujeme?" section is a sticky stage whose height scales with the item count (52vh per item); under 960px wide or 640px tall it unpins into a plain stacked list.

Breakpoints: 1100px (desktop nav becomes the full-screen menu; process diagram becomes a stacked column), 960px (splits and hero collapse to one column), 640px (header 68px, single-column cards and form rows).

## Elevation & Depth

Depth comes mostly from climate (night vs. light bands) and tonal surfaces (#F4F4F4 cards on white). Shadows exist but are soft, long, negatively spread and tinted toward blue or night; they appear chiefly as a hover response. The solid header uses a blurred translucent white (saturate 1.5, blur 18px) over a hairline.

### Shadow Vocabulary
- **Card lift** (`0 40px 70px -40px rgba(24,24,236,0.4)`): service card on hover/focus, with translateY(-6px). Skill tiles use `0 32px 60px -36px rgba(24,24,236,0.45)`.
- **Light button** (`0 10px 30px -12px rgba(5,6,26,0.55)`, hover `0 16px 40px -14px rgba(135,150,255,0.8)`): the white pill on night.
- **Primary button** (`0 14px 30px -14px rgba(24,24,236,0.75)`): the blue submit pill.
- **Panel** (`0 2px 6px rgba(17,24,39,0.04), 0 32px 64px -24px rgba(5,6,26,0.35)`): services dropdown.
- **Form card** (`0 48px 90px -50px rgba(17,24,39,0.28)`): the contact form panel, the one resting shadow on a light ground.
- **Note pill** (`0 1px 2px rgba(17,24,39,0.06), 0 10px 24px -14px rgba(17,24,39,0.28)`): the "Výzva" / "Cieľ" labels on the process diagram.

### Named Rules
**The Lift-On-Hover Rule.** Cards are flat at rest and lift (translateY -4 to -6px plus a blue-tinted long shadow) only on hover or keyboard focus.

**The Soft Shadow Rule.** Every shadow has a large blur and a negative spread. No hard offset shadows.

## Shapes

Soft, generous corners on surfaces and full pills on anything clickable and small. Feature panels (CTA band, form card) are 32px; cards, checklists, link cards, dropdown panel and skill tiles are 24px; partner tiles 20px; inputs, notices and dropdown rows 14px; the process note pill 12px; the consent checkbox 7px. Buttons and nav links are pills; icon chips, card arrows and the menu toggle are circles.

The matrix is the contrast to all this softness: its cells are hard squares (canvas fillRect, SVG rect pattern), and the clients-list "pixel" and active nav dot are sharp squares. Ambient CSS dot fields (card hover corner, CTA band, clients background, contact info card) are tiny round dots on a 10–14px pitch, always masked by a radial fade.

Arrows rotate to signal motion: card arrows turn -45deg on hover, the header "↗" nudges up-right, inline arrows slide 4px.

## Components

### Buttons
Confident, quiet pills.
- **Shape:** full pill (999px), height 52px (44px in the header), label weight 520, trailing arrow icon.
- **Light (primary on night):** white with ink text; hover to tint with a periwinkle shadow. The main "Konzultovať potrebu" action in hero, CTA band, footer, mobile menu and 404.
- **Ghost (secondary on night):** transparent, white text, 1px white border at 0.38 alpha; hover fills white at 0.1 and border to 0.7.
- **Primary (on light):** Danau Blue, white text; hover to pressed blue. The contact form submit.
- **Header:** white on the transparent header, ink once solid, blue on hover.
- **States:** :active scales to 0.97; arrows translate (3px, -3px) on hover; disabled shows progress cursor at 0.75 opacity with an inline spinner.

### Icon Chips
- **Style:** 46px circle (36px small), tint ground, blue 1.8px-stroke line icon. Neighbouring service cards vary the tint slightly.
- **State:** on parent hover/focus the chip fills Danau Blue, icon turns white, chip rotates -8 to -10deg.

### Cards / Containers
- **Service card (home):** a #F4F4F4 frame (8px padding, 24px radius) around a night window (16px radius, 2:1, max 216px tall; 5:2 on phones) lit from below, holding the service's pixel glyph centred at 86% of its height, a glass icon chip top-left and the sparse pixel mosaic top-right (kept to the 30% strip beside the glyph). Below: title (clamp 1.5–1.875rem, weight 340, -0.03em, 22ch), description, "Zistiť viac" row pinned to the foot. Grid 3 / 2 / 1 columns at ≥1101 / 641–1100 / ≤640. The glyph assembles when its window scrolls into view and holds still at rest. Hover or focus: the card floods Danau Blue and lifts 6px with the card-lift shadow, the window brightens from below, the mosaic ripples out in pale blues, the glyph sends one bright wave upward and twinkles, the chip turns white and rotates -10deg, the arrow turns -45deg. Reduced motion keeps colour changes only. Compact variant (190px) for related services is unchanged.
- **Link card:** surface ground, 24px, horizontal title + text + 52px arrow circle; hover to tint and lift 4px.
- **Service detail:** the opening paragraph at statement size, inking word by word from 0.22 to full ink as it scrolls into reading position, beside the block title and its icon chip (4fr / 8fr). What DANAU provides is a full-width night band lit from below with low pixel mountains: the items as large light lines (300, up to 2.25rem) in 2–3 columns over white hairlines, each with a 12px periwinkle pixel that ignites as the line arrives. How the work is done is a path: one blue 14px pixel node per sentence, joined by a 1px blue line that draws down on scroll.
- **Skill tile:** white with hairline border, 24px, the D symbol as its mark (rotates 90deg on hover).
- **Info card:** surface; the main variant is a night card with a corner glow and masked dot field.
- **Partner tile:** white, hairline border, 20px radius, grayscale logo at 0.75 opacity, colour and lift on hover.

### Inputs / Fields
- **Style:** surface-2 fill, 1px hairline, 14px radius, 14px 16px padding, 1rem text; label 0.875rem/520 ink-2 above.
- **Focus:** border to Danau Blue, fill to white, 4px blue ring at 0.12 alpha.
- **Error:** border to err-ink, message in err-ink at 0.875rem. Consent uses a custom 22px box that fills blue when checked.

### Navigation
- **Header:** fixed, 76px (68px mobile). Transparent with white text over the night hero; turns to translucent blurred white with ink text once scrolled. Logo left, nav centered absolutely, CTA right.
- **Links:** 40px pill hit areas, weight 450, hover wash (white 0.1 on night, ink 0.05 on light); the active route is a 4px square dot under the label.
- **Services dropdown:** 540px white panel, 24px radius, a tint "all services" row then a two-column list of chip + label items.
- **Mobile (under 1100px):** a full-screen night menu with the bottom glow, links at clamp(2.25rem, 9vw, 3rem) weight 300, services in two columns below a white hairline, CTA and contact at the foot.

### The Matrix (signature)
One renderer family, one magnitude ramp. Cell pitch 8px (6px narrow, 9px wide screens); cell size and colour step together along a fixed ramp from #4A55FF (small, translucent) to #D4DCFF (large, solid), so size encodes height and light, never random noise.
- **Pixel mountains:** home hero (variant "hero") and every sub-page hero (variant "low", per-page seed for its own skyline), masked to fade upward. Intro ignites bottom-up in a scan sweep, then idles with sparse twinkles and a slow scan band; the pointer is a lens (150px, 90px narrow) that enlarges and brightens nearby cells.
- **Pixel glyph:** the service illustration rasterised into the same matrix in the service hero aside.
- **Pixel sphere:** "Ako pracujeme?". The left half is the crisp grid, the right half is the same field blurred and carrying the white "Riešenie" text; the field flows slowly and lights near the pointer.
- **Footer wordmark:** the full-width "danau" wordmark masked by a square-cell SVG pattern with a white-to-periwinkle vertical gradient, rising 45% into place on scroll.
- **Reduced motion:** the matrix renders its final state with no intro, twinkle or lens.

### Motion
Ease-out cubic-bezier(0.16, 1, 0.3, 1) everywhere; ease-in-out (0.65, 0, 0.35, 1) for ambient drift. Vocabulary: masked word reveals for headings; rise-and-unblur for blocks (y 28px, blur 8px, 0.9s); the scroll-inked statement paragraph (words go from gray to ink as it rises); the sticky active list with a progress bar; SVG stroke draw-ins (process arcs, About underline) with ping rings on the diagram nodes; a slow glow drift (16s); a pausable certification marquee (42s, with a pause control). Under prefers-reduced-motion, transforms fall back to opacity, marquee becomes a wrapped static list, and card hovers drop their movement.

## Do's and Don'ts

### Do:
- **Do** build every new illustration from the shared matrix: square cells, the #4A55FF to #D4DCFF magnitude ramp, ignite-then-idle motion, pointer lens.
- **Do** light every night band from below with the brand-blue radial glow.
- **Do** set headings at weight 280–340 with -0.025em to -0.045em tracking and introduce them with the masked word reveal.
- **Do** use the white pill (button-light) as the one primary action on night, and Danau Blue (button-primary) on light grounds.
- **Do** end every page on a contact path: the CTA band, then the footer claim and button.
- **Do** keep a reduced-motion branch for every new animation that leaves content fully visible.
- **Do** keep white-on-night secondary text at 0.7–0.8 alpha and body copy in gray copy at max 68ch.

### Don't:
- **Don't** introduce a second saturated hue; status green and red are for form feedback only.
- **Don't** fill the matrix with random noise; size and colour follow the ramp.
- **Don't** use bold display weights or positive tracking on headlines.
- **Don't** use hard offset shadows or resting shadows on cards; lift on hover only (the contact form panel is the one resting-shadow exception).
- **Don't** add kickers, eyebrow labels or uppercase tracked captions above headings.
- **Don't** add invented statistics, testimonials, ratings or client logos; partner tiles show real logos or the neutral placeholder.
- **Don't** use a stock photo hero or a free-floating gradient blob; the hero is the matrix rising out of the glow.
