/**
 * Builds a 2D cell grid from the heatmap_series array.
 * Returns { rows, sprints, projects, cells }
 * cells[projectIndex][sprintIndex] = { score, ai_acceptance_rate, technical_debt_ratio, sprint, project }
 */
export function buildHeatmapLayout(series) {
  if (!Array.isArray(series) || series.length === 0) {
    return { rows: [], sprints: [], projects: [], cells: [] }
  }

  const sprintSet  = [...new Set(series.map(e => e.sprint))].sort()
  const projectSet = [...new Set(series.map(e => e.project))]

  // Build lookup: projectName -> sprintLabel -> entry
  const lookup = {}
  for (const entry of series) {
    if (!lookup[entry.project]) lookup[entry.project] = {}
    lookup[entry.project][entry.sprint] = entry
  }

  const cells = projectSet.map(project =>
    sprintSet.map(sprint => {
      const entry = lookup[project]?.[sprint]
      if (!entry) return null
      const acceptance  = entry.ai_acceptance_rate   ?? 0
      const techDebt    = entry.technical_debt_ratio  ?? 0
      const score = (acceptance / 100) * (1 - techDebt)
      return { score, ...entry }
    })
  )

  return { sprints: sprintSet, projects: projectSet, cells }
}
