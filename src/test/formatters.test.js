import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent, formatNumber, formatScore, formatHours, formatRatio } from '../utils/formatters.js'

describe('formatters', () => {
  it('formatCurrency formats USD', () => {
    expect(formatCurrency(1200)).toBe('$1,200')
    expect(formatCurrency(0)).toBe('$0')
  })

  it('formatPercent formats with decimal', () => {
    expect(formatPercent(72.5)).toBe('72.5%')
    expect(formatPercent(100, 0)).toBe('100%')
  })

  it('formatNumber formats integers', () => {
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(3.14, 2)).toBe('3.14')
  })

  it('formatScore formats over max', () => {
    expect(formatScore(4.1)).toBe('4.1 / 5')
    expect(formatScore(80, 100)).toBe('80.0 / 100')
  })

  it('formatHours formats with one decimal', () => {
    expect(formatHours(3.75)).toBe('3.8h')
    expect(formatHours(0)).toBe('0.0h')
  })

  it('formatRatio formats to 4 decimals', () => {
    expect(formatRatio(0.005)).toBe('0.0050')
    expect(formatRatio(1)).toBe('1.0000')
  })
})
