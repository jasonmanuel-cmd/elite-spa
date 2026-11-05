# Elite quote reliability: local review handoff

Status: local repair and fake-provider verification complete; not deployed and not a customer-ready certification.

## Source and boundaries

- Authorized blunts workspace: `C:\Users\blunts\Documents\Codex\2026-11-04\task-4\elite-spa-review`.
- Fresh isolated clone of `https://github.com/jasonmanuel-cmd/elite-spa.git`, repository ID supplied by delegation: `1332546955`.
- Remote main at checkout: `fc5da1b8b5ba9fa70134fb9d9849bae73fe88646`.
- Review branch: `review/quote-reliability`. No push, merge or deployment.
- Inspected README, package scripts/lockfile, previous EXPERIENCE-HANDOFF, generator/modal, client, API and existing tests. No AGENTS.md or .agents/skills exists in this repository; no local memories directory was available at the standard Codex location. No private session files were read.
- The separate Jason computer and EliteAutoSpa- repository were not accessed. No credentials were read or created. API tests run in a VM with synthetic environment values and fake fetch; browser tests intercept quotes before the localhost server. No live API handler/provider, real lead, email, or external send was exercised.

## Reproduced and repaired

The initial focused regression run on the original source failed malformed/missing success JSON, false/non-boolean `ok`, overlapping submissions, client deadline and ambiguous-delivery cases. The old API stalled indefinitely with a never-resolving fake provider; that baseline run was stopped rather than waiting indefinitely. These are source/local reproductions, not verified production incidents.

- Require successful HTTP **and** JSON `ok === true` before acknowledgement.
- Bound client fetch and response JSON to 15 seconds; bound provider headers to 10 seconds. Abort on deadline and clean timers on settlement. Provider error bodies are no longer read/logged, avoiding an unbounded body read and accidental sensitive diagnostics.
- Guard submissions in code, freeze form controls while pending, and keep modal dismissal available. Closing does not cancel an already-issued delivery attempt; reopening preserves its state.
- Preserve entered data and status. Place feedback outside individual steps; remove delayed reset/focus work that could hide feedback or interfere with a reopened modal. Hidden initialization does not steal focus.
- Strict known pre-provider rejections (400/413/415/429/503 with `ok:false`) allow a deliberate corrected retry. Other responses, network failures and timeouts show delivery unconfirmed, explain that receipt remains possible, and lock resubmission in that loaded page. Success also locks further submissions in that loaded page.
- API transport/provider failure returns 502 with `ok:false, delivery:"unknown"`. Provider HTTP acceptance is not proof of inbox delivery.
- No business facts, prices, studio implementation, legal/SMS text, sender or environment configuration changed. Existing success wording is retained. New error wording and the one-submission-per-page UX should be reviewed before release.

## Verification

- Locked dev dependencies installed with `pnpm install --frozen-lockfile --ignore-scripts`; no known credentials needed by reviewed build/test scripts.
- `node --test tests/*.test.mjs`: **26 passed**, including all 14 unchanged vehicle-studio tests and 12 quote/API tests. Fake clocks, HTTP responses, provider transport, stalled headers/body, abort signals, late completion, hidden-modal focus and retained drafts covered.
- `node build/build.mjs`: **passed**, 17 generated pages plus homepage/sitemap. Only date/line-ending churn resulted; generated files restored to baseline to keep the patch focused.
- `node tests/quote-browser.cjs`: **passed**, Chromium 1440x1000 and 390x844. Real controls, navigation, fake 400 retry, close/Escape/reopen, repeated events, timeout and stale success; no localhost server POST reached the handler. External requests blocked.
- `node tests/browser-smoke.cjs`: **passed unchanged**, cinematic scroll, four body styles, tint/wrap/PPF, keyboard controls, three axe panels, six viewport sizes, reduced motion, forced colors, quote/navigation, Back and no-JS fallback.
- Syntax and `git diff --check`: passed.
- Browser executable override: `C:\Users\blunts\AppData\Local\ms-playwright\chromium-1243\chrome-win64\chrome.exe`, through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Package browser download not required. Sandbox initially blocked loopback; approved elevated execution of the same isolated tests succeeded. No outstanding approval denial.

## Deliberate limitations and launch gates

1. **No durable idempotency.** Locks exist only in this loaded page. Reloads, other tabs/devices and direct API clients can repeat a request; abort does not undo provider acceptance. No automatic retry or in-memory server cache is presented as exactly-once delivery. A broader retry feature needs separately designed durable/provider-backed idempotency with payload binding, expiry and concurrency testing. No database or paid service was added.
2. **Delivery configuration/inbox unverified.** Separately authorize and verify intended recipient, verified sender/domain, runtime environment and end-to-end inbox arrival. Confirm platform function duration accommodates the 10-second provider deadline. This task did not inspect secret values, alter settings or contact a provider.
3. **Business/legal approval remains open.** Validate contact details, testimonials/photos, insurance/experience/vehicle-count claims, policies and actual films/coverage/availability. Existing SMS checkbox is required in the UI while text says consent is not a condition of purchase; preserved for separate approved review, not certified here.
4. **Broader device/accessibility QA remains open.** Safari/iOS, Firefox, physical phone, screen reader, zoom, production fonts and connection/performance checks were not completed by this Chromium-focused pass.
5. **Release authorization required.** Review the local diff and new error/lock behavior, then separately authorize any push/deploy and live-delivery test. Production remains unchanged by this task.

## Tracker update

- [x] Confirm correct source and preserve cinematic studio.
- [x] Reproduce and repair focused quote reliability defects locally.
- [x] Deterministic quote/API tests, existing studio suite and static build.
- [x] Local desktop/mobile Chromium interactions with fake delivery.
- [ ] Review release UX and business/legal claims.
- [ ] Verify real sender/recipient settings and authorized inbox delivery.
- [ ] Broader device/accessibility checks.
- [ ] Separately authorize release.

Suggested project status: **Local quote reliability verified; launch gates still open.**
