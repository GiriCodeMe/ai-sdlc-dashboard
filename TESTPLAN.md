# AI-SDLC Performance Dashboard — Test Plan

_Version 1.0 · 2026-04-04_

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Test Strategy](#2-test-strategy)
3. [Test Environment](#3-test-environment)
4. [Test Execution Summary](#4-test-execution-summary)
5. [Requirements Traceability Matrix — Functional](#5-requirements-traceability-matrix--functional)
6. [Requirements Traceability Matrix — Non-Functional](#6-requirements-traceability-matrix--non-functional)
7. [Acceptance Criteria Traceability](#7-acceptance-criteria-traceability)
8. [Coverage Gaps & Risk Register](#8-coverage-gaps--risk-register)
9. [CI Gates Reference](#9-ci-gates-reference)

---

## 1. Purpose & Scope

This document describes how the `ai-sdlc-dashboard` application is tested, how every test maps to a requirement or acceptance criterion, and where known gaps exist.

**In scope**

- Unit tests for all pure utility functions and React components (`src/test/`)
- End-to-end behavioural tests run in a real Chromium browser (`e2e/app.spec.js`)
- WCAG 2.1 AA accessibility tests using axe-core (`e2e/accessibility.spec.js`)
- Static analysis: vulnerability scan (`npm audit`) and dependency audit

**Out of scope**

- Backend / API integration testing (no backend exists)
- Cross-browser tests beyond Chromium (not yet required)
- Load / performance testing beyond Lighthouse CI
- Mobile-gesture tests (responsive layout is covered by CSS media queries; no touch-specific interactions)

---

## 2. Test Strategy

### Pyramid layers

| Layer | Tool | Count | When |
|-------|------|-------|------|
| Unit / component | Vitest + @testing-library/react | 99 tests, 11 files | `npm test` — on every push |
| E2E behavioural | Playwright (Chromium) | 35 tests | `npm run test:e2e` — on every push |
| Accessibility | Playwright + @axe-core/playwright | 5 tests | `npm run test:a11y` — on every push |
| Vulnerability | npm audit | 0 high-severity | `npm audit --audit-level=high` |
| Build | Vite build | pass/fail | `npm run build` |

### Testing principles

1. **Pure functions tested in isolation** — `retentionRisk.js`, `formatters.js`, `heatmapLayout.js` are unit-tested without any React or DOM dependency.
2. **Components tested through the DOM** — all React component tests use `@testing-library/react` and query by role/text, never by internal implementation details.
3. **E2E tests wait for data** — every Playwright test's `beforeEach` calls `waitForLoadState('networkidle')` and asserts the `<h1>` is visible before any content assertion, ensuring metrics have loaded.
4. **Accessibility tested automatically** — axe-core scans the full rendered page in both light and dark mode; zero tolerance for WCAG 2.1 AA violations.
5. **Mock data flag tested** — components rendering `is_mock: true` data are explicitly tested for the MOCK badge.

### Coverage thresholds (enforced by Vitest)

| Metric | Threshold |
|--------|-----------|
| Statements | 80 % |
| Functions | 80 % |
| Branches | 75 % |
| Lines | 80 % |

---

## 3. Test Environment

### Local development

| Item | Value |
|------|-------|
| Dashboard dev server | `npm run dev` → `http://localhost:5174` |
| Playwright base URL | `http://localhost:5174` |
| Metrics file (E2E) | `public/metrics/roi-calculator.json` (copy of live metrics for local E2E) |
| Node version | 20 LTS |
| Browser (E2E) | Chromium (Playwright-managed) |

### CI (GitHub Actions)

| Item | Value |
|------|-------|
| Trigger | Push to `main`, pull request |
| Node version | 20 LTS |
| Dev server start | Playwright `webServer` config auto-starts `npm run dev` |
| Metrics file | Committed `public/metrics/roi-calculator.json` |

### Key environment notes

- Port 5174 is used deliberately to avoid collision with `roi-calculator` dev server (port 5173).
- `reuseExistingServer: !process.env.CI` — in CI a fresh server is always started; locally an existing server on 5174 is reused.
- `ResizeObserver` and `SVGElement.getBBox` / `getComputedTextLength` are mocked in `src/test/setup.js` for Recharts compatibility in jsdom.

---

## 4. Test Execution Summary

_Last recorded run — 2026-04-04_

| Suite | Files | Tests | Passed | Failed |
|-------|-------|-------|--------|--------|
| Unit (Vitest) | 11 | 99 | 99 | 0 |
| E2E behavioural (Playwright) | 1 | 35 | 35 | 0 |
| Accessibility (axe-core) | 1 | 5 | 5 | 0 |
| **Total** | **13** | **139** | **139** | **0** |

Coverage (last run):

| Metric | Measured | Threshold |
|--------|----------|-----------|
| Statements | 92 % | 80 % ✅ |
| Functions | 82 % | 80 % ✅ |
| Branches | 78 % | 75 % ✅ |
| Lines | 92 % | 80 % ✅ |

---

## 5. Requirements Traceability Matrix — Functional

| Requirement | Description | Test(s) |
|-------------|-------------|---------|
| FR-01.1 | Fetch `metrics/<project>.json` | `charts.test.jsx` — `useMetrics` is exercised via DashboardShell; `app.spec.js` — "dashboard loads metrics" |
| FR-01.2 | Loading state shown | `app.spec.js` — "dashboard loads metrics and does not show error" |
| FR-01.3 | Error state shown | `app.spec.js` — "dashboard loads metrics and does not show error" (negative) |
| FR-01.4 | Project switch without reload | `layout.test.jsx` — "calls onProjectChange when selection changes" |
| FR-02.1 | Nav bar h1 | `layout.test.jsx` — "renders dashboard title"; `app.spec.js` — "navbar is visible with dashboard title" |
| FR-02.2 | Project selector | `layout.test.jsx` — "renders project options", "defaults to roi-calculator"; `app.spec.js` — "project selector shows roi-calculator" |
| FR-02.3 | Dark mode label toggle | `layout.test.jsx` — "shows Dark label when not dark", "shows Light label when dark"; `app.spec.js` — "dark mode toggle changes button label" |
| FR-02.4 | `dark` class on wrapper | `app.spec.js` — "dark mode toggle adds dark class to wrapper" |
| FR-03.1 | Tier 1 cards | `TierPanels.test.jsx` — Tier1Panel tests; `app.spec.js` — "Tier 1 shows AI Acceptance Rate card", "Tier 1 shows Boilerplate Reduction card" |
| FR-03.2 | Tier 2 cards | `TierPanels.test.jsx` — Tier2Panel tests (flow_efficiency as %); `app.spec.js` — "Tier 2 shows PR Cycle Time card" |
| FR-03.3 | Tier 3 cards | `TierPanels.test.jsx` — Tier3Panel tests; `app.spec.js` — "Tier 3 shows AI Change Failure Rate card" |
| FR-03.4 | Tier 4 cards | `TierPanels.test.jsx` — Tier4Panel tests (labor_arbitrage toLocaleString); `app.spec.js` — "Tier 4 shows Token ROI card" |
| FR-03.5 | MOCK badge on TierCard | `TierCard.test.jsx` — "renders MOCK badge when isMock is true" |
| FR-03.6 | Trend arrow | `TierCard.test.jsx` — "renders up trend arrow", "renders down trend arrow" |
| FR-04.1–4.3 | SPACE panel dimensions | `SpacePanel.test.jsx` — all 5 dimension labels, activity count; `app.spec.js` — "SPACE panel shows Satisfaction/Activity dimension" |
| FR-05.1–5.5 | Correlation Heatmap | `charts.test.jsx` — SVG render, aria-label, project/sprint labels, empty state |
| FR-06.1–6.2 | Dual-axis chart | `charts.test.jsx` — chart container present, empty state; `app.spec.js` — "dual axis chart shows content or empty state" |
| FR-07.1–7.4 | ROI Tracker widget | `charts.test.jsx` — 3 sliders, default labels, state update; `app.spec.js` — "ROI tracker shows three sliders", "ROI tracker manual hours slider is interactive" |
| FR-08.1–8.4 | Retention Risk | `RetentionRiskFlag.test.jsx` — ok/flagged banners, 3-row table, status cells; `retentionRisk.test.js` — pure function thresholds; `app.spec.js` — banner/table row count |
| FR-09.1–9.4 | CI Gates panel | `CiGatesPanel.test.jsx` — all 9 gate labels, pass/fail icons, test counts; `app.spec.js` — Build/Unit Tests/Accessibility gates, at least one ✅ |

---

## 6. Requirements Traceability Matrix — Non-Functional

| Requirement | Threshold | Tool | Command |
|-------------|-----------|------|---------|
| NFR-01 Statements ≥ 80 % | 80 % | Vitest coverage-v8 | `npm run test:coverage` |
| NFR-01 Functions ≥ 80 % | 80 % | Vitest coverage-v8 | `npm run test:coverage` |
| NFR-01 Branches ≥ 75 % | 75 % | Vitest coverage-v8 | `npm run test:coverage` |
| NFR-01 Lines ≥ 80 % | 80 % | Vitest coverage-v8 | `npm run test:coverage` |
| NFR-02 Unit tests pass | 99/99 | Vitest | `npm test` |
| NFR-03 E2E tests pass | 35/35 | Playwright | `npm run test:e2e` |
| NFR-04 A11y tests pass | 5/5 | Playwright + axe | `npm run test:a11y` |
| NFR-05 Vulnerability scan | 0 high | npm audit | `npm audit --audit-level=high` |
| NFR-06 Build success | exit 0 | Vite | `npm run build` |

---

## 7. Acceptance Criteria Traceability

| AC | Criterion | Test file | Test name |
|----|-----------|-----------|-----------|
| AC-01.1 | Page title matches `/AI.SDLC/i` | `e2e/app.spec.js` | "page title is correct" |
| AC-01.2 | h1 visible within 5 s | `e2e/app.spec.js` | "navbar is visible with dashboard title" |
| AC-01.3 | No Error text on load | `e2e/app.spec.js` | "dashboard loads metrics and does not show error" |
| AC-01.4 | All 10 section headings visible | `e2e/app.spec.js` | "Tier 1–4 / SPACE / Heatmap / Velocity / ROI / Risk / CI section header is visible" (10 tests) |
| AC-02.1 | Label switches Dark↔Light | `e2e/app.spec.js` | "dark mode toggle changes button label" |
| AC-02.2 | `.dark` class added on click | `e2e/app.spec.js` | "dark mode toggle adds dark class to wrapper" |
| AC-02.3 | `.dark` removed on second click | `e2e/app.spec.js` | "dark mode can be toggled back to light" |
| AC-03.1 | Zero axe violations (light) | `e2e/accessibility.spec.js` | "no WCAG 2.1 AA violations on light mode page load" |
| AC-03.2 | Zero axe violations (dark) | `e2e/accessibility.spec.js` | "no WCAG 2.1 AA violations in dark mode" |
| AC-03.3 | Keyboard focus — selector | `e2e/accessibility.spec.js` | "project selector is keyboard accessible" |
| AC-03.3 | Keyboard focus — toggle | `e2e/accessibility.spec.js` | "dark mode button is keyboard accessible" |
| AC-03.4 | Heading nesting order | `e2e/accessibility.spec.js` | "all headings are properly nested" |
| AC-04.1 | Three sliders present | `e2e/app.spec.js` | "ROI tracker shows three sliders" |
| AC-04.2 | Slider updates display | `e2e/app.spec.js` | "ROI tracker manual hours slider is interactive" |

---

## 8. Coverage Gaps & Risk Register

| ID | Gap / Risk | Impact | Mitigation |
|----|-----------|--------|------------|
| GAP-01 | `useMetrics.js` fetch logic is not unit-tested (requires network mocking) | Low — covered by E2E `networkidle` wait | Add `vi.spyOn(window, 'fetch')` unit test in a future sprint |
| GAP-02 | `DualAxisChart` legend and tooltip render depend on Recharts internals; only container presence is asserted in E2E | Low | Recharts has its own test suite; tooltip interaction adds little confidence here |
| GAP-03 | ROI Tracker `buildProjection` pure function is not directly unit-tested | Low — tested indirectly via `charts.test.jsx` RoiTrackerWidget tests | Expose and unit-test in future sprint |
| GAP-04 | No cross-browser tests (Firefox, Safari/WebKit) | Medium — most users are Chrome-based; axe results may differ | Add Firefox project to Playwright config when user-agent data suggests need |
| GAP-05 | Dark mode colour palette is not unit-tested | Medium — covered by axe dark mode scan | Add visual regression snapshot if palette churn becomes frequent |
| GAP-06 | Historical series append logic lives in `collect-metrics.js` (roi-calculator), not in the dashboard; no tests here | Low | Covered by roi-calculator's own CI; dashboard is read-only consumer |
| RISK-01 | Stale `public/metrics/roi-calculator.json` — if the file diverges from the live schema, E2E tests pass but real users see layout issues | Medium | Automate a copy-on-CI step; validate schema version field |
| RISK-02 | Port 5174 conflict — if another process binds 5174 locally, E2E tests reuse the wrong server | Low | `reuseExistingServer: false` option available; document in CLAUDE.md |

---

## 9. CI Gates Reference

The dashboard's own CI (GitHub Actions deploy workflow) runs the following gates on every push to `main`:

| # | Gate | Command | Pass condition |
|---|------|---------|----------------|
| 1 | Build | `npm run build` | Exit 0, dist artefact produced |
| 2 | Unit tests | `npm test` | 99/99 tests pass |
| 3 | Coverage | `npm run test:coverage` | All 4 thresholds met |
| 4 | E2E tests | `npm run test:e2e` | 35/35 tests pass |
| 5 | Accessibility | `npm run test:a11y` | 5/5 axe scans pass (0 violations) |
| 6 | Vulnerability scan | `npm audit --audit-level=high` | 0 high-severity advisories |
| 7 | Deploy to Pages | `actions/deploy-pages@v4` | Deployment URL live |

Results from gates 1–6 are written to `test-results/` as JSON artefacts and consumed by the dashboard's own `ci_native` metrics field in future sprints.
