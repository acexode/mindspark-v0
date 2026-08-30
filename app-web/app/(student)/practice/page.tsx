import Link from "next/link";
import type { Route } from "next";
import { getQuestionsForSubject, getQuestionsForTopic, getSubjects, idSlug } from "@/lib/content/loader";
import { filterQuestionsByClass, filterSubjectsForClass } from "@/lib/content/class-visibility";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export const metadata = { title: "Practice — Mindspark" };

/** Step 1 of the picker. Practice is never started without an explicit scope. */
export default async function PracticePickerPage() {
  const profile = await readProfileOrDefault();
  const subjects = filterSubjectsForClass(getSubjects(profile.educationLevel), profile.classLevel).filter(
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

  const mine = subjects.filter((s) => profile.selectedSubjectIds.includes(s.id));
  const others = subjects.filter((s) => !profile.selectedSubjectIds.includes(s.id));

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Practice</span>
          <h1>What would you like to practise?</h1>
          <p>Choose a subject, then a topic. You decide what to work on.</p>
        </div>
      </header>

      <SubjectPickers subjects={mine.length > 0 ? mine : others} studentClass={profile.classLevel} />

      {mine.length > 0 && others.length > 0 && (
        <section className="library-more">
          <h2>Other subjects</h2>
          <SubjectPickers subjects={others} studentClass={profile.classLevel} />
        </section>
      )}
    </section>
  );
}

function SubjectPickers({
  subjects,
  studentClass,
}: {
  subjects: ReturnType<typeof getSubjects>;
  studentClass: string;
}) {
  return (
    <div className="picker-grid">
      {subjects.map((subject) => {
          const subjectSlug = idSlug(subject.id);
          const total = filterQuestionsByClass(getQuestionsForSubject(subject.id), subject, studentClass).length;

          return (
            <article key={subject.id} className="picker-card" style={{ ["--accent" as string]: subject.accentColor }}>
              <header>
                <h2>{subject.name}</h2>
                <span className="picker-count">{total} questions</span>
              </header>

              <ul className="picker-topics">
                {subject.topics.map((topic) => {
                  const count = filterQuestionsByClass(getQuestionsForTopic(topic.id), subject, studentClass).length;
                  if (count === 0) return null;
                  return (
                    <li key={topic.id}>
                      <Link href={`/practice/${subjectSlug}/${idSlug(topic.id)}` as Route}>
                        {topic.name}
                        <small>{count} Q</small>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link className="secondary-action" href={`/practice/${subjectSlug}` as Route}>
                Mixed practice across {subject.name}
              </Link>
            </article>
          );
        })}
    </div>
  );
}
