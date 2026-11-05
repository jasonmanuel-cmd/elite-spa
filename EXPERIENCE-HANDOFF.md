# Elite Auto Spa: cinematic experience

## Status

Built locally from `jasonmanuel-cmd/elite-spa`, base commit
`57c4e279c35022cd03d10efd3d33b4924cd864e1`.

This is an expanded review build, not a launch. Nothing has been pushed,
published, or deployed. The current website and the user's desktop files were
not changed. A push to GitHub `main` is held for confirmation because Vercel's
production site is Git-linked to that branch. The current production deployment
is sourced from `main` at the base commit above and recent main deployments all
went to production.

Deployment evidence:
https://vercel.com/jasons-projects-1d845fc4/elite-spa/8jc4BbQdAq8o9oXT1BhhatVWaDjq

Original inspiration: https://blackline-tint-wrap-demo.vercel.app/
Creator's build guide: https://lynamupmedia.com/build
No original source-code license or permission to reuse proprietary demo media was
established. This implementation uses original code and illustrations instead.

## What changed

- Added an original scroll-driven, two-scene cinematic section after the existing
  homepage hero. Scrolling remains native; there is no scroll hijacking.
- Added a reusable car-first studio to the homepage and window-tint service page.
- Visitors first choose a sedan, coupe, SUV, or pickup concept. The displayed
  silhouette changes to match the selected body style. These are original generic
  illustrations, not exact manufacturer models or fitment data.
- Added six illustrative color choices including the original finish, gloss/satin
  comparison, and optional front/full-body PPF guides. These are not an inventory
  catalog, actual film samples, or confirmed service packages.
- Added a selection summary with explicit copy action. Nothing is automatically
  submitted or saved between visits. Exact model, legal tint, availability,
  coverage, and price still need confirmation with the shop.
- Five illustrative VLT labels: 70%, 50%, 35%, 20%, and 5%. Native radios and a
  range input stay synchronized. Compare the original concept, change shade, switch vehicles while retaining
  choices, or reset the design while retaining the selected vehicle.
- Preserved existing branding, services, business details, original sections,
  navigation, quote modal, quote endpoint, and contact workflows.
- Added no pricing, heat-rejection figures, warranties, business claims, reviews,
  lead collection, payments, analytics, or storage behavior.
- Mobile, short landscape screens, and reduced-motion preferences receive an
  unpinned static cinematic scene. The tint controls still work. Without
  JavaScript, the labeled static image remains and the controls are disabled.

## Review without installation

Open `elite-auto-spa-experience.html` from the delivery package in a modern
browser. It is a self-contained, offline preview of the **new sections only**.
It has no live forms or external requests, and does not change the website.

The preview deliberately uses system fonts offline. The integrated site retains
its existing Sora/Inter font setup and original header, hero, footer, and pages.

## Run the integrated website locally

From the included `source/` directory:

```sh
python3 -m http.server 3000 --bind 127.0.0.1
```

Open `http://127.0.0.1:3000/` and
`http://127.0.0.1:3000/services/window-tint.html`.

