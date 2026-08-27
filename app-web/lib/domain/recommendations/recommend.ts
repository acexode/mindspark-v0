import { getRecord, isUnlocked, type MasteryMap } from "@/lib/domain/mastery/mastery";

export interface RecommendationCandidate {
  subtopicId: string;
  subtopicName: string;
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  subjectSlug: string;
  topicSlug: string;
  subtopicSlug: string;
  prerequisites: string[];
  hasLesson: boolean;
  questionCount: number;
}

export type RecommendationAction = "learn" | "practise" | "revise" | "quiz";

export interface Recommendation {
  action: RecommendationAction;
  title: string;
  subjectName: string;
  description: string;
  href: string;
  reason: string;
  subtopicId: string;
}

/**
 * Chooses one next action and explains why. Priority order:
 *  1. Repair a weak subtopic the student has already attempted
 *  2. Practise a subtopic they have learned but not proven
 *  3. Learn the next unlocked subtopic
 *  4. Quiz a subject they are strong in
 */
export function recommendNext(candidates: RecommendationCandidate[], mastery: MasteryMap): Recommendation | null {
  if (candidates.length === 0) return null;

  const unlocked = candidates.filter((c) => isUnlocked(mastery, c.prerequisites));
  const pool = unlocked.length > 0 ? unlocked : candidates;

  const weak = pool
    .filter((c) => {
      const record = getRecord(mastery, c.subtopicId);
      return record.evidenceCount > 0 && record.score < 40 && c.questionCount > 0;
    })
    .sort((a, b) => getRecord(mastery, a.subtopicId).score - getRecord(mastery, b.subtopicId).score)[0];

  if (weak) {
    return {
      action: "revise",
      title: weak.subtopicName,
      subjectName: weak.subjectName,
      description: `Strengthen ${weak.subtopicName} before moving on.`,
      href: practiceHref(weak),
      reason: `Your mastery here is ${getRecord(mastery, weak.subtopicId).score}%. A short practice set will lift it.`,
      subtopicId: weak.subtopicId,
    };
  }

  const learnedNotProven = pool
    .filter((c) => {
      const record = getRecord(mastery, c.subtopicId);
      return record.evidenceCount > 0 && record.score < 65 && c.questionCount > 0;
    })
    .sort((a, b) => getRecord(mastery, a.subtopicId).score - getRecord(mastery, b.subtopicId).score)[0];

  if (learnedNotProven) {
    return {
      action: "practise",
      title: learnedNotProven.subtopicName,
      subjectName: learnedNotProven.subjectName,
      description: `Practise ${learnedNotProven.subtopicName} to prove what you have learned.`,
      href: practiceHref(learnedNotProven),
      reason: "You have started this subtopic. Independent practice is what converts it into mastery.",
      subtopicId: learnedNotProven.subtopicId,
    };
  }

  // Fall back across the whole set, not just unlocked candidates: a prerequisite
  // whose lesson has not been authored yet must never strand the student.
  const nextToLearn =
    pool.find((c) => getRecord(mastery, c.subtopicId).evidenceCount === 0 && c.hasLesson) ??
    candidates.find((c) => getRecord(mastery, c.subtopicId).evidenceCount === 0 && c.hasLesson);

  if (nextToLearn) {
    return {
      action: "learn",
      title: nextToLearn.subtopicName,
      subjectName: nextToLearn.subjectName,
      description: `Start ${nextToLearn.subtopicName} in ${nextToLearn.topicName}.`,
      href: learnHref(nextToLearn),
      reason:
        nextToLearn.prerequisites.length > 0
          ? "You have met the prerequisites for this subtopic."
          : "This is the next subtopic in your curriculum sequence.",
      subtopicId: nextToLearn.subtopicId,
    };
  }

  const strongest = [...pool].sort(
    (a, b) => getRecord(mastery, b.subtopicId).score - getRecord(mastery, a.subtopicId).score,
  )[0];

  return {
    action: "quiz",
    title: `${strongest.subjectName} quiz`,
    subjectName: strongest.subjectName,
    description: `Test yourself under exam conditions in ${strongest.subjectName}.`,
    href: `/quiz/${strongest.subjectSlug}/subject`,
    reason: "You have covered the available subtopics here. A timed quiz will confirm your retention.",
    subtopicId: strongest.subtopicId,
  };
}

function learnHref(c: RecommendationCandidate): string {
  return `/learn/${c.subjectSlug}/${c.topicSlug}/${c.subtopicSlug}`;
}

function practiceHref(c: RecommendationCandidate): string {
  return `/practice/${c.subjectSlug}/${c.topicSlug}`;
}
