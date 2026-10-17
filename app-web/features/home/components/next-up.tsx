import Link from "next/link";
import type { Route } from "next";
import type { SubjectOverview } from "@/lib/content/study-overview";
import type { Recommendation } from "@/lib/domain/recommendations/recommend";
import { TopicTrail } from "@/features/study/components/topic-trail";

const ACTION_LABEL: Record<Recommendation["action"], { kicker: string; button: string }> = {
  learn: { kicker: "New lesson", button: "Start lesson" },
  practise: { kicker: "Practice", button: "Start practice" },
  revise: { kicker: "Revision", button: "Revise now" },
  quiz: { kicker: "Quiz", button: "Start quiz" },
};

/** The one thing to do next, with the reason for it and where it sits in the subject. */
export function NextUp({ recommendation, subject }: { recommendation: Recommendation; subject: SubjectOverview | null }) {
  const copy = ACTION_LABEL[recommendation.action];
  const position = subject?.current ? subject.topics.findIndex((t) => t.id === subject.current?.id) + 1 : null;

  return (
    <article className="next-up" style={subject ? { ["--accent" as string]: subject.accent } : undefined}>
      <div className="next-up-main">
        <p className="next-up-label">Up next</p>
        <p className="card-kicker">
          {recommendation.subjectName} · {copy.kicker}
        </p>
        <h2>{recommendation.title}</h2>
        <p className="next-up-description">{recommendation.description}</p>
        <p className="next-up-why">{recommendation.reason}</p>
        <div className="next-up-actions">
          <Link className="primary-action" href={recommendation.href as Route}>
            {copy.button}
          </Link>
          <Link className="next-up-tutor" href={`/tutor?subtopic=${encodeURIComponent(recommendation.subtopicId)}` as Route}>
            Ask the tutor about it →
          </Link>
        </div>
      </div>

      {subject && (
        <aside className="next-up-context" aria-label={`Your place in ${subject.name}`}>
          <p className="tutor-rail-title">Your place in {subject.name}</p>
          <TopicTrail topics={subject.topics} label={`${subject.name} topics`} />
          <dl>
            <div>
              <dt>Topics cleared</dt>
              <dd>
                {subject.clearedCount}
                <span>/{subject.topics.length}</span>
              </dd>
            </div>
            {position !== null && position > 0 && (
              <div>
                <dt>Current topic</dt>
                <dd>
                  {position}
                  <span>/{subject.topics.length}</span>
                </dd>
              </div>
            )}
            <div>
              <dt>Questions answered</dt>
              <dd>{subject.answeredCount}</dd>
            </div>
          </dl>
        </aside>
      )}
    </article>
  );
}
