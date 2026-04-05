import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardShell from '../components/layout/DashboardShell.jsx'

const MINIMAL_METRICS = {
  tier1_input:  { ai_acceptance_rate: { value: 72, is_mock: true }, boilerplate_reduction: { value: 45, is_mock: true } },
  tier2_process: { pr_cycle_time: { value: 4.5, is_mock: true }, flow_efficiency: { value: 0.62, is_mock: true } },
  tier3_output: { ai_change_failure_rate: { value: 3.2, is_mock: true }, security_remediation_speed: { value: 12, is_mock: true } },
  tier4_value:  { unit_cost_per_feature: { value: 280, is_mock: true }, token_roi: { value: 4.2, is_mock: true }, labor_arbitrage_value: { value: 12400, is_mock: true } },
  space_framework: {
    satisfaction:  { value: 4.2, is_mock: true },
    performance:   { value: 78,  is_mock: true },
    communication: { value: 3.8, is_mock: true },
    efficiency:    { value: 0.72, is_mock: false },
    activity: { commits_last_30d: { value: 42, is_mock: false } },
  },
  orchestration_value: { ratio: { value: 0.01 } },
  heatmap_series: [],
  dual_axis_series: [],
  ci_native: {
    build_status:  { value: 'pass' },
    unit_tests:    { passed: { value: 124 }, total: { value: 124 }, failed: { value: 0 }, coverage_lines: { value: 100 } },
    e2e_tests:     { passed: { value: 63 },  total: { value: 63 },  failed: { value: 0 }, coverage_lines: { value: 98 } },
    a11y_tests:    { passed: { value: 9 },   total: { value: 9 },   failed: { value: 0 } },
    lint_errors:   { value: 0 },
    vuln_check:    { total: { value: 0 } },
    lighthouse:    { performance: { value: 91 } },
  },
}

const defaultProps = {
  metrics:         null,
  loading:         false,
  error:           null,
  selectedProject: 'roi-calculator',
  onProjectChange: vi.fn(),
  darkMode:        false,
  onDarkModeToggle: vi.fn(),
}

describe('DashboardShell', () => {
  it('shows loading message while loading', () => {
    render(<DashboardShell {...defaultProps} loading={true} />)
    expect(screen.getByText(/loading metrics/i)).toBeInTheDocument()
  })

  it('shows error message when error is set', () => {
    render(<DashboardShell {...defaultProps} error="Failed to load" />)
    expect(screen.getByText(/Failed to load/)).toBeInTheDocument()
  })

  it('renders nothing for panels when metrics is null and not loading', () => {
    const { container } = render(<DashboardShell {...defaultProps} />)
    // NavBar should still render
    expect(screen.getByText('AI SDLC Performance Dashboard')).toBeInTheDocument()
    // No tier panels
    expect(container.querySelectorAll('.tier-grid')).toHaveLength(0)
  })

  it('renders all section headers when metrics are provided', () => {
    render(<DashboardShell {...defaultProps} metrics={MINIMAL_METRICS} />)
    expect(screen.getByText('Tier 1 — AI Input Metrics')).toBeInTheDocument()
    expect(screen.getByText('Tier 2 — Process Metrics')).toBeInTheDocument()
    expect(screen.getByText('Tier 3 — Output Quality')).toBeInTheDocument()
    expect(screen.getByText('Tier 4 — Business Value')).toBeInTheDocument()
    expect(screen.getByText('SPACE Framework')).toBeInTheDocument()
    expect(screen.getByText(/Correlation Heatmap/i)).toBeInTheDocument()
    expect(screen.getByText(/Velocity \/ Quality/i)).toBeInTheDocument()
    expect(screen.getByText('ROI Tracker')).toBeInTheDocument()
    expect(screen.getByText('Retention Risk Assessment')).toBeInTheDocument()
    expect(screen.getByText('CI Quality Gates')).toBeInTheDocument()
  })

  it('renders tier metric values from provided metrics', () => {
    render(<DashboardShell {...defaultProps} metrics={MINIMAL_METRICS} />)
    expect(screen.getAllByText('72%').length).toBeGreaterThan(0)
    expect(screen.getByText('91')).toBeInTheDocument() // lighthouse perf
  })
})
