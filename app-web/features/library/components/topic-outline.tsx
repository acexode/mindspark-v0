import Link from "next/link";
import type { Route } from "next";
import { idSlug } from "@/lib/content/loader";
import type { Topic } from "@/lib/content/schema";
import type { TopicOverview } from "@/lib/content/study-overview";
import type { MasteryMap } from "@/lib/domain/mastery/mastery";
import { getRecord } from "@/lib/domain/mastery/mastery";
import { MasteryBar } from "@/components/ui/mastery-badge";

export interface OutlineTopic {
  topic: Topic;
  overview: TopicOverview;
  /** Subtopic id → whether a lesson is published. */
  lessons: Record<string, boolean>;
  questionCounts: Record<string, number>;
  /** Advisory ordering note (undergraduate open mode only). */
  suggestion: string | null;
}

interface TopicOutlineProps {
  subjectSlug: string;
  topics: OutlineTopic[];
  mastery: MasteryMap;
  isUndergraduate: boolean;
}

const STATUS_LABEL = { cleared: "Cleared", current: "Current", open: "Open", locked: "Locked" } as const;

/**
 * The subject as a numbered outline. Reachable topics show their units; locked topics are a
 * single line each, because the reason is the same for all of them and is stated once above.
 */
export function TopicOutline({ subjectSlug, topics, mastery, isUndergraduate }: TopicOutlineProps) {
  return (
    <ol className="outline">
      {topics.map(({ topic, overview, lessons, questionCounts, suggestion }, index) => {
        const topicSlug = idSlug(topic.id);
        const number = (
          <span className="outline-number" aria-hidden>
            {overview.status === "cleared" ? "✓" : index + 1}
          </span>
        );

        if (overview.status === "locked") {
          return (
            <li key={topic.id} className="outline-row is-locked">
              {number}
              <div className="outline-locked">
                <span>{topic.name}</span>
                <small>
                  {topic.subtopics.length} subtopics · <span aria-hidden>🔒</span> Locked
                </small>
              </div>
            </li>
          );
        }

        return (
          <li key={topic.id} className={`outline-row is-${overview.status}`}>
            {number}
            <div className="outline-body">
              <div className="outline-head">
                <div>
                  <h2>
                    <Link href={`/library/${subjectSlug}/${topicSlug}` as Route}>{topic.name}</Link>
                  </h2>
                  <p>{topic.summary}</p>
                </div>
                <div className="outline-status">
                  <span className={`topic-status is-${overview.status}`}>{STATUS_LABEL[overview.status]}</span>
                  <MasteryBar score={overview.mastery} label={`${topic.name} mastery`} />
                  <small>
                    {overview.mastery}% mastery
                    {overview.practiceBest !== null ? ` · best practice ${overview.practiceBest}%` : ""}
                  </small>
                </div>
              </div>

              {suggestion && <p className="readiness-note">{suggestion}</p>}

              <ul className="subtopic-chips">
                {topic.subtopics.map((subtopic) => {
                  const record = getRecord(mastery, subtopic.id);
                  const hasLesson = lessons[subtopic.id];
                  const href = hasLesson
                    ? `/learn/${subjectSlug}/${topicSlug}/${idSlug(subtopic.id)}`
                    : `/library/${subjectSlug}/${topicSlug}`;
                  return (
                    <li key={subtopic.id}>
                      <Link href={href as Route} className={`subtopic-chip is-${record.state.replace("_", "-")}`}>
                        {subtopic.name}
                        <small>
                          {hasLesson ? "Lesson" : "No lesson yet"} · {questionCounts[subtopic.id] ?? 0} Q
                        </small>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {isUndergraduate && (
                <p className="outline-links">
                  <Link href={`/practice/${subjectSlug}/${topicSlug}` as Route}>Practise this module</Link>
                  <Link href={`/quiz/${subjectSlug}/topic?topic=${topicSlug}` as Route}>Assess this module</Link>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
