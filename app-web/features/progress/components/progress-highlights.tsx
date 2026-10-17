import Link from "next/link";
import type { Route } from "next";
import { MasteryBadge } from "@/components/ui/mastery-badge";
import type { MasteryRecord } from "@/lib/domain/mastery/mastery";

export interface PractisedUnit {
  record: MasteryRecord;
  name: string;
  context: string;
  practiceHref: string;
}

/** At or above this a subtopic is proficient: strong, not something to flag. */
const STRONG_FROM = 65;

/**
 * Two lists that cannot overlap: a subtopic is either below proficient (needs attention)
 * or at/above it (strongest). Only practised subtopics appear in either.
 */
export function ProgressHighlights({ units }: { units: PractisedUnit[] }) {
  const needsWork = units.filter((u) => u.record.score < STRONG_FROM).sort((a, b) => a.record.score - b.record.score).slice(0, 4);
  const strongest = units.filter((u) => u.record.score >= STRONG_FROM).sort((a, b) => b.record.score - a.record.score).slice(0, 4);

  return (
    <div className="progress-highlights">
      <section>
        <h2>Needs attention</h2>
        {needsWork.length === 0 ? (
          <p className="progress-highlight-empty">Nothing flagged. Everything you have practised is at proficient or above.</p>
        ) : (
          <ul>
            {needsWork.map((unit) => (
              <li key={unit.record.subtopicId}>
                <div>
                  <span className="card-kicker">{unit.context}</span>
                  <strong>{unit.name}</strong>
                </div>
                <MasteryBadge state={unit.record.state} score={unit.record.score} />
                <Link href={unit.practiceHref as Route}>Practise</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2>Strongest</h2>
        {strongest.length === 0 ? (
          <p className="progress-highlight-empty">
            Nothing at proficient yet. A subtopic gets here once you reach {STRONG_FROM}% mastery.
          </p>
        ) : (
          <ul>
            {strongest.map((unit) => (
              <li key={unit.record.subtopicId}>
                <div>
                  <span className="card-kicker">{unit.context}</span>
                  <strong>{unit.name}</strong>
                </div>
                <MasteryBadge state={unit.record.state} score={unit.record.score} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
