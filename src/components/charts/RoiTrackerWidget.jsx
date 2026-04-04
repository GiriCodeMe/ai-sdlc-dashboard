import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

function buildProjection(manualHours, hourlyRate, subCost) {
  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const netSavings = manualHours * hourlyRate * month - subCost * month
    return { month, netSavings }
  })
}

export default function RoiTrackerWidget() {
  const [manualHours, setManualHours] = useState(80)
  const [hourlyRate,  setHourlyRate]  = useState(75)
  const [subCost,     setSubCost]     = useState(20)

  const data = buildProjection(manualHours, hourlyRate, subCost)

  return (
    <div className="card">
      <div className="roi-sliders">
        <div className="roi-slider-row">
          <label htmlFor="manual-hours">Manual hours saved / mo</label>
          <input
            id="manual-hours"
            type="range"
            min={0}
            max={500}
            step={5}
            value={manualHours}
            onChange={e => setManualHours(Number(e.target.value))}
          />
          <span>{manualHours}h</span>
        </div>

        <div className="roi-slider-row">
          <label htmlFor="hourly-rate">Hourly rate</label>
          <input
            id="hourly-rate"
            type="range"
            min={0}
            max={200}
            step={5}
            value={hourlyRate}
            onChange={e => setHourlyRate(Number(e.target.value))}
          />
          <span>{hourlyRate.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/h</span>
        </div>

        <div className="roi-slider-row">
          <label htmlFor="sub-cost">AI subscription cost / mo</label>
          <input
            id="sub-cost"
            type="range"
            min={0}
            max={1000}
            step={10}
            value={subCost}
            onChange={e => setSubCost(Number(e.target.value))}
          />
          <span>{subCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}/mo</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: 'Month', position: 'insideBottom', offset: -2, style: { fontSize: 11 } }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={v => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', notation: 'compact' })}
          />
          <Tooltip
            formatter={v => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            labelFormatter={l => `Month ${l}`}
          />
          <ReferenceLine y={0} strokeDasharray="6 3" stroke="#999" label={{ value: 'Break-even', fill: '#999', fontSize: 11 }} />
          <Line type="monotone" dataKey="netSavings" stroke="#2563eb" dot={false} name="Net Savings" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
