import { masteryLabel } from "@/components/ui/mastery-badge";
import type { SubjectOverview } from "@/lib/content/study-overview";

/**
 * An average rounded down to 0% reads as "Not started" even after real practice, which
 * contradicts the answered count beside it. Practice, however little, means started.
 */
export function subjectStateLabel(subject: Pick<SubjectOverview, "started" | "practisedSubtopicCount" | "mastery">): string {
  if (subject.practisedSubtopicCount === 0) return subject.started ? "Lessons opened" : "Not started";
  return subject.mastery.state === "not_started" ? "Just started" : masteryLabel(subject.mastery.state);
}
