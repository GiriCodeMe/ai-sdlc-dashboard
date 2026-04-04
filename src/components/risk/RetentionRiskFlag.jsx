import { evaluateRetentionRisk } from '../../utils/retentionRisk.js'

export default function RetentionRiskFlag({ metrics }) {
  if (!metrics) return null

  const risk = evaluateRetentionRisk(metrics)

  const criteria = [
    {
      label:     'High AI Usage (acceptance >= 70%)',
      met:       risk.high_ai_usage,
      value:     `${metrics.tier1_input.ai_acceptance_rate.value}%`,
      threshold: '>= 70%',
    },
    {
      label:     'High Failure Rate (AI failures >= 5%)',
      met:       risk.high_failure_rate,
      value:     `${metrics.tier3_output.ai_change_failure_rate.value}%`,
      threshold: '>= 5%',
    },
    {
      label:     'Low Orchestration Value (ratio < 0.005)',
      met:       risk.low_orchestration_value,
      value:     metrics.orchestration_value.ratio.toFixed(4),
      threshold: '< 0.005',
    },
  ]

  return (
    <div>
      <div className={`risk-banner ${risk.flagged ? 'flagged' : 'ok'}`}>
        {risk.flagged
          ? 'RETENTION RISK FLAGGED — high AI usage combined with high failure rate or low orchestration'
          : 'No retention risk detected — team shows healthy AI adoption balance'}
      </div>
      <table className="risk-criteria-table">
        <thead>
          <tr>
            <th>Criterion</th>
            <th>Current Value</th>
            <th>Threshold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map(c => (
            <tr key={c.label}>
              <td>{c.label}</td>
              <td>{c.value}</td>
              <td>{c.threshold}</td>
              <td style={{ color: c.met ? 'var(--negative)' : 'var(--positive)' }}>
                {c.met ? 'Triggered' : 'OK'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
