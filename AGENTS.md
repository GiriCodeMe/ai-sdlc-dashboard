# AI-SDLC Dashboard — Feature Requirements

## Completed Features

1. **Metrics pipeline** — `useMetrics.js` fetches `{BASE_URL}metrics/{project}.json` for every project in `KNOWN_PROJECTS` on mount. Returns `{ metrics, allMetrics, projects, loading, error }`. Metrics are pushed to the `metrics/` directory by each source repo's CI via `SDLC_DASHBOARD_PAT`.

2. **4-Tier KPI matrix** — Four panels rendered in order: Tier 1 (AI Input), Tier 2 (Process), Tier 3 (Output Quality), Tier 4 (Business Value). Each panel uses `<TierCard>` cards. Tier4Panel renders 4 KPIs: Unit Cost/Feature, Token ROI, Labor Arbitrage Value, and Legacy Modernization ROI. Sections marked with `<SectionHeader hasMockData={true}>` until all fields are live.

3. **TierCard** — Generic metric card with `label`, `value`, `unit`, `isMock`, `colorClass`, and optional `trend` (`'up'` / `'down'`). Shows an orange `MOCK` pill when `isMock={true}`.

4. **SPACE Framework panel** — Five dimensions (Satisfaction, Performance, Activity, Communication, Efficiency) displayed as labelled rows with a CSS progress bar (0–5 score) and numeric value.

5. **Correlation Heatmap** — Pure SVG chart built with `d3-scale` + `d3-scale-chromatic`. X axis = sprint (ISO week), Y axis = project name. Cell color uses `scaleSequential(interpolateRdYlGn)` on score `= (ai_acceptance_rate/100) * (1 - technical_debt_ratio)`. Score 1.0 = green (high adoption, low debt); 0 = red. Native SVG `<title>` per cell for tooltip. Data via `buildHeatmapLayout(series)` from `heatmapLayout.js`.

6. **Dual-Axis Chart** — Recharts `ComposedChart` with `Bar` (PR cycle time, left Y axis) and `Line` (AI-induced vulnerabilities, right Y axis). Two `<YAxis>` components, `<CartesianGrid>`, `<Tooltip>`, `<Legend>`. Wrapped in `<ResponsiveContainer width="100%" height={300}>`.

7. **ROI Tracker Widget** — Three `<input type="range">` sliders: manual hours saved (0–500), hourly rate ($0–$200), AI subscription cost ($0–$1000). `netSavings = manualHours * hourlyRate - subCost`. 12-month projection array fed to a Recharts `<LineChart>`. `<ReferenceLine y={0} strokeDasharray="6 3" />` for break-even.

8. **Retention Risk Flag** — Green banner if `flagged === false`, red banner if `flagged === true`. Three sub-criteria rows: High AI Usage (≥70%), High Failure Rate (≥5%), Low Orchestration Value (<0.005 ratio). Logic delegated entirely to `evaluateRetentionRisk(metrics)` in `retentionRisk.js`.

9. **CI Quality Gates panel** — 9-gate pass/fail grid with ✅ / ❌ / ⏸ icons. Gates: Build, Unit Tests, Unit Coverage (lines), E2E Tests, E2E Coverage, Accessibility, Lint Errors, Vuln Check, Lighthouse Perf. Pass thresholds: unit coverage ≥95%, E2E coverage ≥79%, Lighthouse ≥80, lint errors = 0, vuln = 0.

10. **Dark mode** — `App.jsx` toggles a `darkMode` boolean; `<div className={darkMode ? 'dark' : ''}>` wraps everything. CSS `.dark` class overrides custom property tokens in `App.css`.

11. **Project selector** — `<NavBar>` renders a `<select>` listing all projects. Changing selection calls `onProjectChange`; `App.jsx` passes the new key to `useMetrics` which returns the right slice from `metricsMap`.

## Layout

```
NavBar (project selector + dark mode toggle)
└── main.dashboard-content
    ├── Tier 1 — AI Input Metrics          (Tier1Panel)
    ├── Tier 2 — Process Metrics            (Tier2Panel)
    ├── Tier 3 — Output Quality             (Tier3Panel)
    ├── Tier 4 — Business Value             (Tier4Panel)
    ├── SPACE Framework                     (SpacePanel)
    ├── Correlation Heatmap                 (CorrelationHeatmap)
    ├── Velocity / Quality Dual-Axis Chart  (DualAxisChart)
    ├── ROI Tracker                         (RoiTrackerWidget)
    ├── Retention Risk Assessment           (RetentionRiskFlag)
    └── CI Quality Gates                   (CiGatesPanel)
```

