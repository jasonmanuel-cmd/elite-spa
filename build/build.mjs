/* ==========================================================================
   Elite Auto Spa — static site build runner
   --------------------------------------------------------------------------
   Zero-dependency Node generator. Composes the shared <head>, header, footer,
   and quote modal partials with each page's <main> content and writes real
   static .html files to disk. Also emits sitemap.xml.

   index.html is hand-authored and NOT overwritten here.

   Run:  node build/build.mjs
   ========================================================================== */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { SITE, head, header, footer } from "./partials.mjs";
import { servicePages } from "./pages.mjs";
import {
  locationPages,
  galleryPageObj,
  aboutPageObj,
  faqPageObj,
  contactPageObj,
  privacyPageObj,
  smsPageObj
} from "./other-pages.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/* Assemble every generated page into one list. */
const pages = [
  ...servicePages,
  ...locationPages,
  galleryPageObj,
  aboutPageObj,
  faqPageObj,
  contactPageObj,
  privacyPageObj,
  smsPageObj
];

/* Compose a full HTML document from a page definition. */
function render(page) {
  return (
    head({
      title: page.title,
      description: page.description,
      canonical: page.canonical,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      ogImage: page.ogImage,
      preloadImage: page.preloadImage,
      jsonld: page.jsonld || []
    }) +
    header +
    page.main +
    footer
  );
}

/* Write each page to disk, creating nested directories as needed. */
let count = 0;
for (const page of pages) {
  const outPath = join(ROOT, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, render(page), "utf8");
  count++;
  console.log("  ✓ " + page.out);
}

/* ------------------------------------------------------------------ */
/* index.html: keep the hand-authored <main> + <head>, but regenerate  */
/* the shared header and footer so they can never drift from partials. */
/* ------------------------------------------------------------------ */
const indexPath = join(ROOT, "index.html");
const indexHtml = readFileSync(indexPath, "utf8");
const bodyStart = indexHtml.indexOf("<body>");
const mainStart = indexHtml.indexOf('  <main id="main">');
const mainEnd = indexHtml.indexOf("</main>") + "</main>".length;
if (bodyStart < 0 || mainStart < 0 || mainEnd < "</main>".length) {
  throw new Error("index.html: could not locate <body>/<main> boundaries");
}
writeFileSync(
  indexPath,
  indexHtml.slice(0, bodyStart) +
    header +
    "\n" +
    indexHtml.slice(mainStart, mainEnd) +
    "\n\n" +
    footer,
  "utf8"
);
console.log("  ✓ index.html (header/footer synced)");

/* ------------------------------------------------------------------ */
/* sitemap.xml                                                         */
/* ------------------------------------------------------------------ */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: "/", priority: "1.0", freq: "weekly" },
  ...pages.map((p) => ({
    loc: p.canonical,
    priority: p.out.startsWith("services/") ? "0.9" : "0.7",
    freq: "monthly"
  }))
];

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${SITE.origin}${u.loc}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${u.freq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`
    )
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync(join(ROOT, "sitemap.xml"), sitemap, "utf8");
console.log("  ✓ sitemap.xml");

console.log(`\nBuilt ${count} pages + sitemap.xml`);
