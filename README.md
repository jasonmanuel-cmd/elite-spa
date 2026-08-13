# Elite Auto Spa — Premium Automotive Restyling Website

A fast, accessible, SEO-optimized **static website** for a premium automotive
restyling studio (paint protection film, ceramic coatings, window tint, vinyl
wraps, detailing, paint correction, and restoration) serving Boerne & Greater
San Antonio, TX.

Built with **semantic HTML5, modern CSS3, and vanilla JavaScript** — no
frameworks, no runtime dependencies, no build step required to view it.

---

## Quick start

```bash
pnpm install      # installs `serve` (the only dev dependency)
pnpm dev          # serves the site at http://localhost:3000
```

Any static file server works (`serve`, `python -m http.server`, Nginx, Vercel,
Netlify, GitHub Pages, S3+CloudFront, etc.). Just serve the project root.

---

## Project structure

```
.
├── index.html                 # Homepage (hand-authored)
├── services/                  # 8 generated service pages
│   ├── paint-protection-film.html
│   ├── ceramic-coatings.html
│   ├── window-tint.html
│   ├── vinyl-wraps.html
│   ├── mobile-detailing.html
│   ├── paint-correction.html
│   ├── vehicle-restoration.html
│   └── overspray-removal.html
├── locations/                 # Local-SEO landing pages
│   ├── boerne-tx.html
│   └── san-antonio-tx.html
├── gallery.html               # Filterable project gallery
├── about.html                 # Studio story + values
├── faq.html                   # FAQ with FAQPage schema
├── contact.html               # Contact + map + quote form
├── privacy-policy.html        # Legal
├── sms-terms.html             # A2P 10DLC / SMS consent terms
│
├── assets/
│   ├── css/styles.css         # Full design system
│   ├── js/
│   │   ├── main.js            # Nav, header, scroll reveal, modal control
│   │   ├── quote-form.js      # Multi-step quote form + validation
│   │   └── lazy-media.js      # IntersectionObserver lazy media
│   ├── images/                # Generated premium imagery
│   └── icons/favicon.svg
│
├── build/                     # Static site generator (Node, zero deps)
│   ├── partials.mjs           # Shared head/header/footer/modal + JSON-LD
│   ├── pages.mjs              # Service page content + data
│   ├── other-pages.mjs        # Location/gallery/about/faq/contact/legal
│   └── build.mjs              # Runner — writes .html files + sitemap.xml
│
├── sitemap.xml                # Generated
├── robots.txt
├── site.webmanifest
└── package.json
```

## Regenerating pages

Every page except `index.html` is generated from the modules in `build/`.
Edit the content data there, then rebuild:

```bash
pnpm build        # node build/build.mjs
```

This rewrites the `services/`, `locations/`, and top-level content pages plus
`sitemap.xml`. The shared header, footer, and quote modal live in
`build/partials.mjs` — change them once and rebuild to update every page.

> If you edit the header/footer, mirror the change in `index.html` (which is
> hand-authored) or migrate `index.html` into the generator.

---

## Features

- **SEO**: unique title/description per page, canonical URLs, Open Graph +
  Twitter cards, `sitemap.xml`, `robots.txt`, and rich **JSON-LD** structured
  data (`AutoRepair`/`LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage`).
- **Accessibility**: semantic landmarks, skip link, ARIA on nav/modal/forms,
  keyboard-operable multi-step quote modal with focus management, visible focus
  states, and `prefers-reduced-motion` support.
- **Performance**: no framework payload, deferred JS, lazy-loaded imagery,
  preloaded hero image, system-font fallback while web fonts load.
- **Multi-step quote form**: client-side validation, honeypot spam trap, and
  SMS consent checkbox. See the wiring note below.

---

## Wiring up the quote form

The quote form (`assets/js/quote-form.js`) posts to `/api/quote` by default and
currently **simulates** a successful submission on the client so the UX is
fully demonstrable without a backend.

To make it live, do one of the following:

1. **Serverless endpoint** — deploy a handler at `/api/quote` (e.g. a Vercel
   Function) that accepts the `multipart/form-data` payload, then remove the
   simulated-success branch in `quote-form.js` (look for `SIMULATE_SUBMIT`).
2. **Form service** — point the form's `action` at a provider such as Formspree,
   Basin, or Web3Forms and let them handle delivery + spam filtering.

The form fields map to: `service`, `vehicle_year`, `vehicle_make`,
`vehicle_model`, `vehicle_type`, `project_details`, `name`, `phone`, `email`,
`preferred_contact`, `preferred_timeframe`, `photos[]`, and `sms_consent`.

File uploads require a backend/form-service that accepts multipart uploads.

---

## Business details

All business info (name, phone, address, hours, social links) is centralized in
the `SITE` object at the top of `build/partials.mjs`. Update it there and
rebuild. The phone number, address, and legal entity in `index.html` should be
kept in sync manually.

- **Elite Mobile Detail LLC, DBA Elite Auto Spa**
- 108 Scheele Rd, Unit 3, Boerne, TX 78015
- (830) 431-2088 · contact@eliteautospasa.com

---

## Notes

- Imagery in `assets/images/` is AI-generated placeholder photography intended
  to convey the premium showroom aesthetic. Replace with real project photos
  before launch.
- Update the canonical `origin` in `build/partials.mjs` and the URLs in
  `robots.txt` / `sitemap.xml` if the production domain differs.
