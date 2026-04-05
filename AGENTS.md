# AI-SDLC Dashboard — Feature Requirements

## Completed Features

1. **Metrics pipeline** — `useMetrics.js` fetches `{BASE_URL}metrics/{project}.json` for every project in `KNOWN_PROJECTS` on mount. Returns `{ metrics, allMetrics, projects, loading, error }`. Metrics are pushed to the `metrics/` directory by each source repo's CI via `SDLC_DASHBOARD_PAT`.

2. **4-Tier KPI matrix** — Four panels rendered in order: Tier 1 (AI Input), Tier 2 (Process), Tier 3 (Output Quality), Tier 4 (Business Value). Each panel uses `<TierCard>` cards. Sections marked with `<SectionHeader hasMockData={true}>` until all fields are live.

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
      Tier4Panel.jsx            # tier4_value: unit_cost_per_feature, token_roi, labour_arbitrage_value
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
  .gitkeep                      # CI pushes {project}.json here; committed to repo
.github/workflows/
  deploy.yml                    # npm test → build (VITE_BASE_PATH) → copy metrics → Pages deploy
```

## Non-Functional Mandates

**When implementing or modifying any feature, run the check below before considering the task done.**

| # | Check | Command | Pass Condition |
|---|-------|---------|----------------|
| 1 | **Unit tests** | `npm test` | All tests pass (0 failures) |
| 2 | **Unit coverage** | `npm run test:coverage` | ≥ 80% statements / functions / branches / lines |
| 3 | **Build** | `npm run build` | Compiles without errors |

### Rules

- If any check fails, fix it before marking the task done.
- When adding or modifying a pure util (`retentionRisk.js`, `formatters.js`, `heatmapLayout.js`), update its test file in the same change.
- New utils that are pure and independently testable must have a corresponding `src/test/{util}.test.js`.
- Components are not unit-tested individually — test behaviour through pure utils and integration via the browser.
- Never use `npm audit --force` without confirming with the user.

Report results at the end of every build:

```
✅ Unit tests   — 16/16 passed
✅ Coverage     — 92% stmts / 88% branches
✅ Build        — dist/ produced without errors
```

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
  ai_acceptance_rate       { value: <number>, unit: "%", ... }
  boilerplate_reduction    { value: <number>, unit: "%", ... }

tier2_process
  pr_cycle_time            { value: <number>, unit: "hours", ... }
  flow_efficiency          { value: <number>, unit: "%", ... }

tier3_output
  ai_change_failure_rate   { value: <number>, unit: "%", ... }
  security_remediation_speed { value: <number>, unit: "hours", ... }

tier4_value
  unit_cost_per_feature    { value: <number>, unit: "USD", ... }
  token_roi                { value: <number>, unit: "x", ... }
  labour_arbitrage_value   { value: <number>, unit: "USD/mo", ... }

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

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f1f5f9` | Page background |
| `--bg-card` | `#ffffff` | Card background |
| `--bg-alt` | `#f8fafc` | Alternating row background |
| `--text` | `#1e293b` | Primary text |
| `--text-muted` | `#475569` | Labels, secondary text |
| `--positive` | `#15803d` | Positive trend, pass state |
| `--negative` | `#dc2626` | Negative trend, fail state |
| `--accent` | `#2563eb` | Borders, focus rings, links |

### Dark Theme (`.dark`)

| Token | Value |
|-------|-------|
| `--bg` | `#0f172a` |
| `--bg-card` | `#1e293b` |
| `--text` | `#f1f5f9` |
| `--text-muted` | `#94a3b8` |
| `--positive` | `#4ade80` |
| `--negative` | `#f87171` |

## CI / Deployment

`.github/workflows/deploy.yml` — triggers on push to `main` and `workflow_dispatch`:

1. `npm ci` — install deps
2. `npm test` — unit tests must pass
3. `npm run build` with `VITE_BASE_PATH=/ai-sdlc-dashboard/`
4. `cp metrics/*.json dist/metrics/` — embed latest metrics in Pages artifact
5. `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`

**Secret required on source repos:** `SDLC_DASHBOARD_PAT` — GitHub PAT with `repo` scope on `GiriCodeMe/ai-sdlc-dashboard`, used by the `publish-metrics` CI job to push `metrics/{project}.json`.

## Adding a New Source Project

1. In `src/hooks/useMetrics.js`, add the project key to `KNOWN_PROJECTS`.
2. In the source repo, add a `publish-metrics` CI job (mirror of `roi-calculator`'s job) that runs `scripts/collect-metrics.js` and pushes `metrics/{project}.json` to this repo.
3. No component changes needed — all panels read from the selected project's metrics object.
