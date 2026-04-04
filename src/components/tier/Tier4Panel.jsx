import TierCard from './TierCard.jsx'

export default function Tier4Panel({ data }) {
  if (!data) return null
  return (
    <div className="tier-grid">
      <TierCard
        label="Unit Cost / Feature"
        value={`$${data.unit_cost_per_feature.value}`}
        unit="USD per feature"
        isMock={data.unit_cost_per_feature.is_mock}
        colorClass="accent-b"
      />
      <TierCard
        label="Token ROI"
        value={`${data.token_roi.value}x`}
        unit="Return per token dollar"
        isMock={data.token_roi.is_mock}
        colorClass="accent-b"
      />
      <TierCard
        label="Labor Arbitrage Value"
        value={`$${data.labor_arbitrage_value.value.toLocaleString('en-US')}`}
        unit="USD / month saved"
        isMock={data.labor_arbitrage_value.is_mock}
        colorClass="accent-b"
      />
    </div>
  )
}
