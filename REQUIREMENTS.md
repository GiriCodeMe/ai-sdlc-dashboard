# AI-SDLC Performance Dashboard — Requirements

_Version 1.0 · 2026-04-04_

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Personas](#2-personas)
3. [User Stories](#3-user-stories)
4. [User Journeys](#4-user-journeys)
5. [Functional Requirements](#5-functional-requirements)
6. [Acceptance Criteria](#6-acceptance-criteria)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Constraints & Assumptions](#8-constraints--assumptions)

---

## 1. Product Overview

The AI-SDLC Performance Dashboard is a GitHub Pages single-page application that aggregates structured metrics JSON files published by Claude-built projects through GitHub Actions CI. It provides engineering managers and team leads with a unified view of AI-assisted development health across four measurement tiers, the SPACE framework, retention risk flags, and CI quality gates.

**Elevator pitch:** One dashboard → every metric that matters when your team ships with AI assistance.

### Project context

| Item | Detail |
|------|--------|
| Repository | `GiriCodeMe/ai-sdlc-dashboard` |
| Deployment | GitHub Pages (`/ai-sdlc-dashboard/`) |
| First data source | `roi-calculator` (metrics auto-pushed by its CI) |
| Tech stack | React 18, Vite 6, Recharts 2, d3-scale-chromatic |
| Test stack | Vitest 2, @testing-library/react, Playwright, @axe-core/playwright |

---

## 2. Personas

### P1 — Engineering Manager (primary)
- Monitors multiple Claude-assisted projects simultaneously
- Needs weekly trend visibility without digging into raw CI logs
- Makes staffing and tooling budget decisions based on ROI evidence
- Non-technical in CI tooling; expects clean summaries

### P2 — Senior Developer / Tech Lead
- Wants real-time health signals after each merge
- Cares about PR cycle time, failure rates, and test coverage trends
- Uses the dashboard to justify or challenge AI tooling choices

### P3 — Developer Experience Engineer
- Owns the metrics pipeline and dashboard codebase
- Adds new source projects and metrics fields
- Writes and maintains CI collectors and dashboard components

---

## 3. User Stories

### Dashboard load

| ID | Story |
|----|-------|
| US-01 | As an Engineering Manager I want to open the dashboard and immediately see all KPIs for the default project so I don't have to navigate. |
| US-02 | As a Tech Lead I want a project selector in the nav bar so I can switch between projects without a page reload. |
| US-03 | As any user I want a dark mode toggle so I can use the dashboard comfortably in low-light environments. |

### KPI tiers

| ID | Story |
|----|-------|
| US-04 | As an Engineering Manager I want to see Tier 1 AI Input metrics (acceptance rate, boilerplate reduction) so I know how deeply the team uses AI assistance. |
| US-05 | As a Tech Lead I want Tier 2 Process metrics (PR cycle time, flow efficiency) to spot delivery bottlenecks. |
| US-06 | As a Tech Lead I want Tier 3 Output Quality metrics (AI change failure rate, security remediation speed) to assess risk. |
| US-07 | As an Engineering Manager I want Tier 4 Business Value metrics (Token ROI, unit cost per feature, labor arbitrage) to build the AI tooling business case. |

### SPACE framework

| ID | Story |
|----|-------|
| US-08 | As an Engineering Manager I want the five SPACE dimensions displayed with progress bars so I can quickly see developer wellbeing alongside productivity. |

### Charts

| ID | Story |
|----|-------|
| US-09 | As a Tech Lead I want a Correlation Heatmap of AI adoption vs technical debt per sprint so I can detect adoption-quality trade-offs early. |
| US-10 | As a Tech Lead I want a Velocity/Quality dual-axis chart (PR cycle time vs AI-induced vulnerabilities) so I can spot speed vs safety trade-offs. |
| US-11 | As an Engineering Manager I want an interactive ROI Tracker with sliders for hours saved, hourly rate, and subscription cost so I can produce scenario-based ROI numbers instantly. |

### Risk and CI

| ID | Story |
|----|-------|
| US-12 | As an Engineering Manager I want a Retention Risk flag that highlights when high AI dependency is combined with high failure rates or low orchestration so I can act before talent risk becomes real. |
| US-13 | As a DevEx Engineer I want all 9 CI quality gates displayed as a pass/fail grid so the team can see build health at a glance. |

### Mock data transparency

| ID | Story |
|----|-------|
| US-14 | As any user I want sections with simulated data to display a visible "MOCK DATA" badge so I know which numbers are real vs illustrative. |

---

## 4. User Journeys

### Journey 1 — Morning dashboard check (Engineering Manager)

1. Open `https://giricodeme.github.io/ai-sdlc-dashboard/`
2. See the project defaulting to `roi-calculator`
3. Scan Tier 1–4 cards for red flags (trend arrows, high failure rates)
4. Check Retention Risk banner colour — green = no action needed
5. Glance at CI Quality Gates grid — all ✅ = healthy build
6. Done in under 60 seconds

### Journey 2 — ROI justification (Engineering Manager)

1. Open ROI Tracker section
2. Adjust "Manual hours saved / mo" slider to match team estimate
3. Adjust "Hourly rate" slider to blended team cost
4. Read 12-month net savings projection from the chart
5. Screenshot for budget review deck

### Journey 3 — Adding a new project (DevEx Engineer)

1. Add `publish-metrics` CI job to the new project, pointing `SDLC_DASHBOARD_PAT` at the dashboard repo
2. Update `KNOWN_PROJECTS` array in `useMetrics.js` to include the new project slug
3. Merge — CI pushes `metrics/<project>.json` to dashboard repo
4. Dashboard deploy runs automatically; new project appears in the selector

---

## 5. Functional Requirements

### FR-01 — Metrics fetch and routing

| ID | Requirement |
|----|-------------|
| FR-01.1 | The app shall fetch `metrics/<project>.json` from the dashboard's own origin at startup. |
| FR-01.2 | The app shall display a "Loading metrics…" state while the fetch is in progress. |
| FR-01.3 | On fetch failure the app shall display an "Error: …" message with the HTTP status. |
| FR-01.4 | Switching the project selector shall load the corresponding metrics without a full page reload. |

### FR-02 — Nav bar

| ID | Requirement |
|----|-------------|
| FR-02.1 | The nav bar shall display the title "AI SDLC Performance Dashboard" as an `<h1>`. |
| FR-02.2 | A `<select>` labelled "Select project" shall list all known projects and default to `roi-calculator`. |
| FR-02.3 | A toggle button labelled "Toggle dark mode" shall switch between "Dark" and "Light" labels. |
| FR-02.4 | Activating dark mode shall add class `dark` to the root wrapper `<div>`. |

### FR-03 — Tier KPI panels

| ID | Requirement |
|----|-------------|
| FR-03.1 | **Tier 1** shall render `ai_acceptance_rate` (%) and `boilerplate_reduction` (%) as TierCards. |
| FR-03.2 | **Tier 2** shall render `pr_cycle_time` (hours) and `flow_efficiency` (as %). |
| FR-03.3 | **Tier 3** shall render `ai_change_failure_rate` (%) and `security_remediation_speed` (days). |
| FR-03.4 | **Tier 4** shall render `unit_cost_per_feature` ($), `token_roi` (x), and `labor_arbitrage_value` ($). |
| FR-03.5 | Each TierCard with `is_mock: true` shall show an orange "MOCK" badge. |
| FR-03.6 | Each TierCard shall show an up/down trend arrow when a `trend` prop is provided. |

### FR-04 — SPACE Framework panel

| ID | Requirement |
|----|-------------|
| FR-04.1 | All five SPACE dimensions (Satisfaction, Performance, Activity, Communication, Efficiency) shall be displayed. |
| FR-04.2 | Each dimension shall show its value, a CSS progress bar, and a MOCK badge when applicable. |
| FR-04.3 | `activity` shall display the raw count (commits + PRs) rather than a score out of 5. |

### FR-05 — Correlation Heatmap

| ID | Requirement |
|----|-------------|
| FR-05.1 | The heatmap shall render as a native SVG using `d3-scale-chromatic` for cell colours. |
| FR-05.2 | Cell colour shall represent `(acceptance/100) * (1 − techDebt/100)`; green = high adoption + low debt. |
| FR-05.3 | Each cell shall carry a native `<title>` element with project, sprint, and score values. |
| FR-05.4 | When `heatmap_series` is empty or null the component shall show "No heatmap data yet". |
| FR-05.5 | The SVG shall carry `role="img"` and `aria-label` for accessibility. |

### FR-06 — Velocity/Quality dual-axis chart

| ID | Requirement |
|----|-------------|
| FR-06.1 | The chart shall use Recharts `ComposedChart` with a `Bar` for PR cycle time (left axis) and a `Line` for AI-induced vulnerabilities (right axis). |
| FR-06.2 | When `dual_axis_series` is empty or null the component shall show "No dual-axis data yet". |

### FR-07 — ROI Tracker widget

| ID | Requirement |
|----|-------------|
| FR-07.1 | The widget shall provide three `<input type="range">` sliders: manual hours (0–500), hourly rate ($0–$200), AI subscription cost ($0–$1,000). |
| FR-07.2 | `netSavings = manualHours × hourlyRate × month − subCost × month` for each of 12 months. |
| FR-07.3 | The projection shall be displayed as a Recharts `LineChart` with a `ReferenceLine` at y=0 (break-even). |
| FR-07.4 | Default values shall be: manualHours=80, hourlyRate=$75, subCost=$20/mo. |

### FR-08 — Retention Risk Assessment

| ID | Requirement |
|----|-------------|
| FR-08.1 | Risk shall be evaluated by `evaluateRetentionRisk(metrics)` using three boolean sub-criteria. |
| FR-08.2 | `flagged = high_ai_usage && (high_failure_rate || low_orchestration)` |
| FR-08.3 | A green "ok" banner shall appear when `flagged = false`; a red "flagged" banner when `true`. |
| FR-08.4 | A 3-row table shall display each criterion's current value, threshold, and Triggered/OK status. |

### FR-09 — CI Quality Gates panel

| ID | Requirement |
|----|-------------|
| FR-09.1 | The panel shall display all 9 gates: Build, Unit Tests, E2E Tests, Accessibility, Lint, Vulnerability Check, Lighthouse, Coverage, and Library Audit. |
| FR-09.2 | Each gate shall show ✅ (pass) or ❌ (fail) based on the corresponding `ci_native` field. |
| FR-09.3 | Unit Tests gate shall display `passed/total` count and coverage %. |
| FR-09.4 | E2E and Accessibility gates shall display their respective test counts. |

---

## 6. Acceptance Criteria

### AC-01 — Page load

| ID | Criterion |
|----|-----------|
| AC-01.1 | The page title matches `/AI.SDLC/i`. |
| AC-01.2 | An `<h1>` containing "AI SDLC Performance Dashboard" is visible within 5 s. |
| AC-01.3 | No "Error:" text is visible after a successful metrics load. |
| AC-01.4 | All 10 section headings (Tier 1–4, SPACE, Heatmap, Velocity/Quality, ROI Tracker, Retention Risk, CI Quality Gates) are visible within 10 s. |

### AC-02 — Dark mode

| ID | Criterion |
|----|-----------|
| AC-02.1 | Clicking the toggle changes the button text from "Dark" to "Light". |
| AC-02.2 | The root `<div>` gains class `dark` after one click. |
| AC-02.3 | Clicking the toggle again removes class `dark` and restores "Dark" label. |

### AC-03 — Accessibility (WCAG 2.1 AA)

| ID | Criterion |
|----|-----------|
| AC-03.1 | Zero axe-core WCAG 2.1 AA violations in light mode. |
| AC-03.2 | Zero axe-core WCAG 2.1 AA violations in dark mode. |
| AC-03.3 | Project selector and dark mode toggle are keyboard-focusable. |
| AC-03.4 | All headings follow a valid nesting order (no skipped levels). |

### AC-04 — ROI Tracker interactivity

| ID | Criterion |
|----|-----------|
| AC-04.1 | Three `<input type="range">` sliders are present. |
| AC-04.2 | Setting the manual hours slider to 200 causes "200h" to appear in the UI. |

---

## 7. Non-Functional Requirements

### NFR-01 — Test coverage

| Gate | Threshold |
|------|-----------|
| Statements | ≥ 80 % |
| Functions | ≥ 80 % |
| Branches | ≥ 75 % |
| Lines | ≥ 80 % |

### NFR-02 — Unit tests

All 99 unit tests in the `src/test/` suite must pass on every build.

### NFR-03 — E2E tests

All 35 behavioural Playwright tests (`e2e/app.spec.js`) must pass.

### NFR-04 — Accessibility tests

All 5 WCAG 2.1 AA Playwright tests (`e2e/accessibility.spec.js`) must pass.

### NFR-05 — Vulnerability scan

`npm audit --audit-level=high` must report zero high-severity vulnerabilities.

### NFR-06 — Build

`npm run build` must complete without errors and produce a valid dist artefact.

### NFR-07 — Performance

The dashboard shall reach Lighthouse Performance ≥ 80 on a simulated desktop connection.

### NFR-08 — Accessibility score

The dashboard shall achieve Lighthouse Accessibility ≥ 90.

---

## 8. Constraints & Assumptions

| ID | Constraint / Assumption |
|----|------------------------|
| C-01 | No backend — all data is static JSON served from the same GitHub Pages origin. |
| C-02 | No external UI framework — styling uses plain CSS with CSS custom properties only. |
| C-03 | Recharts is the only charting library; no additional chart libraries shall be added. |
| C-04 | `d3-scale` and `d3-scale-chromatic` are the only D3 modules permitted. |
| C-05 | The heatmap and dual-axis series grow by one entry per CI run; no backfill mechanism exists. |
| C-06 | Metrics fields with `is_mock: true` represent simulated data until the corresponding API (Copilot, Snyk, LinearB) is integrated. |
| C-07 | GitHub PAT (`SDLC_DASHBOARD_PAT`) with `repo` scope on this repository is required for each source project's CI to push metrics. |
| C-08 | The dashboard is a read-only consumer; it never writes to the metrics JSON files. |
