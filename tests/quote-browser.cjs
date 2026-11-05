/* Localhost only; quote responses are intercepted. No API handler or provider runs. */
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
let browser, serverPosts = 0;
const server = http.createServer((req, res) => {
  if (req.method !== 'GET') { serverPosts++; res.writeHead(405); return res.end(); }
  const name = new URL(req.url, 'http://localhost').pathname;
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep) || !/\.(html|js|css|webp|png|jpg|svg|mp4|webm|ico)$/.test(file)) { res.writeHead(403); return res.end(); }
  try { const data = fs.readFileSync(file); res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' })[path.extname(file)] || 'application/octet-stream'); res.end(data); }
  catch { res.writeHead(404); res.end(); }
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    let pending, requestSeen, calls = 0; const errors = [];
    const nextQuote = () => new Promise(resolve => { requestSeen = resolve; });
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url === base + '/api/quote') { calls++; pending = route; if (requestSeen) requestSeen(); return; }
      return url.startsWith(base + '/') && route.request().method() === 'GET' ? route.continue() : route.abort();
    });
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    await page.clock.install();
    const open = async () => { await page.locator('[data-open-quote]:visible').first().click(); await page.clock.runFor(70); };
    await open();
    await page.locator('[name=service][value="Window Tint"]').check();
    await page.locator('[data-next]').click();
    await page.locator('[name=vehicle_year]').fill('2024');
    await page.locator('[data-next]').click();
    await page.locator('[name=name]').fill('Synthetic Browser');
    await page.locator('[name=phone]').fill('2025550100');
    await page.locator('[name=email]').fill('browser@example.invalid');
    await page.locator('[data-next]').click();
    await page.locator('[name=sms_consent]').check();
    await Promise.all([nextQuote(), page.locator('[data-submit]').click()]);
    await page.waitForFunction(() => document.querySelector('form').getAttribute('aria-busy') === 'true');
    assert.equal(await page.locator('[name=email]').isDisabled(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[data-quote-modal]').getAttribute('aria-hidden'), 'true');
    await open();
    await page.locator('form').evaluate(form => { form.requestSubmit(); form.dispatchEvent(new Event('submit', { cancelable: true })); });
    assert.equal(calls, 1);
    await pending.fulfill({ status: 400, contentType: 'application/json', body: '{"ok":false}' });
    await page.waitForFunction(() => !document.querySelector('[data-submit]').disabled);
    assert.equal(await page.locator('[name=email]').inputValue(), 'browser@example.invalid');
    assert.equal(await page.locator('[data-form-status]').isVisible(), true);
    await Promise.all([nextQuote(), page.locator('[data-submit]').click()]);
    assert.equal(calls, 2);
    await page.clock.runFor(15001);
    await page.waitForFunction(() => document.querySelector('[data-form-status]').textContent.includes("couldn't confirm"));
    assert.equal(await page.locator('[data-submit]').isDisabled(), true);
    await page.keyboard.press('Escape'); await open();
    assert.equal(await page.locator('[data-form-status]').isVisible(), true);
    await page.locator('form').evaluate(form => form.requestSubmit());
    assert.equal(calls, 2);
    await pending.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }).catch(() => {});
    assert.equal(await page.locator('[name=email]').inputValue(), 'browser@example.invalid');
    assert.match(await page.locator('[data-form-status]').innerText(), /couldn't confirm/);
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`PASS quote flow ${viewport.width}x${viewport.height}: native navigation, fake rejection/retry, close/reopen, duplicate events, timeout, retained data, late reply.`);
  }
  assert.equal(serverPosts, 0);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { if (browser) await browser.close(); server.close(); });
