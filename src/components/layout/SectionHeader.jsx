export default function SectionHeader({ title, hasMockData = false }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {hasMockData && (
        <span className="mock-badge" title="Some values in this section are simulated">
          MOCK DATA
        </span>
      )}
    </div>
  )
}