## File Structure

```
src/
  main.jsx
  App.jsx                       # selectedProject + darkMode state; renders DashboardShell
  App.css                       # CSS custom property tokens; .dark overrides
  hooks/
    useMetrics.js               # fetch + parse all KNOWN_PROJECTS metrics/*.json
  utils/
    retentionRisk.js            # evaluateRetentionRisk(metrics) — pure function
    formatters.js               # formatCurrency, formatPercent, formatNumber, formatScore, formatHours, formatRatio
    heatmapLayout.js            # buildHeatmapLayout(series) → { cells, sprints, projects }
  components/
    layout/
      DashboardShell.jsx        # All panels in order; handles loading/error states
      NavBar.jsx                # Project <select> + dark mode button
      SectionHeader.jsx         # Section heading + optional MOCK DATA pill
    tier/
      TierCard.jsx              # Generic metric card (label, value, unit, isMock, trend)
      Tier1Panel.jsx            # tier1_input: ai_acceptance_rate, boilerplate_reduction
      Tier2Panel.jsx            # tier2_process: pr_cycle_time, flow_efficiency
      Tier3Panel.jsx            # tier3_output: ai_change_failure_rate, security_remediation_speed
      Tier4Panel.jsx            # tier4_value: unit_cost_per_feature, token_roi, labor_arbitrage_value, legacy_modernization_roi (optional)
    space/
      SpacePanel.jsx            # SPACE 5-dimension grid with CSS progress bars
    charts/
      CorrelationHeatmap.jsx    # Pure SVG heatmap — d3-scale-chromatic RdYlGn
      DualAxisChart.jsx         # Recharts ComposedChart (Bar + Line, two Y axes)
      RoiTrackerWidget.jsx      # Sliders + Recharts LineChart; ReferenceLine break-even
    risk/
      RetentionRiskFlag.jsx     # Green/red banner + 3-row sub-criteria table
    ci/
      CiGatesPanel.jsx          # 9-gate pass/fail grid
  test/
    retentionRisk.test.js       # 5 tests — thresholds, flag logic, edge cases
    formatters.test.js          # 6 tests — all formatter functions
    heatmapLayout.test.js       # 5 tests — empty/null, sprints, projects, score, null cells
metrics/
  {project}/
    AIKPI.json                  # Standard file name; CI pushes metrics/{project}/AIKPI.json
.github/workflows/
  deploy.yml                    # npm test → build (VITE_BASE_PATH) → copy metrics → Pages deploy
```

## Non-Functional Mandates — Run on Every Build

**When the instruction is "build" (or any feature implementation), always run all five checks below in order before considering the task done. A build is not complete until all five pass.**

| # | Check | Command | Pass Condition |
|---|-------|---------|----------------|
| 1 | **Unit tests + coverage** | `npm run test:coverage` | 101/101 tests pass · stmts/fns/lines ≥ 80% · branches ≥ 75% |
| 2 | **E2E tests** | `npm run test:e2e` | All 35 Playwright behavioural tests pass |
| 3 | **Accessibility** | `npm run test:a11y` | 0 axe-core WCAG 2.1 AA violations |
| 4 | **Vulnerability scan** | `npm audit --audit-level=high` | 0 high-severity advisories |
| 5 | **Library audit** | `npm audit` | No high or critical severity advisories |

### Rules

- If any check fails, **fix the issue before marking the build done** — do not skip or defer.
- When adding a new util or component, write at least one unit test for it in the same build step.
- When adding new UI behaviour (new page element, interaction, or validation), add an E2E test in `e2e/app.spec.js`.
- When adding new visible elements, verify WCAG 2.1 AA colour contrast (≥4.5:1 for normal text) before committing.
- E2E tests use the dev server (`npm run dev` on port 5174) — `npm run test:e2e` auto-starts it via the `webServer` block in `playwright.config.js`.
- Never use `npm audit --force` or `npm audit fix --force` without confirming with the user.
- Report all five check results to the user at the end of every build in this format:

```
✅ Unit tests + coverage — 101/101 passed, 92% stmts / 78% branches
✅ E2E tests             — 35/35 passed
✅ Accessibility         — 0 WCAG 2.1 AA violations
✅ npm audit             — 0 vulnerabilities
✅ Lib audit             — 0 high/critical advisories
```

