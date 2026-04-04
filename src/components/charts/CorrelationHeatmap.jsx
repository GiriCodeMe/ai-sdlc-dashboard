import { scaleSequential } from 'd3-scale'
import { interpolateRdYlGn } from 'd3-scale-chromatic'
import { buildHeatmapLayout } from '../../utils/heatmapLayout.js'

const CELL_W = 48
const CELL_H = 36
const LABEL_W = 140
const HEADER_H = 24
const PAD = 8

export default function CorrelationHeatmap({ series }) {
  const { sprints, projects, cells } = buildHeatmapLayout(series)

  if (sprints.length === 0) {
    return (
      <div className="card" style={{ color: 'var(--text-muted)', padding: 24 }}>
        No heatmap data yet. Metrics will accumulate after each CI run.
      </div>
    )
  }

  const colorScale = scaleSequential(interpolateRdYlGn).domain([0, 1])

  const svgW = LABEL_W + sprints.length * CELL_W + PAD * 2
  const svgH = HEADER_H + projects.length * CELL_H + PAD * 2

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <svg
        width={svgW}
        height={svgH}
        role="img"
        aria-label="Correlation heatmap: AI acceptance rate vs technical debt by project and sprint"
      >
        {/* Sprint headers */}
        {sprints.map((sprint, si) => (
          <text
            key={sprint}
            x={LABEL_W + si * CELL_W + CELL_W / 2}
            y={HEADER_H - 4}
            textAnchor="middle"
            fontSize={10}
            fill="var(--text-muted)"
          >
            {sprint.replace(/^\d{4}-/, '')}
          </text>
        ))}

        {/* Project rows */}
        {projects.map((project, pi) => (
          <g key={project}>
            {/* Y-axis label */}
            <text
              x={LABEL_W - 6}
              y={HEADER_H + pi * CELL_H + CELL_H / 2 + 4}
              textAnchor="end"
              fontSize={11}
              fill="var(--text)"
            >
              {project}
            </text>

            {/* Cells */}
            {sprints.map((sprint, si) => {
              const cell = cells[pi]?.[si]
              if (!cell) return (
                <rect
                  key={sprint}
                  x={LABEL_W + si * CELL_W}
                  y={HEADER_H + pi * CELL_H}
                  width={CELL_W - 2}
                  height={CELL_H - 2}
                  fill="var(--border)"
                  rx={3}
                />
              )

              const color = colorScale(cell.score)
              return (
                <g key={sprint}>
                  <title>
                    {`${project} ${sprint}: acceptance=${cell.ai_acceptance_rate}%, debt=${(cell.technical_debt_ratio * 100).toFixed(0)}%, score=${cell.score.toFixed(2)}`}
                  </title>
                  <rect
                    x={LABEL_W + si * CELL_W}
                    y={HEADER_H + pi * CELL_H}
                    width={CELL_W - 2}
                    height={CELL_H - 2}
                    fill={color}
                    rx={3}
                  />
                  <text
                    x={LABEL_W + si * CELL_W + CELL_W / 2 - 1}
                    y={HEADER_H + pi * CELL_H + CELL_H / 2 + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fill={cell.score > 0.5 ? '#1e293b' : '#f1f5f9'}
                  >
                    {(cell.score * 100).toFixed(0)}
                  </text>
                </g>
              )
            })}
          </g>
        ))}
      </svg>
    </div>
  )
}
