export default function NavBar({ selectedProject, projects, onProjectChange, darkMode, onDarkModeToggle }) {
  return (
    <nav className="navbar" aria-label="Dashboard navigation">
      <h1>AI SDLC Performance Dashboard</h1>

      <label htmlFor="project-select" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        Project:
      </label>
      <select
        id="project-select"
        value={selectedProject}
        onChange={e => onProjectChange(e.target.value)}
        aria-label="Select project"
      >
        {projects.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <button onClick={onDarkModeToggle} aria-label="Toggle dark mode">
        {darkMode ? 'Light' : 'Dark'}
      </button>
    </nav>
  )
}