## CI Gates (`.github/workflows/ci.yml`)

5 gates run automatically on every push/PR to `main` (see CI / Deployment section for full detail):

| Gate | Check | Threshold |
|------|-------|-----------|
| 1 | Build | Compiles without errors |
| 2 | Unit Tests & Coverage | 101/101 pass · stmts/fns/lines ≥ 80% · branches ≥ 75% |
| 3 | E2E Tests (Playwright) | All 35 behavioural tests pass |
| 4 | Accessibility — WCAG 2.1 AA | 0 axe-core violations (light + dark mode) |
| 5 | Vulnerability Check | 0 high-severity advisories |

A Go/No-Go report is written to the GitHub Actions Job Summary after every run, with collapsible sections for Unit, E2E, and Accessibility results. If any gate fails, the job exits non-zero (**No-Go**).

## Metrics JSON Schema

Every leaf field is `{ value, unit, source, is_mock }` — **never a plain number**.

```
meta
  project          { value: "roi-calculator", ... }
  repo             { value: "GiriCodeMe/roi-calculator", ... }
  collected_at     { value: "<ISO timestamp>", ... }
  ci_run_id        { value: "<run id>", ... }
  schema_version   { value: "1.0", ... }

tier1_input
  ai_acceptance_rate       { value: <number>, unit: "%", ... }        ← mock; needs Copilot API
  boilerplate_reduction    { value: <number>, unit: "%", ... }        ← mock; needs Copilot API
  ai_commit_ratio          { value: <number>, unit: "%", is_mock: false, ai_commits, total_commits }  ← live; derived from git log Co-Authored-By

tier2_process
  pr_cycle_time            { value: <number>, unit: "hours", ... }
  flow_efficiency          { value: <number>, unit: "%", ... }

tier3_output
  ai_change_failure_rate   { value: <number>, unit: "%", ... }
  security_remediation_speed { value: <number>, unit: "hours", ... }

tier4_value
  unit_cost_per_feature    { value: <number>, unit: "USD", ... }
  token_roi                { value: <number>, unit: "x", ... }
  labor_arbitrage_value    { value: <number>, unit: "USD/mo", ... }
  legacy_modernization_roi { value: <number>, unit: "ratio", ... }  ← displayed as %; formula: AI refactor cost ÷ manual rewrite cost

space_framework
  satisfaction    { value: <0–5>, unit: "score", ... }
  performance     { value: <0–5>, unit: "score", ... }
  activity        { value: <0–5>, unit: "score", ... }
  communication   { value: <0–5>, unit: "score", ... }
  efficiency      { value: <0–5>, unit: "score", ... }

orchestration_value
  complex_modules_managed  { value: <number>, unit: "count", ... }
  manual_lines_written     { value: <number>, unit: "lines", ... }
  ratio                    { value: <number>, unit: "ratio", ... }

retention_risk
  flagged                  { value: true|false, ... }
  evaluation
    high_ai_usage          { value: true|false, ... }
    high_failure_rate      { value: true|false, ... }
    low_orchestration_value { value: true|false, ... }

ci_native
  build_status             { value: "pass"|"fail", ... }
  unit_tests
    total     { value: <number>, ... }
    passed    { value: <number>, ... }
    failed    { value: <number>, ... }
    coverage_lines { value: <number>, unit: "%", ... }
  e2e_tests
    total     { value: <number>, ... }
    passed    { value: <number>, ... }
    failed    { value: <number>, ... }
    coverage_lines { value: <number>, unit: "%", ... }
  a11y_tests
    total     { value: <number>, ... }
    passed    { value: <number>, ... }
    failed    { value: <number>, ... }
  lint_errors              { value: <number>, unit: "count", ... }
  vuln_check               { value: <number>|{ total: {...} }, unit: "count", ... }
  lighthouse
    performance            { value: <number>, unit: "score", ... }
    accessibility          { value: <number>, unit: "score", ... }
    best_practices         { value: <number>, unit: "score", ... }

heatmap_series   — append-only array
  [ { project, sprint, ai_acceptance_rate, technical_debt_ratio }, ... ]

dual_axis_series — append-only array
  [ { sprint, pr_cycle_time_hours, ai_induced_vulnerabilities }, ... ]
```

## Retention Risk Logic

Implemented in `src/utils/retentionRisk.js`. Single source of truth — do not duplicate thresholds elsewhere.

