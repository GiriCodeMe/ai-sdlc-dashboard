import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TierCard from '../components/tier/TierCard.jsx'

describe('TierCard', () => {
  it('renders label and value', () => {
    render(<TierCard label="AI Acceptance" value="72%" />)
    expect(screen.getByText('AI Acceptance')).toBeInTheDocument()
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('renders unit when provided', () => {
    render(<TierCard label="X" value="1" unit="% accepted" />)
    expect(screen.getByText('% accepted')).toBeInTheDocument()
  })

  it('omits unit element when unit is not provided', () => {
    render(<TierCard label="X" value="1" />)
    const card = screen.getByText('X').closest('div').parentElement
    expect(card.querySelectorAll('div')).toHaveLength(2)
  })

  it('shows MOCK badge when isMock is true', () => {
    render(<TierCard label="X" value="1" isMock={true} />)
    expect(screen.getByText('MOCK')).toBeInTheDocument()
  })

  it('hides MOCK badge when isMock is false (default)', () => {
    render(<TierCard label="X" value="1" />)
    expect(screen.queryByText('MOCK')).not.toBeInTheDocument()
  })

  it('renders up trend arrow', () => {
    render(<TierCard label="X" value="1" trend="up" />)
    expect(screen.getByText(/▲/)).toBeInTheDocument()
  })

  it('renders down trend arrow', () => {
    render(<TierCard label="X" value="1" trend="down" />)
    expect(screen.getByText(/▼/)).toBeInTheDocument()
  })

  it('renders no trend arrow by default', () => {
    const { container } = render(<TierCard label="X" value="1" />)
    expect(container.querySelector('span[style*="positive"]')).toBeNull()
    expect(container.querySelector('span[style*="negative"]')).toBeNull()
  })

  it('applies colorClass to outer div', () => {
    const { container } = render(<TierCard label="X" value="1" colorClass="accent-a" />)
    expect(container.firstChild).toHaveClass('card', 'accent-a')
  })
})
