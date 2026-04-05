export default function CiGatesPanel({ ci }) {
  if (!ci) return null

  function gateStatus(field) {
    if (!field) return 'unknown'
    if (field.value === 'pass' || field.gate === 'pass') return 'pass'
    if (typeof field.value === 'number' && field.value === 0) return 'pass'
    if (typeof field.value === 'number' && field.value > 0) return 'fail'
    if (field.value === 'fail' || field.gate === 'fail') return 'fail'
    return 'unknown'
  }

  const gates = [
    { label: 'Build',                key: 'build_status',    value: ci.build_status?.value },
    { label: 'Unit Tests',           key: 'unit_tests',      value: `${ci.unit_tests?.passed?.value ?? '?'} / ${ci.unit_tests?.total?.value ?? '?'}` },
    { label: 'Unit Coverage (lines)',key: 'unit_cov',        value: `${ci.unit_tests?.coverage_lines?.value ?? '?'}%` },
    { label: 'E2E Tests',            key: 'e2e_tests',       value: `${ci.e2e_tests?.passed?.value ?? '?'} / ${ci.e2e_tests?.total?.value ?? '?'}` },
    { label: 'E2E Coverage',         key: 'e2e_cov',         value: `${ci.e2e_tests?.coverage_lines?.value ?? '?'}%` },
    { label: 'Accessibility',        key: 'a11y',            value: `${ci.a11y_tests?.passed?.value ?? ci.a11y_tests?.value ?? '?'} / ${ci.a11y_tests?.total?.value ?? '?'}` },
    { label: 'Lint Errors',          key: 'lint',            value: `${ci.lint_errors?.value ?? '?'} errors` },
    { label: 'Vuln Check',           key: 'vuln',            value: `${ci.vuln_check?.total?.value ?? ci.vuln_check?.value ?? '?'} moderate+` },
    { label: 'Lighthouse Perf',      key: 'lh_perf',         value: `${ci.lighthouse?.performance?.value ?? '?'}` },
  ]

  // Determine pass/fail per gate
  const statusMap = {
    build_status: gateStatus(ci.build_status),
    unit_tests:   ci.unit_tests?.failed?.value === 0 ? 'pass' : 'fail',
    unit_cov:     (ci.unit_tests?.coverage_lines?.value ?? 0) >= 95 ? 'pass' : 'fail',
    e2e_tests:    ci.e2e_tests?.failed?.value === 0 ? 'pass' : 'fail',
    e2e_cov:      (ci.e2e_tests?.coverage_lines?.value ?? 0) >= 79 ? 'pass' : 'fail',
    a11y:         (ci.a11y_tests?.failed?.value ?? ci.a11y_tests?.value ?? 1) === 0 ? 'pass' : 'fail',
    lint:         (ci.lint_errors?.value ?? -1) === 0 ? 'pass' : 'fail',
    vuln:         (ci.vuln_check?.total?.value ?? ci.vuln_check?.value ?? 1) === 0 ? 'pass' : 'fail',
    lh_perf:      (ci.lighthouse?.performance?.value ?? 0) >= 80 ? 'pass' : 'fail',
  }

  return (
    <div className="ci-gates-grid">
      {gates.map(gate => {
        const status = statusMap[gate.key]
        return (
          <div key={gate.key} className={`ci-gate-item ${status}`}>
            <span style={{ fontSize: 16 }}>{status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⏸'}</span>
            <div>
              <div style={{ fontWeight: 600 }}>{gate.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{gate.value}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