```js
high_ai_usage          = metrics.tier1_input.ai_acceptance_rate.value >= 70
high_failure_rate      = metrics.tier3_output.ai_change_failure_rate.value >= 5.0
low_orchestration      = metrics.orchestration_value.ratio.value < 0.005
flagged                = high_ai_usage && (high_failure_rate || low_orchestration)
```

**Threshold rationale:**
- 70% acceptance = DORA "heavy AI adopter" threshold
- 5.0% failure rate = DORA Elite upper bound for change failure rate
- 0.005 ratio = fewer than 1 complex module per 200 manual lines

## Design Tokens

### Light Theme (`:root`)

| Token | Value | Usage | Contrast |
|-------|-------|-------|---------|
| `--bg` | `#f1f5f9` | Page background | — |
| `--bg-card` | `#ffffff` | Card / modal background | — |
| `--bg-alt` | `#f8fafc` | Table stripe, tile background | — |
| `--text` | `#1e293b` | Primary text | 15.4:1 on `--bg` |
| `--text-muted` | `#475569` | Labels, secondary text | 6.98:1 on `--bg` |
| `--positive` | `#166534` | Positive indicators, ok banners | 6.82:1 on `--bg-alt` ✅ |
| `--negative` | `#b91c1c` | Negative indicators, error banners | 5.93:1 on `#fef2f2` ✅ |
| `--mock-badge` | `#c2410c` | MOCK pill text | 5.17:1 on white ✅ |
| `--accent-a` | `#2563eb` | Tier 1/2 card accent border | — |
| `--accent-b` | `#7c3aed` | Tier 3/4 card accent border | — |

### Dark Theme (`.dark`)

| Token | Value | Contrast |
|-------|-------|---------|
| `--bg` | `#0f172a` | — |
| `--bg-card` | `#1e293b` | — |
| `--bg-alt` | `#162032` | — |
| `--text` | `#f1f5f9` | 16.5:1 on `--bg` |
| `--text-muted` | `#94a3b8` | 5.14:1 on `--bg-card` |
| `--positive` | `#4ade80` | 7.8:1 on `--bg-card` ✅ |
| `--negative` | `#f87171` | 7.2:1 on `--bg-card` ✅ |
| `--accent-a` | `#60a5fa` | 5.76:1 on `--bg-card` ✅ |
| `--accent-b` | `#a78bfa` | 5.4:1 on `--bg-card` ✅ |

**Important:** The `.dark` rule must set `color: var(--text); background: var(--bg)` directly — without this, `<td>` elements inherit the computed light-mode colour from `body`, causing ~1.2:1 contrast failure.

## CI / Deployment

`.github/workflows/ci.yml` — triggers on push to `main`, pull requests, and `workflow_dispatch`.

**`quality-gates` job** (runs on every push/PR — gates use `continue-on-error: true`, `Enforce Gates` step fails the job if any gate fails):

| # | Gate | Command | Pass condition |
|---|------|---------|----------------|
| 1 | Build | `npm run build` | Exit 0 |
| 2 | Unit Tests + Coverage | `npm run test:coverage` | 101/101 pass · stmts/fns/lines ≥ 80% · branches ≥ 75% |
| 3 | E2E Tests (Playwright) | `npm run test:e2e` | 35/35 pass |
| 4 | Accessibility — WCAG 2.1 AA | `npm run test:a11y` | 0 axe violations |
| 5 | Vulnerability Check | `npm audit --audit-level=high` | 0 high-severity advisories |

A Go/No-Go report is written to `GITHUB_STEP_SUMMARY` with collapsible sections for each test suite.

**`build` + `deploy` jobs** — run only on `main`, gated behind `quality-gates`:

1. `npm ci` + `npm run build` with `VITE_BASE_PATH=/ai-sdlc-dashboard/`
2. `cp metrics/*.json dist/metrics/` — embed latest metrics in Pages artifact
3. `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`

**Secret required on source repos:** `SDLC_DASHBOARD_PAT` — GitHub PAT with `repo` scope on `GiriCodeMe/ai-sdlc-dashboard`, used by the `publish-metrics` CI job to push `metrics/{project}.json`.

## Adding a New Source Project

1. In `src/hooks/useMetrics.js`, add the project key to `KNOWN_PROJECTS`.
2. In the source repo, add a `publish-metrics` CI job (mirror of `roi-calculator`'s job) that runs `scripts/collect-metrics.js` and pushes `metrics/{project}/AIKPI.json` to this repo.
3. No component changes needed — all panels read from the selected project's metrics object.
