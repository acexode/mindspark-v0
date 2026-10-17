import Link from "next/link";
import type { Route } from "next";
import { getQuestionsForSubject, getSubjects, idSlug } from "@/lib/content/loader";
import { filterQuestionsByClass, filterSubjectsForClass } from "@/lib/content/class-visibility";
import { buildSubjectOverview } from "@/lib/content/study-overview";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { PracticeSubject } from "@/features/practice/components/practice-subject";

export const metadata = { title: "Practice — Mindspark" };

/** Step 1 of the picker. Practice is never started without an explicit scope. */
export default async function PracticePickerPage() {
  const profile = await readProfileOrDefault();
  const isUndergraduate = profile.educationLevel === "undergraduate";
  /** Undergraduate courses are never year-filtered — see lib/content/courses.ts. */
  const scoped = isUndergraduate
    ? getSubjects("undergraduate")
    : filterSubjectsForClass(getSubjects(profile.educationLevel), profile.classLevel);
  const subjects = scoped.filter(
    (subject) => filterQuestionsByClass(getQuestionsForSubject(subject.id), subject, profile.classLevel).length > 0,
  );

  if (subjects.length === 0) {
    return (
      <section className="page">
        <EmptyState
          title="No practice questions available yet"
          description="Question banks have not been published for your level."
          actionLabel="Browse the library"
          actionHref="/library"
        />
      </section>
    );
  }

  // In the order the student chose them, not catalogue order.
  const mine = subjects
    .filter((s) => profile.selectedSubjectIds.includes(s.id))
    .sort((a, b) => profile.selectedSubjectIds.indexOf(a.id) - profile.selectedSubjectIds.indexOf(b.id));
  const others = subjects.filter((s) => !profile.selectedSubjectIds.includes(s.id));
  const featured = mine.length > 0 ? mine : others;
  const rest = mine.length > 0 ? others : [];

  return (
    <section className="page practice-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Practice</span>
          <h1>What would you like to practise?</h1>
          <p>
            {isUndergraduate
              ? "Every module is open — practise in whatever order suits you."
              : "Work on your current topic in each subject. Clear it to unlock the next."}
          </p>
        </div>
      </header>

      <div className="practice-subjects">
        {featured.map((subject) => (
          <PracticeSubject key={subject.id} subject={buildSubjectOverview(subject, profile)} openModules={isUndergraduate} />
        ))}
      </div>

      {rest.length > 0 && (
        <details className="practice-others">
          <summary>
            Practise another {isUndergraduate ? "course" : "subject"} <span>({rest.length})</span>
          </summary>
          <ul>
            {rest.map((subject) => (
              <li key={subject.id} style={{ ["--accent" as string]: subject.accentColor }}>
                <Link href={`/practice/${idSlug(subject.id)}` as Route}>{subject.courseCode ?? subject.name}</Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
