import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { JSDOM } from "jsdom";
import { cinematicSection, tintStudio } from "../build/experience.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const script = readFileSync(join(root, "assets/js/experience.js"), "utf8");
const css = readFileSync(join(root, "assets/css/experience.css"), "utf8");

function createPage({ html = cinematicSection() + tintStudio(), reduced = false, mobile = false, short = false, choose = true } = {}) {
  const dom = new JSDOM(`<!doctype html><html lang="en"><head><style>${css}</style></head><body>${html}</body></html>`, { runScripts: "outside-only", url: "https://preview.invalid/" });
  const { window } = dom;
  const queries = new Map();
  const frames = [];
  window.matchMedia = (query) => {
    if (!queries.has(query)) {
      const listeners = [];
      const media = { matches: query.includes("reduced-motion") ? reduced : query.includes("max-height") ? short : mobile,
        addEventListener: (_, fn) => listeners.push(fn),
        set: (matches) => { media.matches = matches; listeners.forEach((fn) => fn()); } };
      queries.set(query, media);
    }
    return queries.get(query);
  };
  window.requestAnimationFrame = (callback) => frames.push(callback);
  window.fetch = () => { throw new Error("The experience must not make network requests"); };
  window.eval(script);
  if (choose) window.document.querySelectorAll("[data-vehicle-controls] input[value=sedan]").forEach((radio) => radio.click());
  return { dom, window, document: window.document, queries,
    flush: () => { frames.splice(0).forEach((callback) => callback()); } };
}

test("all five shades update the visible value, native inputs and overlay", () => {
  const p = createPage();
  const studio = p.document.querySelector("[data-tint-studio]");
  const expected = [0.12, 0.32, 0.53, 0.72, 0.91];
  assert.equal(studio.querySelector("fieldset").disabled, false);
  [70, 50, 35, 20, 5].forEach((vlt, index) => {
    studio.querySelector(`input[value="${vlt}"]`).click();
    assert.equal(studio.querySelector("[data-tint-number]").textContent, `${vlt}%`);
    assert.equal(studio.querySelector("[data-tint-range]").value, String(index));
    assert.equal(studio.style.getPropertyValue("--vehicle-tint-opacity"), String(expected[index]));
    assert.equal(studio.querySelectorAll("[data-shade-option]:checked").length, 1);
    assert.match(studio.querySelector("[data-tint-range]").getAttribute("aria-valuetext"), new RegExp(`${vlt} percent`));
  });
  p.dom.window.close();
});

test("comparison, repeated clicks, range changes and reset stay in sync", () => {
  const p = createPage();
  const studio = p.document.querySelector("[data-tint-studio]");
  const range = studio.querySelector("[data-tint-range]");
  const compare = studio.querySelector("[data-tint-compare]");
  range.value = "4";
  range.dispatchEvent(new p.window.Event("input", { bubbles: true }));
  compare.click();
  assert.equal(studio.style.getPropertyValue("--vehicle-tint-opacity"), "0");
  assert.equal(compare.getAttribute("aria-pressed"), "true");
  assert.match(studio.querySelector("[data-tint-image-label]").textContent, /Original concept/);
  compare.click();
  assert.equal(studio.style.getPropertyValue("--vehicle-tint-opacity"), "0.91");
  compare.click();
  range.value = "0";
  range.dispatchEvent(new p.window.Event("input", { bubbles: true }));
  assert.equal(compare.getAttribute("aria-pressed"), "false");
  assert.equal(studio.style.getPropertyValue("--vehicle-tint-opacity"), "0.12");
  studio.querySelector("[data-tint-reset]").click();
  assert.equal(range.value, "2");
  assert.equal(studio.querySelector("input[value='35']").checked, true);
  p.dom.window.close();
});

test("multiple reusable studios do not share their selection or IDs", () => {
  const p = createPage({ html: tintStudio({ id: "a" }) + tintStudio({ id: "b" }) });
  p.document.querySelector("#a input[value='5']").click();
  assert.equal(p.document.querySelector("#b [data-tint-number]").textContent, "35%");
  const ids = [...p.document.querySelectorAll("[id]")].map((node) => node.id);
  assert.equal(new Set(ids).size, ids.length);
  p.dom.window.close();
});

