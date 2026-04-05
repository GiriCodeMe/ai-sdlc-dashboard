# AI-SDLC Dashboard — Claude Code Guide

## Project Context

React 18 + Vite 6 GitHub Pages app. Reads structured metrics JSON auto-published by source repos
(e.g. `roi-calculator`) and renders the 4-tier AI-enabled SDLC KPI matrix, SPACE framework cards,
correlation heatmap, dual-axis velocity/quality chart, ROI tracker widget, and retention risk flags.

**Live URL:** https://giricodeme.github.io/ai-sdlc-dashboard/

## Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18 (JSX, functional components, hooks) |
| Build | Vite 6 (`base: VITE_BASE_PATH ?? '/'`) |
| Charts | Recharts 2 — DualAxisChart, RoiTrackerWidget |
| Heatmap | Pure SVG + `d3-scale` + `d3-scale-chromatic` (no Recharts) |
| Tests | Vitest + Testing Library |
| Styling | CSS custom properties (no CSS framework) |

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` → http://localhost:5173 |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Unit tests | `npm test` |
| Unit tests + coverage | `npm run test:coverage` |

## Local Dev — Metrics Data

The app fetches `{BASE_URL}metrics/{project}.json` at runtime. For local dev, copy the metrics
file into `public/metrics/` so the fetch resolves:

```bash
cp metrics/roi-calculator.json public/metrics/roi-calculator.json
```

The `public/metrics/` directory is gitignored — never commit real metrics there. The `metrics/`
root directory is where CI pushes canonical JSON (committed to the repo).

## Project Structure

```
src/
  main.jsx
  App.jsx                       # selectedProject state, darkMode toggle, DashboardShell
  App.css                       # CSS custom properties; dark class overrides
  hooks/
    useMetrics.js               # fetch all KNOWN_PROJECTS metrics at load; returns { metrics, allMetrics, projects, loading, error }
  utils/
    retentionRisk.js            # evaluateRetentionRisk(metrics) — pure, tested
    formatters.js               # formatNumber(), formatPercent(), formatCurrency() — pure, tested
    heatmapLayout.js            # buildHeatmapGrid(series) → { cells, xLabels, yLabels } — pure, tested
  components/
    layout/
      DashboardShell.jsx        # Two-column grid; renders all panels in order
      NavBar.jsx                # <select> project switcher + dark mode button
      SectionHeader.jsx         # Tier heading + conditional MOCK DATA pill
    tier/
      TierCard.jsx              # Generic metric card — value, label, unit, isMock, trend
      Tier1Panel.jsx            # tier1_input (ai_acceptance_rate, boilerplate_reduction)
      Tier2Panel.jsx            # tier2_process (pr_cycle_time, flow_efficiency)
      Tier3Panel.jsx            # tier3_output (ai_change_failure_rate, security_remediation_speed)
      Tier4Panel.jsx            # tier4_value (unit_cost_per_feature, token_roi, labour_arbitrage_value)
    space/
      SpacePanel.jsx            # SPACE 5-dimension grid; CSS progress bar per score
    charts/
      CorrelationHeatmap.jsx    # Pure SVG; color = d3 RdYlGn scale on (acceptance/tech_debt)
      DualAxisChart.jsx         # Recharts ComposedChart — Bar (pr_cycle_time) + Line (vulnerabilities)
      RoiTrackerWidget.jsx      # Three sliders + Recharts LineChart; ReferenceLine y=0 break-even
    risk/
      RetentionRiskFlag.jsx     # Green/red banner; 3-row sub-criteria table
    ci/
      CiGatesPanel.jsx          # Pass/fail grid for 9 CI gates; ✅/❌/⏸ icons
  test/
    formatters.test.js
    heatmapLayout.test.js
    retentionRisk.test.js
metrics/
  .gitkeep                      # CI from roi-calculator pushes JSON here
.github/workflows/
  deploy.yml                    # Build + GitHub Pages deploy on push to main
```

## Critical Rules

- **Read the Metrics JSON Schema** (in README.md) before touching any component — every leaf field
  is `{ value, unit, source, is_mock }`, never a plain number
- **Always use `.value`** when reading a metric field in a component (e.g. `ci.unit_tests.passed.value`, not `ci.unit_tests.passed`)
- **No CSS frameworks** — CSS custom properties only
- **No additional chart libraries** — Recharts for all charts; d3-scale/d3-scale-chromatic for heatmap only
- **Functional components only** — no class components
- **Pure utils are tested** — `retentionRisk.js`, `formatters.js`, `heatmapLayout.js` each have a `.test.js`; keep them covered when changing

## Coding Conventions

- One component per file, PascalCase filename matching default export
- Metric leaf fields accessed as `field?.value ?? fallback` — never assume plain number
- Mock badge: pass `isMock={field.is_mock}` to `<TierCard>` so the orange pill renders automatically
- `evaluateRetentionRisk` in `retentionRisk.js` is the single source of truth for risk logic; do not duplicate thresholds in components

## Key Facts

- **Retention risk thresholds**: `high_ai_usage` ≥ 70% acceptance; `high_failure_rate` ≥ 5.0% failure; `low_orchestration` ratio < 0.005
- **Heatmap color scale**: `d3.scaleSequential(interpolateRdYlGn)` on score `= (acceptance/100) * (1 - techDebt/100)`; 1.0 = green, 0 = red
- **Adding a new project**: add the project key to `KNOWN_PROJECTS` in `useMetrics.js`; that project's CI must push `metrics/{project}.json`
- **Local metrics** live in `metrics/` (committed); `public/metrics/` is for dev convenience only (gitignored)

## Examples

**Reading a metric value safely**
```
✅ DO:  ci.unit_tests?.passed?.value ?? '?'
❌ DON'T: ci.unit_tests.passed   ← field is { value, unit, source, is_mock }, not a number
```

**Rendering a TierCard**
```
✅ DO:  <TierCard label="AI Acceptance" value={m.tier1_input.ai_acceptance_rate.value} unit="%" isMock={m.tier1_input.ai_acceptance_rate.is_mock} />
❌ DON'T: Inline the value + mock logic in the panel — that's TierCard's job
```

**Adding a new project to the dashboard**
```
✅ DO:  Add the project key to KNOWN_PROJECTS in useMetrics.js; ensure its CI publishes metrics/*.json
❌ DON'T: Hardcode project-specific rendering logic — all projects share the same component tree
```
