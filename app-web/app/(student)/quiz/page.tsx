import Link from "next/link";
import type { Route } from "next";
import { getQuestionsForSubject, getSubjects, idSlug } from "@/lib/content/loader";
import { filterQuestionsByClass, filterSubjectsForClass } from "@/lib/content/class-visibility";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";

/** Kept in sync with app/(student)/quiz/[subject]/[mode]/page.tsx's DIFFICULTY_MINUTES_PER_QUESTION. */
const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

export const metadata = { title: "Quiz — Mindspark" };

export default async function QuizPickerPage() {
  const profile = await readProfileOrDefault();
  const isUndergraduate = profile.educationLevel === "undergraduate";
  /** Undergraduate courses are never year-filtered — see lib/content/courses.ts. */
  const scoped = isUndergraduate
    ? getSubjects("undergraduate")
    : filterSubjectsForClass(getSubjects(profile.educationLevel), profile.classLevel);
  const subjects = scoped.filter((s) => filterQuestionsByClass(getQuestionsForSubject(s.id), s, profile.classLevel).length >= 5);

  if (subjects.length === 0) {
    return (
      <section className="page">
        <EmptyState
          title="No quizzes available yet"
          description="A subject needs at least five questions before it can be quizzed."
          actionLabel="Browse the library"
          actionHref="/library"
        />
      </section>
    );
  }

  const mine = subjects.filter((s) => profile.selectedSubjectIds.includes(s.id));
  const others = subjects.filter((s) => !profile.selectedSubjectIds.includes(s.id));

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{isUndergraduate ? "Assessments" : "Quiz"}</span>
          <h1>{isUndergraduate ? "Assess what you know" : "Test yourself under exam conditions"}</h1>
          <p>
            {isUndergraduate
              ? "Timed, no hints, no feedback until you submit."
              : "Timed, no hints, no feedback until you submit — just like the real thing."}
          </p>
        </div>
      </header>

      <QuizCards subjects={mine.length > 0 ? mine : others} studentClass={profile.classLevel} isUndergraduate={isUndergraduate} />

      {mine.length > 0 && others.length > 0 && (
        <section className="library-more">
          <h2>Other {isUndergraduate ? "courses" : "subjects"}</h2>
          <QuizCards subjects={others} studentClass={profile.classLevel} isUndergraduate={isUndergraduate} />
        </section>
      )}
    </section>
  );
}

function QuizCards({
  subjects,
  studentClass,
  isUndergraduate,
}: {
  subjects: ReturnType<typeof getSubjects>;
  studentClass: string;
  isUndergraduate: boolean;
}) {
  return (
    <div className="picker-grid">
      {subjects.map((subject) => {
          const slug = idSlug(subject.id);
          const total = filterQuestionsByClass(getQuestionsForSubject(subject.id), subject, studentClass).length;

          return (
            <article key={subject.id} className="picker-card" style={{ ["--accent" as string]: subject.accentColor }}>
              <header>
                <h2>{subject.courseCode ?? subject.name}</h2>
                <span className="picker-count">{total} questions available</span>
              </header>
              <p>{subject.curricula.join(" · ")}</p>
              <div className="quiz-modes">
                <div className="quiz-mode-group">
                  <span className="quiz-mode-title">
                    {isUndergraduate ? "Continuous assessment" : "Subject quiz"} · 20 questions
                  </span>
                  <div className="quiz-difficulty-row">
                    {DIFFICULTIES.map((d) => (
                      <Link key={d.value} className="chip" href={`/quiz/${slug}/subject?difficulty=${d.value}` as Route}>
                        {d.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="quiz-mode-group">
                  <span className="quiz-mode-title">
                    {isUndergraduate ? "Mock exam" : "Exam mock"} · 40 questions
                  </span>
                  <div className="quiz-difficulty-row">
                    {DIFFICULTIES.map((d) => (
                      <Link key={d.value} className="chip" href={`/quiz/${slug}/exam?difficulty=${d.value}` as Route}>
                        {d.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
    </div>
  );
}
