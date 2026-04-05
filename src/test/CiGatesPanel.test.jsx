import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CiGatesPanel from '../components/ci/CiGatesPanel.jsx'

function makeCi(overrides = {}) {
  return {
    build_status: { value: 'pass', gate: 'pass' },
    unit_tests: {
      passed:         { value: 124 },
      total:          { value: 124 },
      failed:         { value: 0   },
      coverage_lines: { value: 100 },
    },
    e2e_tests: {
      passed:         { value: 63 },
      total:          { value: 63 },
      failed:         { value: 0  },
      coverage_lines: { value: 98 },
    },
    a11y_tests: {
      passed: { value: 9 },
      total:  { value: 9 },
      failed: { value: 0 },
    },
    lint_errors: { value: 0 },
    vuln_check:  { total: { value: 0 } },
    lighthouse:  { performance: { value: 91 } },
    ...overrides,
  }
}

describe('CiGatesPanel', () => {
  it('returns null when ci prop is missing', () => {
    const { container } = render(<CiGatesPanel ci={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all 9 gate labels', () => {
    render(<CiGatesPanel ci={makeCi()} />)
    expect(screen.getByText('Build')).toBeInTheDocument()
    expect(screen.getByText('Unit Tests')).toBeInTheDocument()
    expect(screen.getByText('Unit Coverage (lines)')).toBeInTheDocument()
    expect(screen.getByText('E2E Tests')).toBeInTheDocument()
    expect(screen.getByText('E2E Coverage')).toBeInTheDocument()
    expect(screen.getByText('Accessibility')).toBeInTheDocument()
    expect(screen.getByText('Lint Errors')).toBeInTheDocument()
    expect(screen.getByText('Vuln Check')).toBeInTheDocument()
    expect(screen.getByText('Lighthouse Perf')).toBeInTheDocument()
  })

  it('shows ✅ for all passing gates', () => {
    render(<CiGatesPanel ci={makeCi()} />)
    const passing = screen.getAllByText('✅')
    expect(passing).toHaveLength(9)
  })

  it('shows ❌ when build fails', () => {
    render(<CiGatesPanel ci={makeCi({ build_status: { value: 'fail' } })} />)
    expect(screen.getByText('❌')).toBeInTheDocument()
  })

  it('shows ❌ when unit tests have failures', () => {
    render(<CiGatesPanel ci={makeCi({
      unit_tests: { passed: { value: 120 }, total: { value: 124 }, failed: { value: 4 }, coverage_lines: { value: 100 } },
    })} />)
    expect(screen.getAllByText('❌').length).toBeGreaterThan(0)
  })

  it('shows ❌ when unit coverage is below 95%', () => {
    render(<CiGatesPanel ci={makeCi({
      unit_tests: { passed: { value: 124 }, total: { value: 124 }, failed: { value: 0 }, coverage_lines: { value: 90 } },
    })} />)
    expect(screen.getAllByText('❌').length).toBeGreaterThan(0)
  })

  it('shows ❌ when lint errors are non-zero', () => {
    render(<CiGatesPanel ci={makeCi({ lint_errors: { value: 3 } })} />)
    expect(screen.getAllByText('❌').length).toBeGreaterThan(0)
  })

  it('shows ❌ when vulnerabilities are non-zero', () => {
    render(<CiGatesPanel ci={makeCi({ vuln_check: { total: { value: 2 } } })} />)
    expect(screen.getAllByText('❌').length).toBeGreaterThan(0)
  })

  it('shows ❌ when lighthouse perf is below 80', () => {
    render(<CiGatesPanel ci={makeCi({ lighthouse: { performance: { value: 75 } } })} />)
    expect(screen.getAllByText('❌').length).toBeGreaterThan(0)
  })

  it('shows E2E test counts', () => {
    render(<CiGatesPanel ci={makeCi()} />)
    expect(screen.getByText('63 / 63')).toBeInTheDocument()
  })

  it('shows a11y test counts', () => {
    render(<CiGatesPanel ci={makeCi()} />)
    expect(screen.getByText('9 / 9')).toBeInTheDocument()
  })

  it('shows unit coverage percentage', () => {
    render(<CiGatesPanel ci={makeCi()} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})
