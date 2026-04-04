import TierCard from './TierCard.jsx'

export default function Tier1Panel({ data }) {
  if (!data) return null
  return (
    <div className="tier-grid">
      <TierCard
        label="AI Acceptance Rate"
        value={`${data.ai_acceptance_rate.value}%`}
        unit="Copilot suggestions accepted"
        isMock={data.ai_acceptance_rate.is_mock}
        colorClass="accent-a"
      />
      <TierCard
        label="Boilerplate Reduction"
        value={`${data.boilerplate_reduction.value}%`}
        unit="AI-generated lines"
        isMock={data.boilerplate_reduction.is_mock}
        colorClass="accent-a"
      />
    </div>
  )
}
