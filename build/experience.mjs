/**
 * Reusable, dependency-free automotive experience.
 * These sections use existing project media, with an original SVG glass mask.
 * They do not price services, collect data, or submit quote requests.
 */
import { vehicleScene, vehicleIcon } from "./vehicle-art.mjs";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

// Paths trace only the side glass of the existing 1024 × 1024 concept image.
// The mask is a visual effect, not an optical or product-performance model.
const glassMask = `
  <path d="M249 433 Q280 421 315 416 L299 449 L270 451 Z" />
  <path d="M321 414 Q380 406 454 407 L460 468 L302 462 Z" />
  <path d="M482 408 Q557 411 628 437 L634 454 L620 456 L624 476 L495 470 Z" />`;

function tintVisual(id, { cinematic = false } = {}) {
  return `<svg class="tint-visual${cinematic ? " tint-visual--cinematic" : ""}" viewBox="0 245 1024 576" preserveAspectRatio="${cinematic ? "xMidYMid slice" : "xMidYMid meet"}" role="img" aria-labelledby="${id}-image-title ${id}-image-desc">
    <title id="${id}-image-title">Illustrative window tint on a concept vehicle</title>
    <desc id="${id}-image-desc">An existing generated showroom image with a dark overlay on the side windows. This is not a photograph of a completed client project or an accurate film sample.</desc>
    <image href="/assets/images/projects/window-tint.webp" x="0" y="0" width="1024" height="1024" />
    <g class="tint-visual__glass" fill="#02060c">${glassMask}</g>
  </svg>`;
}

export function cinematicSection({ id = "finish-experience" } = {}) {
  id = escapeHtml(id);
  return `
    <section class="experience-film" id="${id}" data-experience-film aria-labelledby="${id}-title">
      <div class="experience-film__stage">
        <div class="experience-film__visual" aria-hidden="true">
          <img class="experience-film__first" src="/assets/video/hero-poster.webp" alt="" width="1280" height="720" loading="lazy" decoding="async" />
          <div class="experience-film__second">${tintVisual(`${id}-scene`, { cinematic: true })}</div>
          <div class="experience-film__shade"></div>
          <div class="experience-film__beam"></div>
        </div>
        <div class="container experience-film__content">
          <div class="experience-film__topline">
            <span class="experience-kicker">The finishing touch</span>
            <span class="experience-film__index" aria-hidden="true"><span data-film-index>01</span> / 03</span>
          </div>
          <h2 id="${id}-title">Your vehicle.<br /><span>A new perspective.</span></h2>
          <p class="experience-film__intro">Protection, finish, and a look that feels like you.</p>
          <div class="experience-film__bottom">
            <div>
              <div class="experience-film__chapters" aria-label="Experience chapters">
                <span data-film-chapter="0" class="is-active">01 <strong>The finish</strong></span>
                <span data-film-chapter="1">02 <strong>The detail</strong></span>
                <span data-film-chapter="2">03 <strong>Your shade</strong></span>
              </div>
              <p class="experience-film__caption">Concept imagery. Explore the look, then discuss the real options.</p>
            </div>
            <a class="experience-text-link" href="#tint-studio">Open the vehicle studio <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="experience-film__progress" aria-hidden="true"><span></span></div>
      </div>
    </section>`;
}

