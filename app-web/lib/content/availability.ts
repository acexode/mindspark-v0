import type { EducationLevel } from "./schema";
import type { ContentIndex } from "./loader";

export interface MissingUnit {
  subtopicId: string;
  topicId: string;
  name: string;
}

export interface CourseAvailability {
  /** Units (subtopics) that have both a lesson and at least one question. */
  ready: number;
  total: number;
  missing: MissingUnit[];
}

/**
 * Pure: how much of a course has been generated. A unit is ready only when it
 * has a lesson AND questions; anything else is "not yet generated". An unknown
 * subject yields an empty result.
 */
export function courseAvailability(
  index: Pick<ContentIndex, "subjectById" | "lessonBySubtopicId" | "questionsBySubtopicId">,
  subjectId: string,
): CourseAvailability {
  const subject = index.subjectById.get(subjectId);
  if (!subject) return { ready: 0, total: 0, missing: [] };
  const missing: MissingUnit[] = [];
  let total = 0;
  for (const topic of subject.topics) {
    for (const subtopic of topic.subtopics) {
      total += 1;
      const hasLesson = index.lessonBySubtopicId.has(subtopic.id);
      const hasQuestions = (index.questionsBySubtopicId.get(subtopic.id)?.length ?? 0) > 0;
      if (!hasLesson || !hasQuestions) missing.push({ subtopicId: subtopic.id, topicId: topic.id, name: subtopic.name });
    }
  }
  return { ready: total - missing.length, total, missing };
}

/**
 * True when content should carry the "Draft" label: undergraduate (database
 * backed, AI-generated) content that no human has verified. The loader sets
 * `provenance.verified` from the database `human_verified` review status.
 */
export function isDraftContent(
  level: EducationLevel,
  provenance: { verified: boolean; reviewStatus: "draft" | "review" | "published" },
): boolean {
  if (level !== "undergraduate") return false;
  return !provenance.verified || provenance.reviewStatus === "draft";
}
