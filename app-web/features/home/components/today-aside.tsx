import Link from "next/link";
import type { Route } from "next";
import type { SubjectOverview } from "@/lib/content/study-overview";

const FIRST_GOAL_QUESTIONS = 10;

/**
 * First steps until the student has done each once, then the lessons they left open.
 * Every tick is read from their real activity, never assumed.
 */
export function TodayAside({ subjects, casual }: { subjects: SubjectOverview[]; casual: boolean }) {
  const answered = subjects.reduce((sum, s) => sum + s.answeredCount, 0);
  const steps = [
    { label: "Open your first lesson", done: subjects.some((s) => s.continueUnit), detail: null },
    {
      label: `Answer ${FIRST_GOAL_QUESTIONS} practice questions`,
      done: answered >= FIRST_GOAL_QUESTIONS,
      detail: `${Math.min(answered, FIRST_GOAL_QUESTIONS)}/${FIRST_GOAL_QUESTIONS}`,
    },
    { label: "Clear your first topic", done: subjects.some((s) => s.clearedCount > 0), detail: null },
  ];
  const showSteps = steps.some((step) => !step.done);
  const continues = subjects.filter((s) => s.continueUnit).slice(0, 3);

  return (
    <aside className="today-aside">
      {showSteps && (
        <section className="today-panel">
          <h2>{casual ? "Your first steps" : "Getting started"}</h2>
          <ol className="today-steps">
            {steps.map((step) => (
              <li key={step.label} className={step.done ? "is-done" : ""}>
                <span className="today-step-mark" aria-hidden>
                  {step.done ? "✓" : ""}
                </span>
                <span>
                  {step.label}
                  {step.done && <span className="sr-only"> (done)</span>}
                </span>
                {step.detail && !step.done && <small>{step.detail}</small>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {continues.length > 0 && (
        <section className="today-panel">
          <h2>Pick up where you left off</h2>
          <ul className="today-continue">
            {continues.map((subject) => (
              <li key={subject.id} style={{ ["--accent" as string]: subject.accent }}>
                <Link href={subject.continueUnit!.href as Route}>
                  <span className="card-kicker">{subject.name}</span>
                  <strong>{subject.continueUnit!.name}</strong>
                  <small>{subject.continueUnit!.topicName}</small>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="today-panel">
        <h2>Other ways to study</h2>
        <ul className="today-shortcuts">
          <li>
            <Link href="/quiz">
              <strong>Timed quiz</strong>
              <small>Test yourself under exam conditions.</small>
            </Link>
          </li>
          <li>
            <Link href="/tutor">
              <strong>Ask the tutor</strong>
              <small>Stuck on something? Talk it through.</small>
            </Link>
          </li>
          <li>
            <Link href="/progress">
              <strong>See your progress</strong>
              <small>What you know, and what needs work.</small>
            </Link>
          </li>
        </ul>
      </section>
    </aside>
  );
}
