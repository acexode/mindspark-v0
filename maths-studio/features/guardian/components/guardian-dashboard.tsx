"use client";

import { useStudentProfile } from "@/features/student-profile/profile-provider";
import { masteryScoreToState } from "@/lib/domain/student/types";

export function GuardianDashboard() {
  const { profile } = useStudentProfile();

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Guardian view</span>
          <h1>{profile.preferredName}&apos;s learning summary</h1>
          <p>Meaningful progress — not surveillance.</p>
        </div>
      </header>
      <div className="progress-grid">
        <article>
          <span className="card-kicker">Consistency</span>
          <strong>{profile.streak} day streak</strong>
          <p>Regular learning activity.</p>
        </article>
        <article>
          <span className="card-kicker">Subjects studied</span>
          <strong>Mathematics</strong>
          <p>Algebra — Linear equations</p>
        </article>
        <article>
          <span className="card-kicker">Progress</span>
          <strong>{profile.linearEquationsMastery}%</strong>
          <p>{masteryScoreToState(profile.linearEquationsMastery).replace("_", " ")}</p>
        </article>
        <article>
          <span className="card-kicker">Areas to support</span>
          <strong>{profile.linearEquationsMastery < 50 ? "Algebra basics" : "On track"}</strong>
          <p>{profile.linearEquationsMastery < 50 ? "May benefit from extra practice." : "Strong progress."}</p>
        </article>
      </div>
    </section>
  );
}
