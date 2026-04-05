import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap.jsx'
import DualAxisChart from '../components/charts/DualAxisChart.jsx'
import RoiTrackerWidget from '../components/charts/RoiTrackerWidget.jsx'

// ── CorrelationHeatmap ──────────────────────────────────────────────────────

const HEATMAP_SERIES = [
  { project: 'roi-calculator', sprint: '2026-W13', ai_acceptance_rate: 72, technical_debt_ratio: 0.08 },
  { project: 'roi-calculator', sprint: '2026-W14', ai_acceptance_rate: 75, technical_debt_ratio: 0.06 },
]

describe('CorrelationHeatmap', () => {
  it('shows empty state when series is null', () => {
    render(<CorrelationHeatmap series={null} />)
    expect(screen.getByText(/No heatmap data yet/i)).toBeInTheDocument()
  })

  it('shows empty state when series is empty array', () => {
    render(<CorrelationHeatmap series={[]} />)
    expect(screen.getByText(/No heatmap data yet/i)).toBeInTheDocument()
  })

  it('renders an SVG when series has data', () => {
    const { container } = render(<CorrelationHeatmap series={HEATMAP_SERIES} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('SVG has accessible role and aria-label', () => {
    render(<CorrelationHeatmap series={HEATMAP_SERIES} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', expect.stringContaining('heatmap'))
  })

  it('renders project name as Y-axis label', () => {
    render(<CorrelationHeatmap series={HEATMAP_SERIES} />)
    expect(screen.getByText('roi-calculator')).toBeInTheDocument()
  })

  it('renders sprint labels (year prefix stripped)', () => {
    render(<CorrelationHeatmap series={HEATMAP_SERIES} />)
    expect(screen.getByText('W13')).toBeInTheDocument()
    expect(screen.getByText('W14')).toBeInTheDocument()
  })
})

// ── DualAxisChart ───────────────────────────────────────────────────────────

const DUAL_SERIES = [
  { sprint: '2026-W13', pr_cycle_time_hours: 4.2, ai_induced_vulnerabilities: 2.1 },
  { sprint: '2026-W14', pr_cycle_time_hours: 3.8, ai_induced_vulnerabilities: 1.5 },
]

describe('DualAxisChart', () => {
  it('shows empty state when series is null', () => {
    render(<DualAxisChart series={null} />)
    expect(screen.getByText(/No dual-axis data yet/i)).toBeInTheDocument()
  })

  it('shows empty state when series is empty array', () => {
    render(<DualAxisChart series={[]} />)
    expect(screen.getByText(/No dual-axis data yet/i)).toBeInTheDocument()
  })

  it('renders chart container when series has data', () => {
    const { container } = render(<DualAxisChart series={DUAL_SERIES} />)
    expect(container.querySelector('.recharts-wrapper, .recharts-responsive-container, div.card'))
      .toBeInTheDocument()
  })
})

// ── RoiTrackerWidget ────────────────────────────────────────────────────────

describe('RoiTrackerWidget', () => {
  it('renders three slider labels', () => {
    render(<RoiTrackerWidget />)
    expect(screen.getByText(/Manual hours saved/i)).toBeInTheDocument()
    expect(screen.getByText(/Hourly rate/i)).toBeInTheDocument()
    expect(screen.getByText(/AI subscription cost/i)).toBeInTheDocument()
  })

  it('renders three range inputs', () => {
    const { container } = render(<RoiTrackerWidget />)
    const sliders = container.querySelectorAll('input[type="range"]')
    expect(sliders).toHaveLength(3)
  })

  it('shows default value of 80h for manual hours', () => {
    render(<RoiTrackerWidget />)
    expect(screen.getByText('80h')).toBeInTheDocument()
  })

  it('updates manual hours display when slider changes', () => {
    render(<RoiTrackerWidget />)
    const slider = screen.getByLabelText(/Manual hours saved/i)
    fireEvent.change(slider, { target: { value: '120' } })
    expect(screen.getByText('120h')).toBeInTheDocument()
  })

  it('updates hourly rate display when slider changes', () => {
    render(<RoiTrackerWidget />)
    const slider = screen.getByLabelText(/Hourly rate/i)
    fireEvent.change(slider, { target: { value: '100' } })
    expect(screen.getByText('$100/h')).toBeInTheDocument()
  })

  it('renders chart container', () => {
    const { container } = render(<RoiTrackerWidget />)
    expect(container.querySelector('.card')).toBeInTheDocument()
  })
})
