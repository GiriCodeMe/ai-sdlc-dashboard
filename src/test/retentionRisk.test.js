import { describe, it, expect } from 'vitest'
import { evaluateRetentionRisk } from '../utils/retentionRisk.js'

function makeMetrics(acceptanceRate, failureRate, orchestrationRatio) {
  return {
    tier1_input: { ai_acceptance_rate: { value: acceptanceRate } },
    tier3_output: { ai_change_failure_rate: { value: failureRate } },
    orchestration_value: { ratio: { value: orchestrationRatio } },
  }
}

describe('evaluateRetentionRisk', () => {
  it('flags when high usage + high failure rate', () => {
    const result = evaluateRetentionRisk(makeMetrics(75, 6.0, 0.01))
    expect(result.flagged).toBe(true)
    expect(result.high_ai_usage).toBe(true)
    expect(result.high_failure_rate).toBe(true)
  })

  it('flags when high usage + low orchestration', () => {
    const result = evaluateRetentionRisk(makeMetrics(80, 2.0, 0.002))
    expect(result.flagged).toBe(true)
    expect(result.high_ai_usage).toBe(true)
    expect(result.low_orchestration_value).toBe(true)
  })

  it('does not flag when high usage but low failure + good orchestration', () => {
    const result = evaluateRetentionRisk(makeMetrics(72, 3.0, 0.01))
    expect(result.flagged).toBe(false)
    expect(result.high_ai_usage).toBe(true)
    expect(result.high_failure_rate).toBe(false)
    expect(result.low_orchestration_value).toBe(false)
  })

  it('does not flag when low usage regardless of failure rate', () => {
    const result = evaluateRetentionRisk(makeMetrics(50, 8.0, 0.001))
    expect(result.flagged).toBe(false)
    expect(result.high_ai_usage).toBe(false)
  })

  it('uses exact thresholds (70%, 5%, 0.005)', () => {
    expect(evaluateRetentionRisk(makeMetrics(70, 5.0, 0.01)).high_ai_usage).toBe(true)
    expect(evaluateRetentionRisk(makeMetrics(69, 5.0, 0.01)).high_ai_usage).toBe(false)
    expect(evaluateRetentionRisk(makeMetrics(70, 5.0, 0.01)).high_failure_rate).toBe(true)
    expect(evaluateRetentionRisk(makeMetrics(70, 4.9, 0.01)).high_failure_rate).toBe(false)
    expect(evaluateRetentionRisk(makeMetrics(70, 2.0, 0.005)).low_orchestration_value).toBe(false)
    expect(evaluateRetentionRisk(makeMetrics(70, 2.0, 0.004)).low_orchestration_value).toBe(true)
  })
})
