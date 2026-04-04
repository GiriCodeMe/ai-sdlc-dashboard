import { describe, it, expect } from 'vitest'
import { buildHeatmapLayout } from '../utils/heatmapLayout.js'

const SAMPLE_SERIES = [
  { project: 'roi-calculator', sprint: '2026-W13', ai_acceptance_rate: 72, technical_debt_ratio: 0.08 },
  { project: 'roi-calculator', sprint: '2026-W14', ai_acceptance_rate: 75, technical_debt_ratio: 0.06 },
  { project: 'proj-b',         sprint: '2026-W13', ai_acceptance_rate: 50, technical_debt_ratio: 0.20 },
]

describe('buildHeatmapLayout', () => {
  it('returns empty layout for empty series', () => {
    const result = buildHeatmapLayout([])
    expect(result.sprints).toHaveLength(0)
    expect(result.projects).toHaveLength(0)
    expect(result.cells).toHaveLength(0)
  })

  it('returns empty layout for null input', () => {
    const result = buildHeatmapLayout(null)
    expect(result.sprints).toHaveLength(0)
  })

  it('extracts unique sorted sprints', () => {
    const { sprints } = buildHeatmapLayout(SAMPLE_SERIES)
    expect(sprints).toEqual(['2026-W13', '2026-W14'])
  })

  it('extracts unique projects', () => {
    const { projects } = buildHeatmapLayout(SAMPLE_SERIES)
    expect(projects).toContain('roi-calculator')
    expect(projects).toContain('proj-b')
  })

  it('computes score as (acceptance/100) * (1 - techDebt)', () => {
    const { cells, projects, sprints } = buildHeatmapLayout(SAMPLE_SERIES)
    const projIdx   = projects.indexOf('roi-calculator')
    const sprintIdx = sprints.indexOf('2026-W13')
    const cell = cells[projIdx][sprintIdx]
    const expected = (72 / 100) * (1 - 0.08)
    expect(cell.score).toBeCloseTo(expected, 5)
  })

  it('fills missing cells with null', () => {
    const { cells, projects, sprints } = buildHeatmapLayout(SAMPLE_SERIES)
    const projIdx   = projects.indexOf('proj-b')
    const sprintIdx = sprints.indexOf('2026-W14')
    expect(cells[projIdx][sprintIdx]).toBeNull()
  })
})
