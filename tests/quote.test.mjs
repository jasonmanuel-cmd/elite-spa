import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { modal } from '../build/partials.mjs';

const client = readFileSync(new URL('../assets/js/quote-form.js', import.meta.url), 'utf8');
const server = readFileSync(new URL('../api/quote.js', import.meta.url), 'utf8');
const tick = () => new Promise(setImmediate);
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
function clock() {
  const tasks = new Map(); let id = 0;
  return { setTimeout(fn, ms) { tasks.set(++id, { fn, ms }); return id; }, clearTimeout(id) { tasks.delete(id); },
    fire(ms) { for (const [key, task] of tasks) if (task.ms === ms) { tasks.delete(key); task.fn(); } }, tasks };
}
function page(fetch) {
  const dom = new JSDOM(modal(), { runScripts: 'outside-only', url: 'http://localhost/' });
  const w = dom.window, time = clock(); Object.assign(w, { fetch, setTimeout: time.setTimeout, clearTimeout: time.clearTimeout });
  w.eval(client);
  const form = w.document.querySelector('form');
  for (const [name, value] of Object.entries({ name: 'Synthetic Test', phone: '2025550100', email: 'quote@example.invalid', vehicle_year: '2024' })) form.elements[name].value = value;
  form.querySelector('[name=service]').checked = true; form.elements.sms_consent.checked = true;
  const submit = () => form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  return { dom, w, form, time, submit, status: form.querySelector('[data-form-status]'), button: form.querySelector('[data-submit]') };
}
for (const [name, response] of [
  ['missing JSON', { ok: true, json: async () => { throw Error('invalid'); } }],
  ['empty body', { ok: true, json: async () => ({}) }],
  ['false ok', { ok: true, json: async () => ({ ok: false }) }],
  ['non-boolean ok', { ok: true, json: async () => ({ ok: 'true' }) }]
]) test(`client does not claim success for ${name}`, async () => {
  const p = page(async () => response); p.submit(); await tick();
  assert.equal(p.form.elements.email.value, 'quote@example.invalid');
  assert.match(p.status.textContent, /couldn't confirm/i); assert.equal(p.button.disabled, true); p.dom.window.close();
});
test('pending close/reopen and repeated events send once; confirmed success remains visible', async () => {
  const reply = deferred(); let calls = 0;
  const p = page(() => { calls++; return reply.promise; }); p.submit(); p.submit();
  const modal = p.w.document.querySelector('[data-quote-modal]'); modal.setAttribute('aria-hidden', 'true'); modal.setAttribute('aria-hidden', 'false'); p.submit();
  await tick();
  assert.equal(calls, 1); assert.equal(p.form.elements.email.disabled, true);
  reply.resolve({ ok: true, json: async () => ({ ok: true }) }); await tick();
  assert.match(p.status.textContent, /has been received/); assert.equal(p.status.closest('[data-step]'), null);
  p.submit(); assert.equal(calls, 1); assert.equal(p.time.tasks.size, 0); p.dom.window.close();
});
test('client timeout covers stalled body; late success cannot clear data or change status', async () => {
  const body = deferred(); let calls = 0, signal;
  const p = page(async (_, options) => { calls++; signal = options.signal; return { ok: true, json: () => body.promise }; });
  p.submit(); await tick(); p.time.fire(15000); await tick();
  assert.equal(signal.aborted, true); assert.equal(p.form.elements.email.disabled, false);
  assert.match(p.status.textContent, /couldn't confirm/i); const message = p.status.textContent;
  p.form.elements.name.value = 'Keep edited draft'; body.resolve({ ok: true }); await tick(); p.submit();
  assert.equal(calls, 1); assert.equal(p.status.textContent, message); assert.equal(p.form.elements.name.value, 'Keep edited draft'); p.dom.window.close();
});
test('known pre-delivery rejection preserves data and allows a deliberate retry', async () => {
  let calls = 0; const p = page(async () => { calls++; return { ok: false, status: 400, json: async () => ({ ok: false }) }; });
  p.submit(); await tick(); assert.equal(p.button.disabled, false); assert.equal(p.form.elements.email.value, 'quote@example.invalid');
  p.submit(); await tick(); assert.equal(calls, 2); p.dom.window.close();
});
test('client bounds stalled headers and a hidden success never moves focus or resets edits', async () => {
  const stalled = page(() => new Promise(() => {})); stalled.submit(); await tick(); stalled.time.fire(15000); await tick();
  assert.match(stalled.status.textContent, /couldn't confirm/); assert.equal(stalled.time.tasks.size, 0); stalled.dom.window.close();
  const reply = deferred(); const p = page(() => reply.promise);
  const opener = p.w.document.createElement('button'); p.w.document.body.append(opener); opener.focus();
  p.submit(); p.form.elements.name.value = 'Newer programmatic edit'; await tick();
  reply.resolve({ ok: true, json: async () => ({ ok: true }) }); await tick();
  assert.equal(p.w.document.activeElement, opener); assert.equal(p.form.elements.name.value, 'Newer programmatic edit');
  assert.equal(p.time.tasks.size, 0); p.dom.window.close();
});
test('network error and server delivery ambiguity never automatically retry', async () => {
  for (const fetch of [async () => { throw Error('offline'); }, async () => ({ ok: false, status: 502, json: async () => ({ ok: false, delivery: 'unknown' }) })]) {
    let calls = 0; const p = page((...args) => { calls++; return fetch(...args); }); p.submit(); await tick(); p.submit();
    assert.equal(calls, 1); assert.match(p.status.textContent, /may have been received/); p.dom.window.close();
  }
});
function api(fetch, env = { RESEND_API_KEY: 'synthetic-not-a-key', LEAD_TO_EMAIL: 'shop@example.invalid', LEAD_FROM_EMAIL: 'sender@example.invalid' }) {
  const time = clock(); const context = { module: { exports: {} }, process: { env }, console: { error() {} }, fetch, AbortController, setTimeout: time.setTimeout, clearTimeout: time.clearTimeout };
  vm.runInNewContext(server, context);
  const res = { status(code) { this.code = code; return this; }, setHeader() { return this; }, json(body) { this.body = body; } };
  const req = { method: 'POST', headers: { 'content-type': 'application/json' }, body: { service: 'Window Tint', name: 'Synthetic', phone: '2025550100', email: 'quote@example.invalid' } };
  return { time, res, req, run: () => context.module.exports(req, res) };
}
test('API bounds provider wait, aborts, returns unknown and never retries late acceptance', async () => {
  const pending = deferred(); let calls = 0, signal;
  const p = api((url, options) => { calls++; signal = options.signal; return pending.promise; });
  const run = p.run(); p.time.fire(10000); await run;
  assert.equal(signal.aborted, true); assert.equal(p.res.code, 502); assert.equal(p.res.body.delivery, 'unknown');
  pending.resolve({ ok: true }); await tick(); assert.equal(calls, 1); assert.equal(p.res.code, 502); assert.equal(p.time.tasks.size, 0);
});
test('API success/rejection and configuration/validation paths use only fake providers', async () => {
  for (const ok of [true, false]) {
    const p = api(async () => ({ ok, status: ok ? 200 : 500 })); await p.run();
    assert.equal(p.res.code, ok ? 200 : 502); assert.equal(p.res.body.ok, ok); assert.equal(p.time.tasks.size, 0);
  }
  const p = api(() => { throw Error('must not fetch'); }, {}); await p.run(); assert.equal(p.res.code, 503);
  p.req.body.email = 'invalid'; await p.run(); assert.equal(p.res.code, 400);
});
test('API transport exceptions clean the deadline and do not expose provider details', async () => {
  for (const fetch of [() => { throw Error('synthetic private detail'); }, async () => { throw Error('synthetic private detail'); }]) {
    const p = api(fetch); await p.run(); assert.equal(p.res.code, 502);
    assert.equal(p.res.body.delivery, 'unknown'); assert.doesNotMatch(JSON.stringify(p.res.body), /private detail/);
    assert.equal(p.time.tasks.size, 0);
  }
});
