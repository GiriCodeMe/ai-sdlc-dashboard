import { useState, useEffect } from 'react'

// Dynamically discover projects from metrics/*/AIKPI.json at build time.
// Adding a new project's AIKPI.json to the metrics/ folder is all that's needed.
const metricModules = import.meta.glob('../../metrics/*/AIKPI.json')
export const KNOWN_PROJECTS = Object.keys(metricModules)
  .map(p => p.split('/').at(-2))
  .filter(Boolean)
  .sort()

export function useMetrics(selectedProject) {
  const [metricsMap, setMetricsMap] = useState({})
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    const base = import.meta.env.BASE_URL ?? '/'

    Promise.all(
      KNOWN_PROJECTS.map(async (project) => {
        const url = `${base}metrics/${project}/AIKPI.json`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
        const json = await res.json()
        return [project, json]
      })
    )
      .then((entries) => {
        setMetricsMap(Object.fromEntries(entries))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return {
    metrics:  metricsMap[selectedProject] ?? null,
    allMetrics: metricsMap,
    projects: KNOWN_PROJECTS,
    loading,
    error,
  }
}
