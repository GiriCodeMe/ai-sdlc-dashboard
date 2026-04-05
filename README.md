# AI-SDLC Performance Dashboard

A GitHub Pages analytics dashboard that visualises the 4-tier AI-enabled SDLC KPI matrix for
Claude-built projects. Metrics are auto-published via CI from each source repo and consumed here
at runtime — no manual data entry required.

**Live:** https://giricodeme.github.io/ai-sdlc-dashboard/

## What It Shows

| Panel | Description |
|-------|-------------|
| **Tier 1 — Input** | AI acceptance rate, boilerplate reduction |
| **Tier 2 — Process** | PR cycle time, flow efficiency |
| **Tier 3 — Output** | AI change failure rate, security remediation speed |
| **Tier 4 — Value** | Unit cost per feature, token ROI, labour arbitrage |
| **SPACE Framework** | Satisfaction · Performance · Activity · Communication · Efficiency |
| **CI Quality Gates** | Pass/fail grid for 9 gates (build, unit tests, coverage, E2E, a11y, lint, vuln, Lighthouse) |
| **Correlation Heatmap** | SVG heatmap — AI adoption vs technical debt across sprints |
| **Dual-Axis Chart** | PR cycle time (bars) vs AI-induced vulnerabilities (line) over time |
| **ROI Tracker Widget** | Slider-driven 12-month savings projection |
| **Retention Risk Flag** | Green/red banner with sub-criteria breakdown |

Mock fields are labelled with an orange `MOCK` pill; they become live once the upstream API is wired.

## Architecture

```
roi-calculator (CI)                        ai-sdlc-dashboard (GitHub Pages)
────────────────────────────               ──────────────────────────────────
scripts/collect-metrics.js                 src/
  ↓ writes                                   hooks/useMetrics.js  ← fetches at runtime
metrics/roi-calculator.json                metrics/roi-calculator.json
  ↓ git push via SDLC_DASHBOARD_PAT
```

Adding a second project: add the same `publish-metrics` CI job to that repo pointing to this
dashboard. `useMetrics.js` lists known projects in `KNOWN_PROJECTS`.

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

Copy `metrics/roi-calculator.json` into `public/metrics/` for local dev so the fetch succeeds:

```bash
cp metrics/roi-calculator.json public/metrics/roi-calculator.json
```

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Unit tests | `npm test` |
| Unit tests + coverage | `npm run test:coverage` |

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`:
1. Runs `npm test`
2. Builds with `VITE_BASE_PATH=/ai-sdlc-dashboard/`
3. Copies `metrics/*.json` into `dist/metrics/`
4. Deploys to GitHub Pages via `actions/upload-pages-artifact` + `actions/deploy-pages`

## Metrics JSON Schema

Every source project pushes `metrics/{project}.json`. Top-level keys:

```
meta                  project, repo, collected_at, ci_run_id, schema_version
tier1_input           ai_acceptance_rate, boilerplate_reduction
tier2_process         pr_cycle_time, flow_efficiency
tier3_output          ai_change_failure_rate, security_remediation_speed
tier4_value           unit_cost_per_feature, token_roi, labour_arbitrage_value
space_framework       satisfaction, performance, activity, communication, efficiency
orchestration_value   complex_modules_managed, manual_lines_written, ratio
retention_risk        flagged, evaluation.{high_ai_usage, high_failure_rate, low_orchestration_value}
ci_native             build_status, unit_tests, e2e_tests, a11y_tests, lint_errors, vuln_check, lighthouse
heatmap_series        [ { project, sprint, ai_acceptance_rate, technical_debt_ratio } ]
dual_axis_series      [ { sprint, pr_cycle_time_hours, ai_induced_vulnerabilities } ]
```

Every leaf field is `{ value, unit, source, is_mock }`. Dashboard shows an orange `MOCK` pill
when `is_mock: true`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18, JSX, functional components |
| Build | Vite 6 |
| Charts | Recharts 2 (DualAxisChart, RoiTrackerWidget) |
| Heatmap | Pure SVG + d3-scale + d3-scale-chromatic (RdYlGn) |
| Tests | Vitest + Testing Library |
| Styling | CSS custom properties (no CSS framework) |
| Deployment | GitHub Pages via Actions |

## Project Structure

```
src/
  main.jsx
  App.jsx                       # Project selector, dark mode, DashboardShell
  App.css                       # CSS custom property tokens + dark theme
  hooks/
    useMetrics.js               # Fetch + parse all metrics/*.json at runtime
  utils/
    retentionRisk.js            # evaluateRetentionRisk(metrics) — pure function
    formatters.js               # Shared number/percent/currency formatters
    heatmapLayout.js            # Build SVG cell grid from heatmap_series
  components/
    layout/
      DashboardShell.jsx        # Two-column grid, renders all panels
      NavBar.jsx                # Project selector + dark mode toggle
      SectionHeader.jsx         # Tier heading + optional MOCK DATA pill
    tier/
      TierCard.jsx              # Metric card (value, label, unit, trend, mock badge)
      Tier1Panel.jsx / Tier2Panel.jsx / Tier3Panel.jsx / Tier4Panel.jsx
    space/
      SpacePanel.jsx            # SPACE 5-dimension grid with CSS progress bars
    charts/
      CorrelationHeatmap.jsx    # Pure SVG heatmap (d3-scale-chromatic RdYlGn)
      DualAxisChart.jsx         # Recharts ComposedChart (Bar + Line, two Y axes)
      RoiTrackerWidget.jsx      # Sliders + Recharts LineChart with break-even line
    risk/
      RetentionRiskFlag.jsx     # Green/red banner + 3-row sub-criteria table
    ci/
      CiGatesPanel.jsx          # Pass/fail grid for 9 CI gates
metrics/
  .gitkeep                      # roi-calculator CI pushes JSON here
.github/workflows/
  deploy.yml                    # Build + GitHub Pages deploy
```
