/** Build a self-contained, offline review file. Never deploys or sends leads. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cinematicSection, tintStudio } from "./experience.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] || join(root, "review", "elite-auto-spa-experience.html");
const css = ["styles", "experience"].map((name) => readFileSync(join(root, `assets/css/${name}.css`), "utf8")).join("\n");
const js = readFileSync(join(root, "assets/js/experience.js"), "utf8");
let html = `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex,nofollow" /><title>Elite Auto Spa | Private design review</title><style>${css}
body{margin:0}.review-bar{padding:1.1rem 5vw;display:flex;align-items:center;justify-content:space-between;gap:1rem;background:#0a0b0d;border-bottom:1px solid #293443;color:#d4dce8;font:12px system-ui,sans-serif}.review-brand{display:flex;align-items:center;gap:.8rem;font-weight:700;font-size:14px}.review-brand img{width:36px;height:36px;border-radius:50%}.review-bar p{margin:0;color:#9baabd;font-size:11px}.review-footer{padding:3rem 5vw;background:#080b10;color:#c2cfdf;font:13px/1.7 system-ui,sans-serif;max-width:none}.review-footer strong{color:#f4f6fa}.review-bar span{color:#8fc4ff;font-size:10px;letter-spacing:.1em;text-transform:uppercase}@media(max-width:600px){.review-bar{align-items:flex-start}.review-bar p{display:none}.review-bar span{max-width:110px;text-align:right;font-size:9px}}
</style></head><body><a class="skip-link" href="#main">Skip to content</a><header class="review-bar"><div class="review-brand"><img src="/assets/images/elite-logo.jpg" alt="" /><div>Elite Auto Spa<p>Boerne · San Antonio</p></div></div><span>Private design review · Not published</span></header><main id="main">${cinematicSection()}${tintStudio()}</main><footer class="review-footer"><strong>Review the experience. Keep the launch separate.</strong><br />This offline preview shows the new sections only. The source package integrates them with the existing website. No form submissions, analytics, payments, or quote prices are included here. Original vehicle illustrations and existing cinematic concept images are used for review; exact model media, approved client photos, and film information still need confirmation before launch.</footer><script>${js}</script></body></html>`;
for (const path of ["/assets/video/hero-poster.webp", "/assets/images/projects/window-tint.webp", "/assets/images/elite-logo.jpg"]) {
  const type = path.endsWith(".jpg") ? "image/jpeg" : "image/webp";
  const data = `data:${type};base64,${readFileSync(join(root, path)).toString("base64")}`;
  html = html.replaceAll(path, data);
}
// Keep the review entirely offline. The integrated site retains its real link.
html = html.replace('href="/services/window-tint.html"', 'href="#tint-studio-disclaimer"').replace("Explore window tint <span", "Read preview limitations <span");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`Offline review saved: ${out}`);
