# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript (confirmed by the user). Same routes as the live danau.sk so the build is a drop-in replacement; the contact form keeps posting JSON to the existing `/api/contact.php` endpoint on the host.

## Users

Decision makers and project owners in two equally weighted groups (confirmed): the public sector (orgány verejnej moci, štátne a verejné inštitúcie, samosprávy) and regulated or commercial organizations. They arrive needing an external expert partner for a concrete job: preparing or rescuing an IT project, getting ready for a cybersecurity audit, covering GDPR / DPO duties, analysis, data governance, or delivering an IT solution.

## Product Purpose

danau.sk is the company website of DANAU, s.r.o., Bratislava. It explains the six service areas, who the company works for and how, and turns a visit into a consultation request ("Konzultovať potrebu", contact form, e-mail, phone).

## Positioning

DANAU joins areas that are usually bought separately — project management, cybersecurity, GDPR, analytics, data governance and IT delivery — into one manageable approach, and takes on a concrete role (PM, MKB, DPO, PMO) rather than only producing documents.

## Capabilities and Constraints

- Routes: `/`, `/sluzby/projektove-riadenie`, `/sluzby/kyberneticka-bezpecnost`, `/sluzby/gdpr-a-dpo`, `/sluzby/analyza-a-data`, `/sluzby/data-governance`, `/sluzby/realizacia-it`, `/o-nas`, `/kontakt`, `/ochrana-osobnych-udajov`, `/cookies`, plus a 404.
- Contact form fields: fullName*, organization, email*, phone, message*, consent*; POST JSON to `/api/contact.php`, which answers `{ ok, message?, error? }`.
- Language: Slovak only. Copy must be kept verbatim from the live site (user requirement: keep content and sections).

## Brand Commitments

- Name and wordmark "Danau" / "DANAU, s.r.o."; the four-quadrant "D" symbol and wordmark SVGs from the live site.
- Keep the live site's colors (user requirement): brand blue `#1818EC`, ink `#111827`, black, white, light gray surfaces.
- User-pinned visual references: the AutoBiz.ai layout reference (dark hero with glow from below, airy light type, light cards with soft icon chips, black list section, dark footer with a huge wordmark) and a dot-matrix "pixel mountains" hero illustration.

## Evidence on Hand

Real copy for every page (scraped from danau.sk), service icons, hero illustrations, logo assets, certifications list (IPMA, PRINCE2, Lead Auditor ISO/IEC 27001, ITIL, TOGAF, MKB, DPO, audit KB). No testimonials, client logos, ratings or statistics exist; none may be invented.

## Product Principles

1. Clarity before decoration: a visitor must see what DANAU does and how to start a consultation within one viewport.
2. Credibility for public-sector buyers: calm, precise, no hype or invented proof.
3. Every page ends in one concrete next step to contact.

## Accessibility & Inclusion

Public-sector audience: aim for WCAG 2.1 AA (contrast, keyboard navigation, reduced motion).
