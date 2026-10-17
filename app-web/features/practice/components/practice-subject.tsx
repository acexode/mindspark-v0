import Link from "next/link";
import type { Route } from "next";
import type { SubjectOverview, TopicOverview } from "@/lib/content/study-overview";
import { TOPIC_PRACTICE_UNLOCK_PERCENT } from "@/lib/domain/mastery/progression";
import { TopicTrail } from "@/features/study/components/topic-trail";

/**
 * A subject as the student meets it in practice: the topic to work on now, topics they can
 * revisit, and a single line for everything still locked (instead of a notice per topic).
 */
export function PracticeSubject({ subject, openModules }: { subject: SubjectOverview; openModules: boolean }) {
  const practisable = subject.topics.filter((t) => t.questionCount > 0);
  const cleared = practisable.filter((t) => t.status === "cleared");
  const locked = practisable.filter((t) => t.status === "locked");
  const current = subject.current && subject.current.questionCount > 0 ? subject.current : null;

  return (
    <article className="practice-subject" style={{ ["--accent" as string]: subject.accent }}>
      <header className="practice-subject-head">
        <h2>{subject.label}</h2>
        <span>
          {openModules
            ? `${subject.answeredCount} questions answered`
            : `${subject.clearedCount} of ${subject.topics.length} topics cleared · ${subject.answeredCount} questions answered`}
        </span>
      </header>
      <TopicTrail topics={subject.topics} label={`${subject.name} topics`} />

      {openModules ? (
        <ModuleList topics={practisable} />
      ) : current ? (
        <CurrentTopic topic={current} nextTopic={locked[0] ?? null} mixedHref={subject.practiceHref} />
      ) : (
        <p className="practice-subject-done">Every topic is cleared. Mixed practice keeps it all fresh.</p>
      )}

      {!openModules && cleared.length > 0 && (
        <div className="practice-revisit">
          <span>Revisit</span>
          <ul>
            {cleared.map((topic) => (
              <li key={topic.id}>
                <Link href={topic.practiceHref as Route}>
                  {topic.name}
                  {topic.practiceBest !== null && <small>{topic.practiceBest}%</small>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!openModules && locked.length > 0 && (
        <p className="practice-locked">
          <span aria-hidden>🔒</span> {locked.length} more {locked.length === 1 ? "topic unlocks" : "topics unlock"} one at a time
          {current ? `, starting with ${locked[0].name}` : ""}.
        </p>
      )}

      {(openModules || !current) && (
        <Link className="secondary-action practice-mixed" href={subject.practiceHref as Route}>
          Mixed practice across the whole {openModules ? "course" : "subject"}
        </Link>
      )}
    </article>
  );
}

function CurrentTopic({ topic, nextTopic, mixedHref }: { topic: TopicOverview; nextTopic: TopicOverview | null; mixedHref: string }) {
  const coverage = topic.questionCount > 0 ? Math.round((topic.answeredCount / topic.questionCount) * 100) : 0;
  // Topic practice only covers subtopics already studied, so a fresh topic starts with its first lesson.
  const studied = topic.coveredSubtopicCount > 0;
  return (
    <div className="practice-current">
      <div className="practice-current-body">
        <p className="card-kicker">Current topic</p>
        <h3>{topic.name}</h3>
        <p className="practice-current-goal">
          {!studied && "Read a lesson in this topic first — practice covers what you have studied. "}
          {topic.practiceBest !== null
            ? `Best score ${topic.practiceBest}%. `
            : ""}
          {nextTopic
            ? `Score ${TOPIC_PRACTICE_UNLOCK_PERCENT}% on this topic's practice to unlock ${nextTopic.name}.`
            : `Score ${TOPIC_PRACTICE_UNLOCK_PERCENT}% on this topic's practice to clear it.`}
        </p>
        <div className="practice-coverage">
          <div className="mastery-bar" role="progressbar" aria-valuenow={coverage} aria-valuemin={0} aria-valuemax={100} aria-label={`${topic.name} questions answered`}>
            <span style={{ width: `${coverage}%` }} />
          </div>
          <small>
            {topic.answeredCount} of {topic.questionCount} questions answered
          </small>
        </div>
      </div>
      <div className="practice-current-actions">
        {studied ? (
          <Link className="primary-action" href={topic.practiceHref as Route}>
            Practise this topic
          </Link>
        ) : (
          <Link className="primary-action" href={topic.libraryHref as Route}>
            Start the first lesson
          </Link>
        )}
        <Link className="secondary-action" href={mixedHref as Route}>
          Mixed practice
        </Link>
      </div>
    </div>
  );
}

/** Undergraduate modules are all open, so each is just a row with its own way in. */
function ModuleList({ topics }: { topics: TopicOverview[] }) {
  return (
    <ul className="practice-modules">
      {topics.map((topic) => (
        <li key={topic.id}>
          <Link href={topic.practiceHref as Route}>
            <span>{topic.name}</span>
            <small>
              {topic.answeredCount}/{topic.questionCount} answered
              {topic.practiceBest !== null ? ` · best ${topic.practiceBest}%` : ""}
            </small>
          </Link>
        </li>
      ))}
    </ul>
  );
}
