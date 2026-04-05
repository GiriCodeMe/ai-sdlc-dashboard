import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Tier1Panel from '../components/tier/Tier1Panel.jsx'
import Tier2Panel from '../components/tier/Tier2Panel.jsx'
import Tier3Panel from '../components/tier/Tier3Panel.jsx'
import Tier4Panel from '../components/tier/Tier4Panel.jsx'

const t1 = {
  ai_acceptance_rate:   { value: 72, is_mock: false },
  boilerplate_reduction: { value: 45, is_mock: true },
}

const t2 = {
  pr_cycle_time:  { value: 4.5,  is_mock: true },
  flow_efficiency: { value: 0.62, is_mock: true },
}

const t3 = {
  ai_change_failure_rate:    { value: 3.2, is_mock: true },
  security_remediation_speed: { value: 12,  is_mock: true },
}

const t4 = {
  unit_cost_per_feature:    { value: 280,   is_mock: true },
  token_roi:                { value: 4.2,   is_mock: true },
  labor_arbitrage_value:    { value: 12400, is_mock: true },
  legacy_modernization_roi: { value: 0.38,  is_mock: true },
}

describe('Tier1Panel', () => {
  it('returns null when data is missing', () => {
    const { container } = render(<Tier1Panel data={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders acceptance rate value', () => {
    render(<Tier1Panel data={t1} />)
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('renders boilerplate reduction with MOCK badge', () => {
    render(<Tier1Panel data={t1} />)
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getAllByText('MOCK').length).toBeGreaterThan(0)
  })
})

describe('Tier2Panel', () => {
  it('returns null when data is missing', () => {
    const { container } = render(<Tier2Panel data={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders PR cycle time', () => {
    render(<Tier2Panel data={t2} />)
    expect(screen.getByText('4.5h')).toBeInTheDocument()
  })

  it('renders flow efficiency as percentage (0.62 → 62%)', () => {
    render(<Tier2Panel data={t2} />)
    expect(screen.getByText('62%')).toBeInTheDocument()
  })
})

describe('Tier3Panel', () => {
  it('returns null when data is missing', () => {
    const { container } = render(<Tier3Panel data={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders change failure rate', () => {
    render(<Tier3Panel data={t3} />)
    expect(screen.getByText('3.2%')).toBeInTheDocument()
  })

  it('renders security remediation speed', () => {
    render(<Tier3Panel data={t3} />)
    expect(screen.getByText('12h')).toBeInTheDocument()
  })
})

describe('Tier4Panel', () => {
  it('returns null when data is missing', () => {
    const { container } = render(<Tier4Panel data={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders unit cost per feature', () => {
    render(<Tier4Panel data={t4} />)
    expect(screen.getByText('$280')).toBeInTheDocument()
  })

  it('renders token ROI', () => {
    render(<Tier4Panel data={t4} />)
    expect(screen.getByText('4.2x')).toBeInTheDocument()
  })

  it('renders labor arbitrage with locale formatting', () => {
    render(<Tier4Panel data={t4} />)
    expect(screen.getByText('$12,400')).toBeInTheDocument()
  })

  it('renders legacy modernization ROI as percentage (0.38 → 38%)', () => {
    render(<Tier4Panel data={t4} />)
    expect(screen.getByText('38%')).toBeInTheDocument()
  })

  it('renders Legacy Modernization ROI card label', () => {
    render(<Tier4Panel data={t4} />)
    expect(screen.getByText('Legacy Modernization ROI')).toBeInTheDocument()
  })
})
