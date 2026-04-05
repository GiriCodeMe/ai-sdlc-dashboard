import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RetentionRiskFlag from '../components/risk/RetentionRiskFlag.jsx'

function makeMetrics({ acceptance = 72, failure = 3.0, ratio = 0.01 } = {}) {
  return {
    tier1_input:        { ai_acceptance_rate:      { value: acceptance } },
    tier3_output:       { ai_change_failure_rate:  { value: failure   } },
    orchestration_value: { ratio:                  { value: ratio     } },
  }
}

describe('RetentionRiskFlag', () => {
  it('returns null when metrics is null', () => {
    const { container } = render(<RetentionRiskFlag metrics={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows ok banner when risk is not flagged', () => {
    render(<RetentionRiskFlag metrics={makeMetrics({ acceptance: 72, failure: 3.0, ratio: 0.01 })} />)
    expect(screen.getByText(/No retention risk detected/i)).toBeInTheDocument()
  })

  it('shows flagged banner when high usage + high failure rate', () => {
    render(<RetentionRiskFlag metrics={makeMetrics({ acceptance: 75, failure: 6.0, ratio: 0.01 })} />)
    expect(screen.getByText(/RETENTION RISK FLAGGED/i)).toBeInTheDocument()
  })

  it('shows flagged banner when high usage + low orchestration', () => {
    render(<RetentionRiskFlag metrics={makeMetrics({ acceptance: 80, failure: 2.0, ratio: 0.002 })} />)
    expect(screen.getByText(/RETENTION RISK FLAGGED/i)).toBeInTheDocument()
  })

  it('renders all three criteria rows', () => {
    render(<RetentionRiskFlag metrics={makeMetrics()} />)
    expect(screen.getByText(/High AI Usage/i)).toBeInTheDocument()
    expect(screen.getByText(/High Failure Rate/i)).toBeInTheDocument()
    expect(screen.getByText(/Low Orchestration Value/i)).toBeInTheDocument()
  })

  it('shows Triggered for met criteria and OK for unmet', () => {
    // high usage (72 ≥ 70) + low failure (3 < 5) + good orchestration (0.01 ≥ 0.005)
    render(<RetentionRiskFlag metrics={makeMetrics({ acceptance: 72, failure: 3.0, ratio: 0.01 })} />)
    const cells = screen.getAllByRole('cell')
    const statusCells = cells.filter(c => c.textContent === 'Triggered' || c.textContent === 'OK')
    const triggered = statusCells.filter(c => c.textContent === 'Triggered')
    const ok = statusCells.filter(c => c.textContent === 'OK')
    expect(triggered).toHaveLength(1) // only high_ai_usage triggered
    expect(ok).toHaveLength(2)
  })

  it('displays the current acceptance rate value', () => {
    render(<RetentionRiskFlag metrics={makeMetrics({ acceptance: 72 })} />)
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('displays the orchestration ratio formatted to 4 decimal places', () => {
    render(<RetentionRiskFlag metrics={makeMetrics({ ratio: 0.0123 })} />)
    expect(screen.getByText('0.0123')).toBeInTheDocument()
  })
})
