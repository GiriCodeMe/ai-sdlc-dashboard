export default function SpacePanel({ data }) {
  if (!data) return null

  const dimensions = [
    { key: 'satisfaction',  label: 'Satisfaction',  max: 5,   format: v => `${v}/5` },
    { key: 'performance',   label: 'Performance',   max: 100, format: v => `${v}%`  },
    { key: 'communication', label: 'Communication', max: 5,   format: v => `${v}/5` },
    { key: 'efficiency',    label: 'Efficiency',    max: 1,   format: v => `${(v*100).toFixed(0)}%` },
  ]

  const activityValue = data.activity
    ? (data.activity.commits_last_30d?.value ?? 0)
    : 0

  return (
    <div className="card">
      <div className="space-grid">
        {dimensions.map(({ key, label, max, format }) => {
          const field = data[key]
          if (!field) return null
          const pct = Math.min(100, (field.value / max) * 100)
          return (
            <div key={key} className="space-item">
              <div className="space-label">
                {label}
                {field.is_mock && <span className="mock-badge">MOCK</span>}
              </div>
              <div className="space-value">{format(field.value)}</div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}

        {/* Activity — live from GitHub API */}
        <div className="space-item">
          <div className="space-label">
            Activity
            {data.activity?.commits_last_30d?.is_mock && <span className="mock-badge">MOCK</span>}
          </div>
          <div className="space-value">{activityValue}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>commits (30d)</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, (activityValue / 100) * 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
