"use client";

export function TeacherDashboard() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Teacher portal</span>
          <h1>Class overview</h1>
          <p>Assign topics and review concept-level mastery.</p>
        </div>
      </header>
      <div className="teacher-grid">
        <article className="teacher-card">
          <h2>SS2 Mathematics</h2>
          <p>12 students · Linear equations unit</p>
          <table className="teacher-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Mastery</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Demo class average</td>
                <td>58%</td>
                <td>Developing</td>
              </tr>
            </tbody>
          </table>
        </article>
        <article className="teacher-card">
          <h2>Assign topic</h2>
          <form className="teacher-form">
            <label>
              Topic
              <select defaultValue="linear-equations">
                <option value="linear-equations">Linear equations</option>
                <option value="simultaneous-equations">Simultaneous equations</option>
              </select>
            </label>
            <label>
              Due date
              <input type="date" />
            </label>
            <button type="button" className="primary-action">
              Create assignment
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
