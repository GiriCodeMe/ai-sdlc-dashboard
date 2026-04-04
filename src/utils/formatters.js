export function formatCurrency(value, currency = 'USD') {
  return value.toLocaleString('en-US', { style: 'currency', currency, maximumFractionDigits: 0 })
}

export function formatPercent(value, decimals = 1) {
  return `${Number(value).toFixed(decimals)}%`
}

export function formatNumber(value, decimals = 0) {
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export function formatScore(value, max = 5) {
  return `${Number(value).toFixed(1)} / ${max}`
}

export function formatHours(value) {
  return `${Number(value).toFixed(1)}h`
}

export function formatRatio(value) {
  return Number(value).toFixed(4)
}
