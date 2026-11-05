/* Isolated browser QA. Only a temporary loopback server is opened. No leads sent. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.webm': 'video/webm', '.mp4': 'video/mp4' };
let browser;
let postAttempts = 0;
const server = http.createServer((req, res) => {
  if (req.method !== 'GET') { postAttempts++; res.writeHead(405); return res.end(); }
  let name = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  if (name.endsWith('/')) name += 'index.html';
  const file = path.join(root, name);
  if (!file.startsWith(root + path.sep) || path.basename(file).startsWith('.')) { res.writeHead(403); return res.end(); }
  try { res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'text/plain' }); res.end(fs.readFileSync(file)); }
  catch { res.writeHead(404); res.end('Not found'); }
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}),
    args: process.env.ELITE_SINGLE_PROCESS === '1' ? ['--no-sandbox', '--no-zygote', '--single-process', '--disable-dev-shm-usage', '--disable-gpu'] : []
  });
  const errors = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  for (const [progress, chapter] of [[0, '01'], [.5, '02'], [1, '03'], [0, '01']]) {
    await page.locator('[data-experience-film]').evaluate((el, p) => {
      const top = window.scrollY + el.getBoundingClientRect().top;
      window.scrollTo({ top: top + p * (el.offsetHeight - window.innerHeight), behavior: 'instant' });
    }, progress);
    await page.waitForFunction(expected => document.querySelector('[data-film-index]').textContent === expected, chapter);
  }
  assert.equal(await page.locator('[data-shade-option]').first().isDisabled(), true);
  assert.equal(await page.locator('[data-vehicle-scene]:visible').count(), 0);
  await page.locator('[data-vehicle-option][value=sedan]').check();
  await page.locator('[data-vehicle-option][value=sedan]').press('ArrowRight');
  assert.equal(await page.locator('[data-vehicle-option][value=coupe]').isChecked(), true);
  await page.locator('[data-tint-range]').focus();
  await page.locator('[data-tint-range]').press('ArrowRight');
  assert.equal(await page.locator('[data-tint-number]').innerText(), '20%');
  await page.locator('[data-studio-tab=tint]').press('ArrowRight');
  assert.equal(await page.locator('[data-studio-tab=wrap]').getAttribute('aria-selected'), 'true');
  await page.locator('[data-wrap-option][value=violet]').check();
  await page.locator('[data-finish-option][value=satin]').check();
  await page.locator('[data-studio-tab=wrap]').press('End');
  await page.locator('[data-coverage-option][value=front]').check();
  for (const key of ['sedan', 'coupe', 'suv', 'pickup']) {
    await page.locator(`[data-vehicle-option][value=${key}]`).check();
    assert.equal(await page.locator('[data-vehicle-scene]:visible').count(), 1);
    assert.equal(await page.locator('[data-vehicle-scene]:visible').getAttribute('data-vehicle-scene'), key);
    assert.match(await page.locator('[data-summary-wrap]').innerText(), /Deep violet.*Satin/);
  }
  await page.locator('[data-tint-compare]').click();
  assert.equal(await page.locator('[data-tint-studio]').getAttribute('data-coverage'), 'none');
  await page.locator('[data-tint-compare]').click();
  assert.equal(await page.locator('[data-tint-studio]').getAttribute('data-coverage'), 'front');
  await page.locator('[data-tint-reset]').click();
  assert.equal(await page.locator('[data-vehicle-option][value=pickup]').isChecked(), true);
  assert.equal(await page.locator('[data-tint-number]').innerText(), '35%');
  assert.equal(await page.locator('[data-wrap-option][value=original]').isChecked(), true);
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  for (const tab of ['tint', 'wrap', 'ppf']) {
    await page.locator(`[data-studio-tab=${tab}]`).click();
    const violations = await page.evaluate(async () => (await axe.run(document.querySelector('#tint-studio'))).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
    assert.deepEqual(violations, [], `Accessibility violations in ${tab}: ${JSON.stringify(violations)}`);
  }
  for (const viewport of [{ width: 320, height: 640 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 812, height: 375 }, { width: 1440, height: 1000 }, { width: 2560, height: 1440 }]) {
    await page.setViewportSize(viewport);
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth, studio: document.querySelector('#tint-studio').scrollWidth }));
    assert.ok(dimensions.page <= dimensions.viewport && dimensions.studio <= dimensions.viewport, JSON.stringify(dimensions));
    if (viewport.height <= 620 || viewport.width <= 760) {
      // Viewport changes deliver matchMedia events asynchronously.
      await page.waitForFunction(() => !document.querySelector('[data-experience-film]').classList.contains('is-motion-enabled'));
      assert.equal(await page.locator('[data-experience-film]').evaluate(el => el.classList.contains('is-motion-enabled')), false);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('[data-experience-film]').evaluate(el => el.classList.contains('is-motion-enabled')), false);
  assert.equal(await page.locator('.experience-film__stage').evaluate(el => getComputedStyle(el).position), 'relative');
  await page.emulateMedia({ forcedColors: 'active' });
  assert.equal(await page.locator('[data-vehicle-option][value=pickup]').isChecked(), true);
  await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'no-preference' });
  await page.locator('header [data-open-quote]').click();
  assert.equal(await page.locator('[data-quote-modal]').getAttribute('aria-hidden'), 'false');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-quote-modal]').getAttribute('aria-hidden'), 'true');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-nav-toggle]').click();
  assert.equal(await page.locator('[data-nav-toggle]').getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-nav-toggle]').getAttribute('aria-expanded'), 'false');
  await page.goto(base + '/services/window-tint.html');
  await page.locator('[data-vehicle-option][value=suv]').check();
  assert.equal(await page.locator('.tint-studio__cta').getAttribute('href'), '/contact.html');
  await page.goto(base);
  await page.goBack();
  assert.ok((await page.url()).endsWith('/services/window-tint.html'));
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noJs.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  const fallback = await noJs.newPage();
  await fallback.goto(base);
  assert.equal(await fallback.locator('[data-vehicle-option]').first().isDisabled(), true);
  assert.equal(await fallback.locator('[data-vehicle-scene]:visible').count(), 1);
  assert.equal(await fallback.locator('noscript').isVisible(), true);
  assert.equal(postAttempts, 0);
  assert.deepEqual(errors, []);
  console.log('PASS: Chromium cinematic forward/reverse scroll, car-first flow, four vehicles, native keyboard controls, wrap/PPF, compare/reset, three axe panels, six responsive sizes, reduced motion, forced colors, navigation/quote regression, Back, and no-JS fallback. No leads sent. External font requests were blocked for deterministic offline QA.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { if (browser) await browser.close(); server.close(); });
