import { getQuestionsForSubject, getSubjects, idSlug } from "@/lib/content/loader";
import { filterQuestionsByClass, filterSubjectsForClass } from "@/lib/content/class-visibility";
import type { Subject } from "@/lib/content/schema";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { QuizSubjectRow, type QuizMode } from "@/features/quiz/components/quiz-subject-row";

export const metadata = { title: "Quiz — Mindspark" };

/** Paper lengths; kept in step with MODES in app/(student)/quiz/[subject]/[mode]/page.tsx. */
const SUBJECT_QUIZ_LENGTH = 20;
const EXAM_MOCK_LENGTH = 40;

export default async function QuizPickerPage() {
  const profile = await readProfileOrDefault();
  const isUndergraduate = profile.educationLevel === "undergraduate";
  /** Undergraduate courses are never year-filtered — see lib/content/courses.ts. */
  const scoped = isUndergraduate
    ? getSubjects("undergraduate")
    : filterSubjectsForClass(getSubjects(profile.educationLevel), profile.classLevel);
  const counted = scoped
    .map((subject) => ({
      subject,
      count: filterQuestionsByClass(getQuestionsForSubject(subject.id), subject, profile.classLevel).length,
    }))
    .filter(({ count }) => count >= 5);

  if (counted.length === 0) {
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

  const chosen = (id: string) => profile.selectedSubjectIds.indexOf(id);
  const mine = counted.filter(({ subject }) => chosen(subject.id) >= 0).sort((a, b) => chosen(a.subject.id) - chosen(b.subject.id));
  const others = counted.filter(({ subject }) => chosen(subject.id) < 0);
  const featured = mine.length > 0 ? mine : others;
  const rest = mine.length > 0 ? others : [];

  const modesFor = (count: number): QuizMode[] => [
    { mode: "subject", label: isUndergraduate ? "Continuous assessment" : "Subject quiz", questionCount: Math.min(SUBJECT_QUIZ_LENGTH, count) },
    { mode: "exam", label: isUndergraduate ? "Mock exam" : "Exam mock", questionCount: Math.min(EXAM_MOCK_LENGTH, count) },
  ];
  const row = ({ subject, count }: { subject: Subject; count: number }) => (
    <QuizSubjectRow
      key={subject.id}
      slug={idSlug(subject.id)}
      label={subject.courseCode ?? subject.name}
      accent={subject.accentColor}
      questionCount={count}
      curricula={isUndergraduate ? [] : subject.curricula}
      modes={modesFor(count)}
    />
  );

  return (
    <section className="page quiz-picker">
      <header className="page-header">
        <div>
          <span className="eyebrow">{isUndergraduate ? "Assessments" : "Quiz"}</span>
          <h1>{isUndergraduate ? "Assess what you know" : "Test yourself under exam conditions"}</h1>
          <p>Pick a paper and a pace. The clock starts as soon as it opens.</p>
        </div>
        <ul className="quiz-rules" aria-label="How quizzes work">
          <li>
            <strong>Timed</strong>
            <span>Submits itself when time runs out</span>
          </li>
          <li>
            <strong>No hints</strong>
            <span>Feedback only after you submit</span>
          </li>
          <li>
            <strong>Full review</strong>
            <span>Every answer explained at the end</span>
          </li>
        </ul>
      </header>

      <div className="quiz-rows">{featured.map(row)}</div>

      {rest.length > 0 && (
        <details className="practice-others quiz-others">
          <summary>
            Other {isUndergraduate ? "courses" : "subjects"} <span>({rest.length})</span>
          </summary>
          <div className="quiz-rows">{rest.map(row)}</div>
        </details>
      )}
    </section>
  );
}
