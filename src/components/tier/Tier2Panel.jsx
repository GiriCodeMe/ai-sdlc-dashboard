import TierCard from './TierCard.jsx'

export default function Tier2Panel({ data }) {
  if (!data) return null
  return (
    <div className="tier-grid">
      <TierCard
        label="PR Cycle Time"
        value={`${data.pr_cycle_time.value}h`}
        unit="Avg hours open→merged"
        isMock={data.pr_cycle_time.is_mock}
        colorClass="accent-b"
      />
      <TierCard
        label="Flow Efficiency"
        value={`${(data.flow_efficiency.value * 100).toFixed(0)}%`}
        unit="Value-add / total time"
        isMock={data.flow_efficiency.is_mock}
        colorClass="accent-b"
      />
    </div>
  )
}
