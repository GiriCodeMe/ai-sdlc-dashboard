import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SectionHeader from '../components/layout/SectionHeader.jsx'
import NavBar from '../components/layout/NavBar.jsx'

describe('SectionHeader', () => {
  it('renders the title', () => {
    render(<SectionHeader title="Tier 1 — AI Input" />)
    expect(screen.getByText('Tier 1 — AI Input')).toBeInTheDocument()
  })

  it('shows MOCK DATA badge when hasMockData is true', () => {
    render(<SectionHeader title="X" hasMockData={true} />)
    expect(screen.getByText('MOCK DATA')).toBeInTheDocument()
  })

  it('hides MOCK DATA badge by default', () => {
    render(<SectionHeader title="X" />)
    expect(screen.queryByText('MOCK DATA')).not.toBeInTheDocument()
  })

  it('renders title as h2', () => {
    render(<SectionHeader title="My Section" />)
    expect(screen.getByRole('heading', { level: 2, name: 'My Section' })).toBeInTheDocument()
  })
})

describe('NavBar', () => {
  const defaultProps = {
    selectedProject: 'roi-calculator',
    projects: ['roi-calculator', 'other-app'],
    onProjectChange: vi.fn(),
    darkMode: false,
    onDarkModeToggle: vi.fn(),
  }

  it('renders the dashboard title', () => {
    render(<NavBar {...defaultProps} />)
    expect(screen.getByText('AI SDLC Performance Dashboard')).toBeInTheDocument()
  })

  it('renders all project options', () => {
    render(<NavBar {...defaultProps} />)
    expect(screen.getByRole('option', { name: 'roi-calculator' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'other-app' })).toBeInTheDocument()
  })

  it('shows selected project in the select', () => {
    render(<NavBar {...defaultProps} />)
    expect(screen.getByRole('combobox')).toHaveValue('roi-calculator')
  })

  it('calls onProjectChange when selection changes', () => {
    const onProjectChange = vi.fn()
    render(<NavBar {...defaultProps} onProjectChange={onProjectChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'other-app' } })
    expect(onProjectChange).toHaveBeenCalledWith('other-app')
  })

  it('shows Dark button when darkMode is false', () => {
    render(<NavBar {...defaultProps} darkMode={false} />)
    expect(screen.getByRole('button', { name: /toggle dark mode/i })).toHaveTextContent('Dark')
  })

  it('shows Light button when darkMode is true', () => {
    render(<NavBar {...defaultProps} darkMode={true} />)
    expect(screen.getByRole('button', { name: /toggle dark mode/i })).toHaveTextContent('Light')
  })

  it('calls onDarkModeToggle when button is clicked', () => {
    const onDarkModeToggle = vi.fn()
    render(<NavBar {...defaultProps} onDarkModeToggle={onDarkModeToggle} />)
    fireEvent.click(screen.getByRole('button', { name: /toggle dark mode/i }))
    expect(onDarkModeToggle).toHaveBeenCalledTimes(1)
  })
})