export function tintStudio({ id = "tint-studio", eyebrow = "Interactive vehicle studio", heading = "Your car. Your look.", ctaHref = "/services/window-tint.html", ctaLabel = "Explore window tint" } = {}) {
  id = escapeHtml(id);
  const vehicles = [{ key: "sedan", label: "Sedan", detail: "Four-door profile" }, { key: "coupe", label: "Coupe", detail: "Low sport profile" }, { key: "suv", label: "SUV", detail: "Tall utility profile" }, { key: "pickup", label: "Pickup", detail: "Crew-cab profile" }];
  const colors = [{ key: "original", name: "Original graphite", color: "#7892ac" }, { key: "pearl", name: "Pearl white", color: "#d9dddf" }, { key: "black", name: "Jet black", color: "#24303b" }, { key: "blue", name: "Electric blue", color: "#2867b4" }, { key: "violet", name: "Deep violet", color: "#69508f" }, { key: "copper", name: "Copper", color: "#b97c50" }];
  return `
    <section class="tint-studio section" id="${id}" data-tint-studio data-coverage="none" aria-labelledby="${id}-title">
      <div class="container">
        <div class="tint-studio__heading">
          <div><span class="experience-kicker">${escapeHtml(eyebrow)}</span><h2 id="${id}-title">${escapeHtml(heading)}</h2></div>
          <p>Choose your vehicle shape. Then explore tint,<br />wrap colors, finishes, and protection zones.</p>
        </div>
        <fieldset class="vehicle-picker" data-vehicle-controls disabled aria-describedby="${id}-vehicle-note">
          <legend><span>01</span> Choose your vehicle</legend>
          <div class="vehicle-picker__grid">
            ${vehicles.map((vehicle) => `<label class="vehicle-picker__choice"><input type="radio" name="${id}-vehicle" value="${vehicle.key}" data-vehicle-option /><span class="vehicle-picker__card">${vehicleIcon(vehicle.key)}<span><strong>${vehicle.label}</strong><small>${vehicle.detail}</small></span><span class="vehicle-picker__check" aria-hidden="true">↗</span></span></label>`).join("\n            ")}
          </div>
        </fieldset>
        <p class="vehicle-picker__note" id="${id}-vehicle-note">Use the closest body style. These are original concept illustrations, not exact makes or models. Your selections stay with you when you switch vehicles.</p>
        <div class="tint-studio__layout vehicle-studio__layout">
          <div class="tint-studio__preview vehicle-studio__preview">
            <div class="tint-studio__preview-top"><span><span class="experience-dot" aria-hidden="true"></span><span data-vehicle-label>Concept vehicle</span></span><span>Illustration only</span></div>
            <div class="vehicle-studio__canvas" data-vehicle-canvas>
              ${vehicles.map((vehicle) => vehicleScene(id, vehicle.key).replace("<svg ", vehicle.key === "sedan" ? "<svg " : "<svg hidden ")).join("\n")}
              <div class="vehicle-studio__empty" data-vehicle-empty hidden><span class="experience-kicker">Made around your vehicle</span><strong>Start with a shape.<br />See the possibilities.</strong><p>Choose a vehicle above to unlock your studio.</p><span aria-hidden="true">↑</span></div>
            </div>
            <div class="tint-studio__preview-bottom"><span data-tint-image-label>Original concept illustration</span><span data-paint-label>Graphite</span></div>
            <div class="vehicle-studio__compare"><button type="button" data-tint-compare aria-pressed="false" disabled>Compare original</button><button type="button" data-tint-reset disabled>Reset this design</button></div>
          </div>
          <div class="tint-studio__panel vehicle-studio__panel">
            <fieldset class="vehicle-studio__customize" data-customize-controls disabled aria-describedby="${id}-disclaimer">
              <legend><span>02</span> Customize your look</legend>
              <div class="vehicle-studio__tabs" role="tablist" aria-label="Customization options">
                ${[["tint", "Tint"], ["wrap", "Wrap"], ["ppf", "PPF"]].map(([key, name], i) => `<button type="button" role="tab" id="${id}-tab-${key}" aria-controls="${id}-panel-${key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-studio-tab="${key}">${name}</button>`).join("")}
              </div>
              <div id="${id}-panel-tint" role="tabpanel" aria-labelledby="${id}-tab-tint" data-studio-panel="tint">
                <div class="tint-studio__readout"><span class="tint-studio__number" data-tint-number>35<span>%</span></span><div>Visible light<br />transmission <abbr title="Visible light transmission">VLT</abbr></div></div>
                <p class="tint-studio__description" data-tint-description>A middle shade in this visual comparison.</p>
                <fieldset class="tint-studio__controls" data-tint-controls>
                  <legend>Choose an illustrative shade</legend>
                  <div class="tint-studio__shades">
                    ${[70, 50, 35, 20, 5].map((vlt) => `<label class="tint-studio__shade"><input type="radio" name="${id}-shade" value="${vlt}" data-shade-option${vlt === 35 ? " checked" : ""} /><span>${vlt}%</span></label>`).join("\n                    ")}
                  </div>
                  <label class="sr-only" for="${id}-range">Adjust illustrative tint shade</label>
                  <input id="${id}-range" class="tint-studio__range" data-tint-range type="range" min="0" max="4" step="1" value="2" aria-valuetext="35 percent VLT, illustrative shade" />
                  <div class="tint-studio__range-labels"><span>Lighter appearance</span><span>Darker appearance</span></div>
                </fieldset>
                <div class="tint-studio__explanation"><strong>Appearance, not a performance rating.</strong><p>Lower VLT means less visible light transmission. This illustration does not predict the installed result, heat rejection, or legal compliance.</p></div>
              </div>
              <div id="${id}-panel-wrap" role="tabpanel" aria-labelledby="${id}-tab-wrap" data-studio-panel="wrap" hidden>
                <h3 class="vehicle-studio__option-title">A fresh point of view.</h3><p class="vehicle-studio__option-copy">Explore a color, then compare gloss and satin.</p>
                <fieldset class="vehicle-studio__colors"><legend>Illustrative wrap color</legend><div class="vehicle-studio__color-grid">
                  ${colors.map((color) => `<label class="vehicle-studio__color"><input type="radio" name="${id}-color" value="${color.key}" data-wrap-option data-paint="${color.color}" data-color-name="${color.name}"${color.key === "original" ? " checked" : ""} /><span class="vehicle-studio__swatch" style="--swatch:${color.color}" aria-hidden="true"></span><span>${color.name}</span></label>`).join("")}
                </div></fieldset>
                <fieldset class="vehicle-studio__finish" data-finish-controls disabled><legend>Illustrative finish</legend><div class="vehicle-studio__segments">${["gloss", "satin"].map((finish) => `<label><input type="radio" name="${id}-finish" value="${finish}" data-finish-option${finish === "gloss" ? " checked" : ""} /><span>${finish === "gloss" ? "Gloss" : "Satin"}</span></label>`).join("")}</div></fieldset>
                <p class="vehicle-studio__small" data-finish-note>Choose a wrap color to compare finishes. Colors are concepts, not a stocked-film catalog.</p>
              </div>
              <div id="${id}-panel-ppf" role="tabpanel" aria-labelledby="${id}-tab-ppf" data-studio-panel="ppf" hidden>
                <h3 class="vehicle-studio__option-title">See the coverage idea.</h3><p class="vehicle-studio__option-copy">Highlight example paint-protection areas.</p>
                <fieldset class="vehicle-studio__coverage"><legend>Illustrative PPF guide</legend>${[["none", "No guide", "View your design without an overlay."], ["front", "Front-body guide", "Example hood, front fender, and bumper zones."], ["full", "Full-body guide", "Example painted-body coverage."]].map(([key, name, copy]) => `<label><input type="radio" name="${id}-coverage" value="${key}" data-coverage-option${key === "none" ? " checked" : ""} /><span><strong>${name}</strong><small>${copy}</small></span></label>`).join("")}</fieldset>
                <p class="vehicle-studio__small">The blue highlight is a guide, not the appearance of installed film or a confirmed package. Actual coverage and edges are agreed during consultation.</p>
              </div>
            </fieldset>
            <p class="sr-only" data-tint-status aria-live="polite" aria-atomic="true">Choose a vehicle to start.</p>
            <noscript><p class="tint-studio__notice">Enable JavaScript to choose a vehicle and customize it. The illustration shown is a static concept, not a product sample.</p></noscript>
          </div>
        </div>
        <div class="vehicle-studio__summary" data-design-summary hidden>
          <div class="vehicle-studio__summary-title"><span class="experience-kicker">03 · Your starting point</span><strong>Bring the idea. Confirm the details.</strong></div>
          <dl><div><dt>Vehicle</dt><dd data-summary-vehicle>—</dd></div><div><dt>Tint</dt><dd data-summary-tint>35% illustration</dd></div><div><dt>Wrap</dt><dd data-summary-wrap>No wrap preview</dd></div><div><dt>PPF</dt><dd data-summary-coverage>No coverage guide</dd></div></dl>
          <div class="vehicle-studio__summary-actions"><button class="btn btn--ghost" type="button" data-copy-design>Copy selections</button><a class="btn btn--primary tint-studio__cta" href="${escapeHtml(ctaHref)}">${escapeHtml(ctaLabel)} <span aria-hidden="true">↗</span></a></div>
          <p class="vehicle-studio__copy-status" data-copy-status aria-live="polite"></p>
        </div>
        <p class="tint-studio__disclaimer" id="${id}-disclaimer"><strong>A starting point, not a product sample.</strong> Vehicle shapes, colors, finishes, tint, and PPF zones are original illustrations. They do not establish vehicle fitment, installed VLT, visibility, heat rejection, film availability, or pricing. Actual results depend on the vehicle, glass, film, lighting, and display. Tint selections are not legal recommendations. Confirm current rules for each window, physical samples, service availability, and exact coverage before choosing. Selections stay in this page unless you choose to copy them. They are not sent to the shop.</p>
      </div>
    </section>`;
}
