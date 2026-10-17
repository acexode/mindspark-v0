import Link from "next/link";
import type { Route } from "next";
import type { SubjectOverview, TopicOverview, TopicStatus } from "@/lib/content/study-overview";
import { MasteryBar } from "@/components/ui/mastery-badge";
import { MasterySpread } from "@/features/study/components/mastery-spread";
import { subjectStateLabel } from "@/features/study/labels";

const STATUS_LABEL: Record<TopicStatus, string> = {
  cleared: "Cleared",
  current: "Current",
  open: "Open",
  locked: "Locked",
};

/**
 * Topics the student has touched get a full row; the rest collapse into one line, so a
 * subject with 18 topics does not render as 18 identical empty bars.
 */
export function ProgressSubject({ subject, completion }: { subject: SubjectOverview; completion: number | null }) {
  if (subject.practisedSubtopicCount === 0 && subject.clearedCount === 0) return <UntouchedSubject subject={subject} />;

  const touched = (t: TopicOverview) => t.practisedSubtopicCount > 0 || t.status === "cleared" || t.status === "current";
  const active = subject.topics.filter(touched);
  const untouched = subject.topics.filter((t) => !touched(t));

  return (
    <article className="progress-subject" style={{ ["--accent" as string]: subject.accent }}>
      <header>
        <div>
          <h2>
            <Link href={`/library/${subject.slug}` as Route}>{subject.label}</Link>
          </h2>
          <p>
            {subject.practisedSubtopicCount} of {subject.subtopicCount} subtopics practised · {subject.answeredCount} questions
            answered
            {completion !== null ? ` · ${completion}% complete` : ""}
          </p>
        </div>
        <div className="progress-subject-score">
          <strong>{subject.mastery.score}%</strong>
          <span>{subjectStateLabel(subject)}</span>
        </div>
      </header>

      <MasterySpread distribution={subject.distribution} label={`${subject.name} subtopics by mastery`} />

      {active.length > 0 ? (
        <table className="progress-topics">
          <caption className="sr-only">{subject.name} topics in progress</caption>
          <colgroup>
            <col className="progress-col-topic" />
            <col className="progress-col-status" />
            <col />
            <col className="progress-col-practised" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Topic</th>
              <th scope="col">Status</th>
              <th scope="col">Mastery</th>
              <th scope="col">Practised</th>
            </tr>
          </thead>
          <tbody>
            {active.map((topic) => (
              <tr key={topic.id}>
                <th scope="row">{topic.name}</th>
                <td>
                  <span className={`topic-status is-${topic.status}`}>{STATUS_LABEL[topic.status]}</span>
                </td>
                <td className="progress-topic-mastery">
                  <MasteryBar score={topic.mastery} label={`${topic.name} mastery`} />
                  <span>{topic.mastery}%</span>
                </td>
                <td className="progress-topic-practised">
                  {topic.practisedSubtopicCount}/{topic.subtopicCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="progress-subject-empty">Nothing practised in {subject.name} yet.</p>
      )}

      {untouched.length > 0 && (
        <details className="progress-untouched">
          <summary>
            {untouched.length} {untouched.length === 1 ? "topic" : "topics"} not started yet
          </summary>
          <ul>
            {untouched.map((topic) => (
              <li key={topic.id} className={`is-${topic.status}`}>
                {topic.name}
                {topic.status === "locked" && <span className="sr-only"> (locked)</span>}
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

/** Nothing practised yet: one line saying where to begin, rather than a card of empty bars. */
function UntouchedSubject({ subject }: { subject: SubjectOverview }) {
  return (
    <article className="progress-subject is-untouched" style={{ ["--accent" as string]: subject.accent }}>
      <header>
        <div>
          <h2>
            <Link href={`/library/${subject.slug}` as Route}>{subject.label}</Link>
          </h2>
          <p>
            {subject.topics.length} topics · {subject.subtopicCount} subtopics · {subjectStateLabel(subject).toLowerCase()}
          </p>
        </div>
        {subject.current && (
          <Link className="secondary-action" href={subject.current.libraryHref as Route}>
            Start with {subject.current.name}
          </Link>
        )}
      </header>
    </article>
  );
}
