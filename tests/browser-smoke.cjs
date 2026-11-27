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
  const { TINT_STUDIO_ENABLED } = await import('../build/experience.mjs');
  // "Your car. Your look." is paused: it must not render. (Its interactions are covered in experience.test.mjs.)
  assert.equal(await page.locator('[data-tint-studio]').count(), TINT_STUDIO_ENABLED ? 1 : 0);
  assert.equal(await page.getByText('Your car. Your look.').count(), TINT_STUDIO_ENABLED ? 1 : 0);
  assert.equal(await page.locator('a[href="#tint-studio"]').count(), TINT_STUDIO_ENABLED ? 1 : 0);

  // 2040 layer: brand marks, headline integrity, live status, counters, protocol, ticker, promo banner.
  const logo = await page.locator('.site-header .brand__logo').boundingBox();
  assert.ok(logo && logo.width > 80 && logo.height > 40, 'header logo must have real size: ' + JSON.stringify(logo));
  assert.equal((await page.locator('#hero-title').innerText()).replace(/\s+/g, ' ').trim().toLowerCase(), 'revitalize your ride.');
  assert.ok(await page.locator('#hero-title .w').count() >= 3, 'headline words are split for the reveal');
  assert.match(await page.locator('[data-clock]').first().innerText(), /\d{1,2}:\d{2} (AM|PM) CT/);
  assert.equal(await page.locator('.ticker').getAttribute('aria-hidden'), 'true');
  assert.equal(await page.locator('#protocol .protocol__step').count(), 4);
  assert.equal(await page.locator('.promo-banner [data-open-quote]').count(), 1);
  await page.locator('.telemetry-strip').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('[data-count="7"]').textContent === '07', null, { timeout: 5000 });
  assert.equal(await page.locator('.telemetry-strip li').count(), 3);
  await page.locator('#protocol').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => parseFloat(document.querySelector('[data-protocol]').style.getPropertyValue('--fill') || '0') > 0);
  assert.equal(await page.locator('.cursor-ring').count() <= 1, true);
  const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')); });
  assert.ok(fonts.includes('Montserrat'), 'self-hosted Montserrat loads: ' + fonts.join(','));
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim().toLowerCase()), '#d32f2f');

  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const axeViolations = await page.evaluate(async () => (await axe.run(document, { rules: { 'color-contrast': { enabled: false } } })).violations.map(v => ({ id: v.id, targets: v.nodes.slice(0, 3).map(n => n.target) })));
  assert.deepEqual(axeViolations, [], 'Homepage accessibility violations: ' + JSON.stringify(axeViolations));
  for (const viewport of [{ width: 320, height: 640 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 812, height: 375 }, { width: 1440, height: 1000 }, { width: 2560, height: 1440 }]) {
    await page.setViewportSize(viewport);
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
    assert.ok(dimensions.page <= dimensions.viewport, 'horizontal overflow ' + JSON.stringify(dimensions));
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
  assert.equal(await page.locator('[data-tint-studio]').count(), TINT_STUDIO_ENABLED ? 1 : 0);
  assert.equal(await page.locator('.site-header .brand__logo').count(), 1);
  await page.goto(base);
  await page.goBack();
  assert.ok((await page.url()).endsWith('/services/window-tint.html'));
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noJs.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  const fallback = await noJs.newPage();
  await fallback.goto(base);
  // Without JS the headline, hero actions and content must be fully visible.
  assert.equal(await fallback.locator('#hero-title').isVisible(), true);
  assert.equal((await fallback.locator('#hero-title').innerText()).trim().toLowerCase(), 'revitalize your ride.');
  assert.equal(await fallback.locator('.hero--future [data-open-quote]').isVisible(), true);
  assert.equal(postAttempts, 0);
  assert.deepEqual(errors, []);
  console.log('PASS: Chromium cinematic scroll, studio paused, 2040 brand layer (logo, headline, clock, counters, protocol, fonts, palette), homepage axe, six responsive sizes with no overflow, reduced motion, forced colors, navigation/quote regression, Back, and no-JS fallback. No leads sent. No external requests.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { if (browser) await browser.close(); server.close(); });
