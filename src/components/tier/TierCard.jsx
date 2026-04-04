export default function TierCard({ label, value, unit, isMock = false, colorClass = '', trend }) {
  const trendEl = trend === 'up'
    ? <span style={{ color: 'var(--positive)' }}> ▲</span>
    : trend === 'down'
    ? <span style={{ color: 'var(--negative)' }}> ▼</span>
    : null

  return (
    <div className={`card ${colorClass}`} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
        {isMock && <span className="mock-badge">MOCK</span>}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>
        {value}{trendEl}
      </div>
      {unit && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{unit}</div>
      )}
    </div>
  )
}