To regenerate pages and run the automated checks:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm preview:offline
```

For the browser suite on a regular development computer:

```sh
pnpm exec playwright install chromium
pnpm test:browser
```

The static build uses no runtime dependencies. `jsdom`, Playwright and axe-core
are development-only test dependencies. The original generator continues to refresh sitemap dates on build.

## Reuse and maintenance

- `build/experience.mjs`: reusable section templates. `tintStudio()` accepts a
  unique ID, eyebrow, heading, CTA URL, and CTA label. Use a distinct ID per
  instance. The window-tint page points to the existing contact page, rather than
  linking back to itself.
- `build/vehicle-art.mjs`: four original vehicle drawings and matching picker icons.
- `assets/css/experience.css`: scoped layout and motion styles. The visual accent
  inherits the host site's `--accent` token.
- `assets/js/experience.js`: isolated interaction and scroll enhancement.
- `build/preview.mjs`: generates the offline review artifact.
- `tests/experience.test.mjs`: automated DOM and interaction checks.
- The homepage insertion is regenerated between `EXPERIENCE:START` and
  `EXPERIENCE:END`. Edit the template rather than that generated region.

The cinematic photo's glass mask is specifically aligned to that square image.
Replacing that photo requires re-tracing its glass; do not reuse that mask on an
unrelated vehicle. The interactive car studio uses separate original SVG drawings
with matching body, glass, reflection and PPF shapes for each body style. For another client, confirm their branding, services, approved
media, and contact destinations before adapting these components.

## Media and tint limitations

No code, photography, imagery, pricing, or business claims were copied from the
Blackline reference. It informed the general cinematic and interactive direction.

The cinematic section reuses `hero-poster.webp` and `projects/window-tint.webp`
already in the Elite repository. The existing README identifies that photography
as generated placeholder imagery. Its side-glass overlay is original code.

The interactive studio uses four original code-drawn SVG scenes, not copied car
photos. Paint, sheen, glass darkness and coverage highlights are illustrative.
They are **not a calibrated optical model, a manufacturer-model library, an
available-film catalog, or a legal recommendation**. The interface states these
limits beside the controls. Confirm film specifications, physical samples, the
actual vehicle, coverage and current rules for each window before launch.

## Verification completed

- Static build: passed (17 generated pages plus homepage synchronization).
- Automated DOM/interaction tests: 14 passed, 0 failed.
- Source review also exercised 720 combinations of vehicle/tint/color/finish/PPF,
  including compare/restore, vehicle switching and reset behavior.
- JavaScript/module syntax, generated SVG references and whitespace checks: passed.
- Real Chromium rendering: desktop, 320px, 390px, 768px, 812×375 landscape,
  1440px and 2560px layouts; no horizontal overflow or script exceptions.
- Native keyboard vehicle selection, range adjustment and tab navigation: passed.
- Forward/reverse cinematic scroll, tint/wrap/PPF interaction, compare/reset,
  no-JavaScript fallback, reduced-motion and forced-colors smoke checks: passed.
- axe-core reported no violations in the vehicle studio across all three panels.
- Existing mobile navigation, quote modal open/Escape dismissal, and Back
  navigation smoke checks: passed. No lead was submitted.
- Clipboard success, failure and a design change while copy is pending are tested.
  Its live announcement remains available to assistive technology.
- Existing quote endpoint and quote/navigation scripts are unchanged.

Browser tests used an isolated Chromium 133 runtime with local-only requests;
external fonts were blocked for deterministic QA. Browser rendering is now
verified, unlike the earlier review build. This is not a guarantee of universal
accessibility or cross-browser compatibility.

## Verification still required before launch

- Safari/iOS and Firefox, a physical phone, screen-reader review, 200% browser
  zoom, final production fonts, and performance on the target connection/device.
- Confirm the exact car models and obtain approved model media if photorealistic,
  manufacturer-specific selection is required. Current choices are body types.
- Confirm actual films, available wrap colors/finishes, legal tint choices, and
  PPF packages. The current studio intentionally has no prices or availability.
- Verify approved business copy/media and email delivery without sending real
  leads unless explicitly authorized.
- Confirm the `main` push may update the existing Vercel production URL now.

## Existing launch blockers to resolve separately

The original website already includes placeholder testimonials and imagery,
verification flags for insurance/experience/vehicle-count claims, and policy/legal
copy awaiting confirmation. These were preserved, not validated or replaced.

The original quote endpoint requires configured email-delivery settings and has
a documented 503 fallback when they are missing. No secrets were inspected and
no lead was sent. Before launch, verify the intended delivery setup, business
details, approved photos and testimonials, claims, current tint rules, and policies.
Deployment requires a separate go-ahead.
