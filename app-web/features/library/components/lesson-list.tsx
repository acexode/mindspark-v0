import Link from "next/link";
import type { Route } from "next";
import type { MasteryRecord } from "@/lib/domain/mastery/mastery";
import { MasteryBadge } from "@/components/ui/mastery-badge";

export interface LessonListItem {
  id: string;
  name: string;
  summary: string;
  objectives: { id: string; text: string }[];
  record: MasteryRecord;
  /** Lesson opened or practised: the student has been here. */
  reached: boolean;
  learnHref: string | null;
  practiceHref: string | null;
  questionCount: number;
  /** "We suggest X first" — advisory, never a barrier. */
  suggestion: string | null;
}

/** A topic's units in order, numbered like a syllabus, ticked once the student has reached them. */
export function LessonList({ items }: { items: LessonListItem[] }) {
  return (
    <ol className="lesson-list">
      {items.map((item, index) => (
        <li key={item.id} className={`lesson-row ${item.reached ? "is-reached" : ""}`}>
          <span className="outline-number" aria-hidden>
            {item.reached ? "✓" : index + 1}
          </span>
          <div className="lesson-row-body">
            <h2>{item.name}</h2>
            <p>{item.summary}</p>
            <details className="objectives">
              <summary>{item.objectives.length} learning objectives</summary>
              <ul>
                {item.objectives.map((objective) => (
                  <li key={objective.id}>{objective.text}</li>
                ))}
              </ul>
            </details>
            {item.suggestion && <p className="readiness-note">{item.suggestion}</p>}
          </div>
          <div className="lesson-row-side">
            <MasteryBadge state={item.record.state} score={item.record.score} />
            <div className="lesson-row-actions">
              {item.learnHref ? (
                <Link className={item.reached ? "secondary-action" : "primary-action"} href={item.learnHref as Route}>
                  {item.reached ? "Review" : "Learn"}
                </Link>
              ) : (
                <span className="action-disabled">Lesson coming soon</span>
              )}
              {item.practiceHref && (
                <Link className="secondary-action" href={item.practiceHref as Route}>
                  Practise ({item.questionCount})
                </Link>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
