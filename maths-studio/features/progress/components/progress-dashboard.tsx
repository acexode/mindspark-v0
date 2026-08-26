"use client";

import { useStudentProfile } from "@/features/student-profile/profile-provider";
import { masteryScoreToState } from "@/lib/domain/student/types";
import { ProgressBar } from "@/components/ui/progress-bar";

export function ProgressDashboard() {
  const { profile } = useStudentProfile();
  const state = masteryScoreToState(profile.linearEquationsMastery);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Learning evidence</span>
          <h1>Your progress</h1>
          <p>Mastery grows from correct reasoning, not time spent on screen.</p>
        </div>
      </header>
      <div className="progress-grid">
        <article>
          <span className="card-kicker">Linear equations</span>
          <strong>{profile.linearEquationsMastery}%</strong>
          <p>Mastery state: {state.replace("_", " ")}</p>
          <ProgressBar value={profile.linearEquationsMastery} label="Linear equations mastery" />
        </article>
        <article>
          <span className="card-kicker">Experience</span>
          <strong>{profile.xp} XP</strong>
          <p>Earned through lessons and practice.</p>
        </article>
        <article>
          <span className="card-kicker">Practice accuracy</span>
          <strong>
            {profile.practiceCorrect}/3
          </strong>
          <p>Linear equations practice set.</p>
        </article>
        <article>
          <span className="card-kicker">Diagnostic score</span>
          <strong>{profile.diagnosticScore}</strong>
          <p>Initial placement evidence.</p>
        </article>
        <article>
          <span className="card-kicker">Consistency</span>
          <strong>{profile.streak} days</strong>
          <p>Learning streak.</p>
        </article>
        <article>
          <span className="card-kicker">Lesson status</span>
          <strong>{profile.lessonComplete ? "Complete" : "In progress"}</strong>
          <p>Balancing linear equations lesson.</p>
        </article>
      </div>
    </section>
  );
}