test("scroll progress clamps, changes chapters, and supports reverse scrolling", () => {
  const p = createPage();
  const film = p.document.querySelector("[data-experience-film]");
  let top = 0;
  Object.defineProperty(film, "offsetHeight", { value: 2000 });
  Object.defineProperty(p.window, "innerHeight", { value: 1000 });
  film.getBoundingClientRect = () => ({ top });
  p.flush();
  assert.equal(film.classList.contains("is-motion-enabled"), true);
  for (const [position, phase, progress] of [[0, "01", "0.0000"], [-500, "02", "0.5000"], [-1000, "03", "1.0000"], [-2500, "03", "1.0000"], [500, "01", "0.0000"]]) {
    top = position;
    p.window.dispatchEvent(new p.window.Event("scroll")); p.flush();
    assert.equal(film.querySelector("[data-film-index]").textContent, phase);
    assert.equal(film.style.getPropertyValue("--film-progress"), progress);
  }
  p.dom.window.close();
});

test("mobile and reduced-motion modes disable pinned motion and preserve controls", () => {
  for (const options of [{ mobile: true }, { reduced: true }, { short: true }]) {
    const p = createPage(options);
    const film = p.document.querySelector("[data-experience-film]");
    assert.equal(film.classList.contains("is-motion-enabled"), false);
    assert.equal(film.getAttribute("style"), null);
    p.document.querySelector("input[value='20']").click();
    assert.equal(p.document.querySelector("[data-tint-number]").textContent, "20%");
    p.dom.window.close();
  }
});

test("live preference and width changes remove motion and can restore it", () => {
  const p = createPage();
  const film = p.document.querySelector("[data-experience-film]");
  p.flush();
  const reduced = p.queries.get("(prefers-reduced-motion: reduce)");
  reduced.set(true);
  assert.equal(film.classList.contains("is-motion-enabled"), false);
  assert.equal(film.getAttribute("style"), null);
  reduced.set(false); p.flush();
  assert.equal(film.classList.contains("is-motion-enabled"), true);
  p.queries.get("(max-width: 760px)").set(true);
  assert.equal(film.classList.contains("is-motion-enabled"), false);
  p.dom.window.close();
});

test("no-JavaScript fallback is honest, labeled, and cannot present dead controls as live", () => {
  const dom = new JSDOM(tintStudio());
  const doc = dom.window.document;
  assert.equal(doc.querySelector("fieldset").disabled, true);
  assert.ok(doc.querySelector("noscript").textContent.includes("Enable JavaScript"));
  assert.ok(doc.querySelector("[data-vehicle-scene] title").textContent.includes("Sedan"));
  assert.ok(doc.querySelector("[data-vehicle-scene] desc").textContent.includes("illustration"));
  assert.ok(doc.querySelector("[data-tint-status]").getAttribute("aria-live") === "polite");
  assert.ok(doc.querySelector(".tint-studio__disclaimer").textContent.includes("not legal recommendations"));
  dom.window.close();
});

