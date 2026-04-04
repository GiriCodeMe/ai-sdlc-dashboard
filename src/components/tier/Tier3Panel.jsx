import TierCard from './TierCard.jsx'

export default function Tier3Panel({ data }) {
  if (!data) return null
  return (
    <div className="tier-grid">
      <TierCard
        label="AI Change Failure Rate"
        value={`${data.ai_change_failure_rate.value}%`}
        unit="DORA — AI-induced failures"
        isMock={data.ai_change_failure_rate.is_mock}
        colorClass="accent-a"
      />
      <TierCard
        label="Security Remediation Speed"
        value={`${data.security_remediation_speed.value}h`}
        unit="Hours to resolve AI-flagged vuln"
        isMock={data.security_remediation_speed.is_mock}
        colorClass="accent-a"
      />
    </div>
  )
}
