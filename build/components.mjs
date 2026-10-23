/* ==========================================================================
   Elite Auto Spa — component showcase (noindex preview page)
   Demonstrates the before/after slider, stat counters, and testimonial
   marquee. Not in the sitemap. The slider uses the same photo twice (the
   "before" is dulled with a CSS filter) and the quotes are SAMPLES — replace
   both with real project photos and real customer reviews before using them
   on a public page.
   ========================================================================== */
import { breadcrumb, breadcrumbLd } from "./partials.mjs";

/* Before/after slider. `before` and `after` are image URLs. */
export function compare({ before, after, alt, beforeClass = "" }) {
  return `
        <div class="compare" data-compare>
          <img class="compare__img compare__img--after" src="${after}" alt="${alt} — after" width="1024" height="1024" loading="lazy" decoding="async" />
          <img class="compare__img compare__img--before ${beforeClass}" src="${before}" alt="${alt} — before" width="1024" height="1024" loading="lazy" decoding="async" />
          <span class="compare__tag compare__tag--before" aria-hidden="true">Before</span>
          <span class="compare__tag compare__tag--after" aria-hidden="true">After</span>
          <span class="compare__handle" aria-hidden="true"></span>
          <input class="compare__range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after" />
        </div>`;
}

/* Stat tile. The final value is in the markup so it reads correctly without JS. */
export function stat({ value, suffix = "", label }) {
  return `
          <div class="stat reveal">
            <span class="stat__num" data-count-to="${value}" data-suffix="${suffix}">${value.toLocaleString("en-US")}${suffix}</span>
            <span class="stat__label">${label}</span>
          </div>`;
}

/* Testimonial marquee. Cards are rendered twice; the copy is aria-hidden. */
export function marquee(quotes) {
  const card = (q, hidden) => `
          <figure class="quote-card"${hidden ? ' aria-hidden="true"' : ""}>
            <div class="quote-card__stars" aria-hidden="true">★★★★★</div>
            <blockquote>${q.text}</blockquote>
            <figcaption><strong>${q.name}</strong>${q.detail}</figcaption>
          </figure>`;
  return `
        <div class="marquee" role="region" aria-label="Customer reviews" tabindex="0">
          <div class="marquee__track">${quotes.map((q) => card(q, false)).join("")}${quotes
    .map((q) => card(q, true))
    .join("")}
          </div>
        </div>`;
}

const SAMPLE_QUOTES = [
  { text: "Sample review text — replace with a real customer quote about their paint protection film install.", name: "Sample Customer", detail: "Paint Protection Film" },
  { text: "Sample review text — replace with a real customer quote about a ceramic coating or detail.", name: "Sample Customer", detail: "Ceramic Coating" },
  { text: "Sample review text — replace with a real customer quote about window tint.", name: "Sample Customer", detail: "Window Tint" },
  { text: "Sample review text — replace with a real customer quote about a vinyl wrap.", name: "Sample Customer", detail: "Vinyl Wrap" },
  { text: "Sample review text — replace with a real customer quote about mobile detailing.", name: "Sample Customer", detail: "Mobile Detailing" }
];

const trail = [
  { label: "Home", href: "/" },
  { label: "Component preview", href: "/components-preview.html" }
];

const main = `
${breadcrumb(trail)}
  <main id="main">
    <section class="section section--top" aria-labelledby="cmp-title">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Preview</span>
          <h1 id="cmp-title">Component preview</h1>
          <p class="lead">Internal page — not linked or indexed. Photos and reviews below are samples.</p>
        </div>
${compare({
  before: "/assets/images/projects/paint-correction.webp",
  after: "/assets/images/projects/paint-correction.webp",
  alt: "Sample paint correction result",
  beforeClass: "compare__img--dull"
})}
        <p class="compare-note">Sample: the same photo is used twice, with the “before” dulled by a CSS filter. Swap in real before/after photos.</p>
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="stats-title">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">By the Numbers</span>
          <h2 id="stats-title">Counters</h2>
        </div>
        <div class="stat-grid">${stat({ value: 6421, suffix: "+", label: "Vehicles serviced (business-provided claim)" })}${stat({ value: 8, label: "Services offered" })}${stat({ value: 2, label: "Locations served" })}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="quotes-title">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Reviews</span>
          <h2 id="quotes-title">Testimonial marquee</h2>
          <p class="lead">Sample text only. Hover or focus to pause.</p>
        </div>
      </div>
${marquee(SAMPLE_QUOTES)}
    </section>
  </main>
`;

export const componentsPageObj = {
  out: "components-preview.html",
  title: "Component preview | Elite Auto Spa",
  description: "Internal preview of site components.",
  canonical: "/components-preview.html",
  robots: "noindex, nofollow",
  noindex: true,
  extraScripts: ["/assets/js/components.js"],
  jsonld: [breadcrumbLd(trail)],
  main
};
