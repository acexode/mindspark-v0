import type { Subject } from "@/lib/content/schema";
import type { MasteryMap } from "@/lib/domain/mastery/mastery";

export interface CourseCompletion {
  completedUnits: number;
  totalUnits: number;
  percent: number;
}

/**
 * Completion answers "have I covered it" — units with at least one attempt,
 * over total units. Deliberately not aggregateMastery: that is a plain mean
 * and would read near-zero across a large course until every unit is
 * mastered, not just visited, making an honestly-in-progress course look
 * broken.
 */
export function courseCompletion(subject: Subject, mastery: MasteryMap): CourseCompletion {
  const unitIds = subject.topics.flatMap((topic) => topic.subtopics.map((subtopic) => subtopic.id));
  const completedUnits = unitIds.filter((id) => (mastery[id]?.evidenceCount ?? 0) > 0).length;
  const totalUnits = unitIds.length;
  return {
    completedUnits,
    totalUnits,
    percent: totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0,
  };
}

export interface WeakUnit {
  subtopicId: string;
  subtopicName: string;
  courseLabel: string;
  practiceHref: string;
  score: number;
}

/** Units with real evidence but a low score, worst first — a direct link into practice for that module. */
export function weakUnits(
  subjects: Subject[],
  mastery: MasteryMap,
  practiceHref: (subject: Subject, topic: Subject["topics"][number]) => string,
  limit = 4,
): WeakUnit[] {
  const units: WeakUnit[] = [];
  for (const subject of subjects) {
    const label = subject.courseCode ?? subject.shortName;
    for (const topic of subject.topics) {
      for (const subtopic of topic.subtopics) {
        const record = mastery[subtopic.id];
        if (record && record.evidenceCount > 0 && record.score < 50) {
          units.push({
            subtopicId: subtopic.id,
            subtopicName: subtopic.name,
            courseLabel: label,
            practiceHref: practiceHref(subject, topic),
            score: record.score,
          });
        }
      }
    }
  }
  return units.sort((a, b) => a.score - b.score).slice(0, limit);
}

export function relativeStudyLabel(iso: string | undefined): string {
  if (!iso) return "not started";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return `${weeks} weeks ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
