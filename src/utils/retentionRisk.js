/**
 * Evaluates retention risk from a metrics snapshot.
 * Thresholds:
 *   70% acceptance = DORA "heavy adopter"
 *   5%  failure    = DORA elite threshold
 *   0.005 ratio    = <1 complex module per 200 manual lines
 */
export function evaluateRetentionRisk(metrics) {
  const high_ai_usage      = metrics.tier1_input.ai_acceptance_rate.value >= 70
  const high_failure_rate  = metrics.tier3_output.ai_change_failure_rate.value >= 5.0
  const low_orchestration  = metrics.orchestration_value.ratio.value < 0.005
  const flagged = high_ai_usage && (high_failure_rate || low_orchestration)

  return {
    flagged,
    high_ai_usage,
    high_failure_rate,
    low_orchestration_value: low_orchestration,
  }
}