test("generated integration is scoped to homepage and window tint, with working asset references", () => {
  for (const file of ["index.html", "services/window-tint.html"]) {
    const dom = new JSDOM(readFileSync(join(root, file), "utf8"));
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll("[data-tint-studio]").length, 1);
    assert.equal(doc.querySelectorAll("script[src='/assets/js/experience.js']").length, 1);
    assert.equal(doc.querySelectorAll("link[href='/assets/css/experience.css']").length, 1);
    const ids = [...doc.querySelectorAll("[id]")].map((node) => node.id);
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${file}`);
    for (const node of doc.querySelectorAll("[data-tint-studio] image, [data-experience-film] img")) {
      assert.ok(existsSync(join(root, node.getAttribute("href") || node.getAttribute("src"))));
    }
    const expected = file.startsWith("services/") ? "/contact.html" : "/services/window-tint.html";
    assert.equal(doc.querySelector(".tint-studio__cta").getAttribute("href"), expected);
    dom.window.close();
  }
  assert.equal(readFileSync(join(root, "services/ceramic-coatings.html"), "utf8").includes("experience.js"), false);
});

test("empty pages are safe and the experience introduces no lead or persistence APIs", () => {
  const p = createPage({ html: "<main>Unrelated page</main>" });
  assert.ok(p.document.querySelector("main"));
  assert.doesNotMatch(script, /fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon|\.submit\s*\(/);
  p.dom.window.close();
});

test("vehicle choice is required before customization and reveals only the matching scene", () => {
  const p = createPage({ choose: false });
  const studio = p.document.querySelector('[data-tint-studio]');
  assert.equal(studio.querySelector('[data-customize-controls]').disabled, true);
  assert.equal(studio.querySelectorAll('[data-vehicle-scene]:not([hidden])').length, 0);
  assert.equal(studio.querySelector('[data-vehicle-empty]').hidden, false);
  for (const key of ['sedan', 'coupe', 'suv', 'pickup']) {
    studio.querySelector(`[data-vehicle-option][value=${key}]`).click();
    assert.equal(studio.querySelector('[data-customize-controls]').disabled, false);
    const visible = [...studio.querySelectorAll('[data-vehicle-scene]:not([hidden])')];
    assert.equal(visible.length, 1);
    assert.equal(visible[0].dataset.vehicleScene, key);
    assert.equal(studio.querySelector('[data-design-summary]').hidden, false);
  }
  p.dom.window.close();
});

test("wrap, finish and PPF settings persist across cars, compare safely, and reset together", () => {
  const p = createPage(); const s = p.document.querySelector('[data-tint-studio]');
  s.querySelector('[data-wrap-option][value=violet]').click();
  assert.equal(s.querySelector('[data-finish-controls]').disabled, false);
  s.querySelector('[data-finish-option][value=satin]').click();
  s.querySelector('[data-coverage-option][value=front]').click();
  s.querySelector('[data-vehicle-option][value=suv]').click();
  assert.equal(s.style.getPropertyValue('--vehicle-paint'), '#69508f');
  assert.equal(s.style.getPropertyValue('--vehicle-finish-opacity'), '.2');
  assert.equal(s.dataset.coverage, 'front');
  assert.match(s.querySelector('[data-summary-wrap]').textContent, /Deep violet · Satin/);
  s.querySelector('[data-tint-compare]').click();
  assert.equal(s.style.getPropertyValue('--vehicle-paint'), '#7892ac');
  assert.equal(s.dataset.coverage, 'none');
  s.querySelector('[data-tint-compare]').click();
  assert.equal(s.dataset.coverage, 'front');
  s.querySelector('[data-tint-reset]').click();
  assert.equal(s.querySelector('[data-vehicle-option][value=suv]').checked, true);
  assert.equal(s.querySelector('[data-wrap-option][value=original]').checked, true);
  assert.equal(s.querySelector('[data-finish-controls]').disabled, true);
  assert.equal(s.dataset.coverage, 'none');
  p.dom.window.close();
});

test("tabs support arrow, Home and End keys with one selected tab and visible panel", () => {
  const p = createPage(); const s = p.document.querySelector('[data-tint-studio]');
  const tint = s.querySelector('[data-studio-tab=tint]');
  tint.dispatchEvent(new p.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  assert.equal(s.querySelector('[data-studio-tab=wrap]').getAttribute('aria-selected'), 'true');
  assert.equal(p.document.activeElement, s.querySelector('[data-studio-tab=wrap]'));
  s.querySelector('[data-studio-tab=wrap]').dispatchEvent(new p.window.KeyboardEvent('keydown',{key:'End',bubbles:true}));
  assert.equal(s.querySelector('[data-studio-tab=ppf]').getAttribute('aria-selected'), 'true');
  assert.equal(s.querySelectorAll('[data-studio-panel]:not([hidden])').length, 1);
  s.querySelector('[data-studio-tab=ppf]').dispatchEvent(new p.window.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
  assert.equal(tint.getAttribute('aria-selected'), 'true');
  p.dom.window.close();
});

test("clipboard is explicit, includes caveats, and reports failure honestly", async () => {
  const p = createPage(); const s = p.document.querySelector('[data-tint-studio]'); let copied='';
  Object.defineProperty(p.window.navigator,'clipboard',{configurable:true,value:{writeText:async(text)=>{copied=text;}}});
  s.querySelector('[data-copy-design]').click(); await new Promise(setImmediate);
  assert.match(copied, /Sedan concept/); assert.match(copied,/Confirm exact vehicle/);
  assert.match(s.querySelector('[data-copy-status]').textContent,/Nothing was sent/);
  p.window.navigator.clipboard.writeText=async()=>{throw new Error('Unavailable');};
  s.querySelector('[data-copy-design]').click(); await new Promise(setImmediate);
  assert.match(s.querySelector('[data-copy-status]').textContent,/unavailable/);
  assert.equal(s.querySelector('[data-copy-design]').disabled,false);
  p.dom.window.close();
});

test("a design change during clipboard work does not claim the new selections were copied", async () => {
  const p=createPage();const s=p.document.querySelector('[data-tint-studio]');let finishCopy;
  Object.defineProperty(p.window.navigator,'clipboard',{value:{writeText:()=>new Promise(resolve=>{finishCopy=resolve;})}});
  s.querySelector('[data-copy-design]').click();
  assert.equal(s.querySelector('[data-copy-design]').disabled,true);
  s.querySelector('[data-vehicle-option][value=pickup]').click();
  finishCopy();await new Promise(setImmediate);
  assert.match(s.querySelector('[data-copy-status]').textContent,/Earlier selections copied/);
  assert.equal(s.querySelector('[data-copy-design]').disabled,false);
  p.dom.window.close();
});
