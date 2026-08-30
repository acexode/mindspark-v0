import Link from "next/link";
import type { Route } from "next";
import { getQuestionsForSubject, getSubjects, idSlug } from "@/lib/content/loader";
import { filterQuestionsByClass, filterSubjectsForClass } from "@/lib/content/class-visibility";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export const metadata = { title: "Quiz — Mindspark" };

export default async function QuizPickerPage() {
  const profile = await readProfileOrDefault();
  const subjects = filterSubjectsForClass(getSubjects(profile.educationLevel), profile.classLevel).filter(
    (s) => filterQuestionsByClass(getQuestionsForSubject(s.id), s, profile.classLevel).length >= 5,
  );

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
          <span className="eyebrow">Quiz</span>
          <h1>Test yourself under exam conditions</h1>
          <p>Timed, no hints, no feedback until you submit — just like the real thing.</p>
        </div>
      </header>

      <QuizCards subjects={mine.length > 0 ? mine : others} studentClass={profile.classLevel} />

      {mine.length > 0 && others.length > 0 && (
        <section className="library-more">
          <h2>Other subjects</h2>
          <QuizCards subjects={others} studentClass={profile.classLevel} />
        </section>
      )}
    </section>
  );
}

function QuizCards({
  subjects,
  studentClass,
}: {
  subjects: ReturnType<typeof getSubjects>;
  studentClass: string;
}) {
  return (
    <div className="picker-grid">
      {subjects.map((subject) => {
          const slug = idSlug(subject.id);
          const total = filterQuestionsByClass(getQuestionsForSubject(subject.id), subject, studentClass).length;

          return (
            <article key={subject.id} className="picker-card" style={{ ["--accent" as string]: subject.accentColor }}>
              <header>
                <h2>{subject.name}</h2>
                <span className="picker-count">{total} questions available</span>
              </header>
              <p>{subject.curricula.join(" · ")}</p>
              <div className="quiz-modes">
                <Link className="primary-action" href={`/quiz/${slug}/subject` as Route}>
                  Subject quiz · 20 questions
                </Link>
                <Link className="secondary-action" href={`/quiz/${slug}/exam` as Route}>
                  Exam mock · 40 questions
                </Link>
              </div>
            </article>
          );
        })}
    </div>
  );
}
