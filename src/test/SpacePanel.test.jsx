import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SpacePanel from '../components/space/SpacePanel.jsx'

const makeData = (overrides = {}) => ({
  satisfaction:  { value: 4.2, is_mock: true },
  performance:   { value: 78,  is_mock: true },
  communication: { value: 3.8, is_mock: true },
  efficiency:    { value: 0.72, is_mock: false },
  activity: {
    commits_last_30d: { value: 42, is_mock: false },
  },
  ...overrides,
})

describe('SpacePanel', () => {
  it('returns null when data is missing', () => {
    const { container } = render(<SpacePanel data={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all five SPACE dimension labels', () => {
    render(<SpacePanel data={makeData()} />)
    expect(screen.getByText('Satisfaction')).toBeInTheDocument()
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByText('Communication')).toBeInTheDocument()
    expect(screen.getByText('Efficiency')).toBeInTheDocument()
    expect(screen.getByText('Activity')).toBeInTheDocument()
  })

  it('renders satisfaction as score/5', () => {
    render(<SpacePanel data={makeData()} />)
    expect(screen.getByText('4.2/5')).toBeInTheDocument()
  })

  it('renders performance as percentage', () => {
    render(<SpacePanel data={makeData()} />)
    expect(screen.getByText('78%')).toBeInTheDocument()
  })

  it('renders efficiency as percentage (0.72 → 72%)', () => {
    render(<SpacePanel data={makeData()} />)
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('renders activity commit count', () => {
    render(<SpacePanel data={makeData()} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders activity as 0 when activity data is missing', () => {
    render(<SpacePanel data={makeData({ activity: null })} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows MOCK badge for mock fields', () => {
    render(<SpacePanel data={makeData()} />)
    const badges = screen.getAllByText('MOCK')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('does not show MOCK badge for live efficiency field', () => {
    const data = makeData()
    // efficiency is_mock: false — should have no badge for it
    // satisfaction, performance, communication are_mock: true
    render(<SpacePanel data={data} />)
    // 3 mock fields → 3 badges
    expect(screen.getAllByText('MOCK')).toHaveLength(3)
  })
})
