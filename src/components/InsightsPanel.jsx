export default function InsightsPanel({ insights }) {
  return (
    <section className="panel insight-panel" aria-label="Weather insights">
      <div className="panel-title-row">
        <h3>Forecast Insights</h3>
        <p>Actionable highlights</p>
      </div>
      <div className="panel-divider" />
      <ul className="insights-list">
        {insights.map((insight, i) => (
          <li key={i} className="insight-item">
            {insight}
          </li>
        ))}
      </ul>
    </section>
  );
}