import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function DualAxisChart({ series }) {
  if (!Array.isArray(series) || series.length === 0) {
    return (
      <div className="card" style={{ color: 'var(--text-muted)', padding: 24 }}>
        No dual-axis data yet. Data accumulates after each CI run.
      </div>
    )
  }

  return (
    <div className="card">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={series} margin={{ top: 8, right: 20, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="sprint" tick={{ fontSize: 11 }} />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 11 }}
            label={{ value: 'Cycle time (h)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11 }}
            label={{ value: 'AI failures (%)', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: 11 } }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'pr_cycle_time_hours') return [`${value}h`, 'PR Cycle Time']
              if (name === 'ai_induced_vulnerabilities') return [`${value}%`, 'AI Failure Rate']
              return [value, name]
            }}
          />
          <Legend
            formatter={(value) => {
              if (value === 'pr_cycle_time_hours') return 'PR Cycle Time (h)'
              if (value === 'ai_induced_vulnerabilities') return 'AI Failure Rate (%)'
              return value
            }}
          />
          <Bar     dataKey="pr_cycle_time_hours"        yAxisId="left"  fill="#2563eb" name="pr_cycle_time_hours" />
          <Line    dataKey="ai_induced_vulnerabilities" yAxisId="right" stroke="#dc2626" dot={false} name="ai_induced_vulnerabilities" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
