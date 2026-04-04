import NavBar from './NavBar.jsx'
import SectionHeader from './SectionHeader.jsx'
import Tier1Panel from '../tier/Tier1Panel.jsx'
import Tier2Panel from '../tier/Tier2Panel.jsx'
import Tier3Panel from '../tier/Tier3Panel.jsx'
import Tier4Panel from '../tier/Tier4Panel.jsx'
import SpacePanel from '../space/SpacePanel.jsx'
import CorrelationHeatmap from '../charts/CorrelationHeatmap.jsx'
import DualAxisChart from '../charts/DualAxisChart.jsx'
import RoiTrackerWidget from '../charts/RoiTrackerWidget.jsx'
import RetentionRiskFlag from '../risk/RetentionRiskFlag.jsx'
import CiGatesPanel from '../ci/CiGatesPanel.jsx'

export default function DashboardShell({
  metrics,
  loading,
  error,
  selectedProject,
  onProjectChange,
  darkMode,
  onDarkModeToggle,
}) {
  return (
    <div className="dashboard-shell">
      <NavBar
        selectedProject={selectedProject}
        projects={['roi-calculator']}
        onProjectChange={onProjectChange}
        darkMode={darkMode}
        onDarkModeToggle={onDarkModeToggle}
      />

      <main className="dashboard-content">
        {loading && <p style={{ color: 'var(--text-muted)' }}>Loading metrics...</p>}
        {error   && <p style={{ color: 'var(--negative)' }}>Error: {error}</p>}

        {metrics && (
          <>
            {/* ── Row 1: Tier KPI matrix ─────────────────────────────────── */}
            <section>
              <SectionHeader title="Tier 1 — AI Input Metrics" hasMockData={true} />
              <Tier1Panel data={metrics.tier1_input} />
            </section>

            <section>
              <SectionHeader title="Tier 2 — Process Metrics" hasMockData={true} />
              <Tier2Panel data={metrics.tier2_process} />
            </section>

            <section>
              <SectionHeader title="Tier 3 — Output Quality" hasMockData={true} />
              <Tier3Panel data={metrics.tier3_output} />
            </section>

            <section>
              <SectionHeader title="Tier 4 — Business Value" hasMockData={true} />
              <Tier4Panel data={metrics.tier4_value} />
            </section>

            {/* ── Row 2: SPACE framework ─────────────────────────────────── */}
            <section>
              <SectionHeader title="SPACE Framework" hasMockData={true} />
              <SpacePanel data={metrics.space_framework} />
            </section>

            {/* ── Row 3: Charts ──────────────────────────────────────────── */}
            <section>
              <SectionHeader title="Correlation Heatmap — Adoption vs Technical Debt" />
              <CorrelationHeatmap series={metrics.heatmap_series} />
            </section>

            <section>
              <SectionHeader title="Velocity / Quality — PR Cycle Time vs AI-Induced Vulns" />
              <DualAxisChart series={metrics.dual_axis_series} />
            </section>

            <section>
              <SectionHeader title="ROI Tracker" />
              <RoiTrackerWidget />
            </section>

            {/* ── Row 4: Risk + CI ───────────────────────────────────────── */}
            <section>
              <SectionHeader title="Retention Risk Assessment" />
              <RetentionRiskFlag metrics={metrics} />
            </section>

            <section>
              <SectionHeader title="CI Quality Gates" />
              <CiGatesPanel ci={metrics.ci_native} />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
