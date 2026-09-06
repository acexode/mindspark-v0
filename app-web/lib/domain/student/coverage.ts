import type { StudentProfile } from "./types";

/**
 * Practice coverage — which questions a student has already answered, and which
 * subtopics they have actually reached.
 *
 * Without this, a session reshuffled the whole bank every time and remembered
 * nothing, so a 224-question topic could never be worked through: the same
 * questions kept reappearing and "have I covered this?" had no answer.
 *
 * Pure functions only — no framework, storage or network access.
 */

export interface Coverage {
  answered: number;
  total: number;
  percent: number;
  /** True once every question in scope has been answered at least once. */
  complete: boolean;
}

/** Appends a question to a subtopic's answered set, without duplicating it. */
export function recordAnswered(
  current: StudentProfile["answeredQuestionIds"],
  subtopicId: string,
  questionId: string,
): StudentProfile["answeredQuestionIds"] {
  const seen = current[subtopicId] ?? [];
  if (seen.includes(questionId)) return current;
  return { ...current, [subtopicId]: [...seen, questionId] };
}

/** Every question id the student has answered across the given subtopics. */
export function answeredIdsFor(
  answeredQuestionIds: StudentProfile["answeredQuestionIds"],
  subtopicIds: readonly string[],
): Set<string> {
  const ids = new Set<string>();
  for (const subtopicId of subtopicIds) {
    for (const questionId of answeredQuestionIds[subtopicId] ?? []) ids.add(questionId);
  }
  return ids;
}

export function coverageOf(answered: Set<string>, questionIds: readonly string[]): Coverage {
  const total = questionIds.length;
  const count = questionIds.filter((id) => answered.has(id)).length;
  return {
    answered: count,
    total,
    percent: total > 0 ? Math.round((count / total) * 100) : 0,
    complete: total > 0 && count >= total,
  };
}

/**
 * Splits a pool so practice serves unseen questions first. When everything has
 * been answered the pool is returned intact rather than empty — a student who
 * has finished a bank should still be able to revise it.
 */
export function partitionByAnswered<T extends { id: string }>(
  pool: readonly T[],
  answered: Set<string>,
): { questions: T[]; revisiting: boolean } {
  const unseen = pool.filter((question) => !answered.has(question.id));
  return unseen.length > 0 ? { questions: unseen, revisiting: false } : { questions: [...pool], revisiting: true };
}

/**
 * Subtopics the student has actually reached: a lesson opened, or practice
 * evidence recorded. Topic-level practice is scoped to these so a student is
 * never asked about a subtopic they have not studied yet.
 */
export function coveredSubtopicIds(
  profile: Pick<StudentProfile, "visitedSubtopicIds" | "mastery" | "answeredQuestionIds">,
  subtopicIds: readonly string[],
): string[] {
  return subtopicIds.filter(
    (id) =>
      Boolean(profile.visitedSubtopicIds[id]) ||
      (profile.mastery[id]?.evidenceCount ?? 0) > 0 ||
      (profile.answeredQuestionIds[id]?.length ?? 0) > 0,
  );
}
