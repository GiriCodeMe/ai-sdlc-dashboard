import { useState } from 'react'
import { useMetrics } from './hooks/useMetrics.js'
import DashboardShell from './components/layout/DashboardShell.jsx'

export default function App() {
  const [selectedProject, setSelectedProject] = useState('roi-calculator')
  const [darkMode, setDarkMode] = useState(false)
  const { metrics, loading, error } = useMetrics(selectedProject)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <DashboardShell
        metrics={metrics}
        loading={loading}
        error={error}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />
    </div>
  )
}
