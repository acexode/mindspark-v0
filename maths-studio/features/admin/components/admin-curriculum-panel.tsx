import curriculum from "@/content/curricula/waec-neco-algebra-linear-equations.json";

export function AdminCurriculumPanel() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Content administration</span>
          <h1>Curriculum review</h1>
          <p>Inspect, approve, and publish curriculum packages.</p>
        </div>
      </header>
      <div className="admin-grid">
        <article className="admin-card">
          <h2>{curriculum.subject}</h2>
          <p>
            Version {curriculum.version} · {curriculum.reviewStatus}
          </p>
          <p>Education system: {curriculum.educationSystem}</p>
          <h3>Sources</h3>
          <ul>
            {curriculum.sources.map((s) => (
              <li key={s.id}>
                {s.title} ({s.type})
              </li>
            ))}
          </ul>
          <h3>Concepts ({curriculum.concepts.length})</h3>
          <ul>
            {curriculum.concepts.map((c) => (
              <li key={c.id}>
                {c.label} — {c.objectives.length} objectives
              </li>
            ))}
          </ul>
          <div className="admin-actions">
            <button type="button" className="primary-action">
              Approve & publish
            </button>
            <button type="button" className="hint-button">
              Flag for review
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
