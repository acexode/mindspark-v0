export type MasteryState = "not_started" | "exploring" | "developing" | "proficient" | "mastered";

export interface MasteryRecord {
  subtopicId: string;
  score: number;
  state: MasteryState;
  evidenceCount: number;
  lastPractisedAt: string | null;
}

export type MasteryMap = Record<string, MasteryRecord>;

export interface AttemptEvidence {
  subtopicId: string;
  correct: boolean;
  difficulty: 1 | 2 | 3;
  attempts: number;
  hintsUsed: number;
}

export interface MasteryUpdate {
  record: MasteryRecord;
  delta: number;
  xpAwarded: number;
  reason: string;
}

export const MASTERY_THRESHOLDS: Array<{ state: MasteryState; min: number }> = [
  { state: "mastered", min: 85 },
  { state: "proficient", min: 65 },
  { state: "developing", min: 40 },
  { state: "exploring", min: 1 },
  { state: "not_started", min: 0 },
];

export function scoreToState(score: number): MasteryState {
  return MASTERY_THRESHOLDS.find((t) => score >= t.min)?.state ?? "not_started";
}

export function emptyRecord(subtopicId: string): MasteryRecord {
  return { subtopicId, score: 0, state: "not_started", evidenceCount: 0, lastPractisedAt: null };
}

export function getRecord(mastery: MasteryMap, subtopicId: string): MasteryRecord {
  return mastery[subtopicId] ?? emptyRecord(subtopicId);
}

/**
 * Deterministic and explainable. Correct answers gain more on harder questions
 * and less when hints were used; incorrect answers cost a small amount so a
 * single slip never wipes out demonstrated learning.
 */
export function applyEvidence(current: MasteryRecord, evidence: AttemptEvidence, now = new Date()): MasteryUpdate {
  const timestamp = now.toISOString();

  if (!evidence.correct) {
    const score = Math.max(0, current.score - 3);
    return {
      record: {
        ...current,
        score,
        state: scoreToState(score),
        evidenceCount: current.evidenceCount + 1,
        lastPractisedAt: timestamp,
      },
      delta: score - current.score,
      xpAwarded: 0,
      reason: "Incorrect answer — mastery reduced slightly and this concept will return sooner.",
    };
  }

  const independencePenalty = Math.min(9, (evidence.attempts - 1) * 3 + evidence.hintsUsed * 3);
  const gain = Math.max(2, 7 + evidence.difficulty * 4 - independencePenalty);
  const score = Math.min(100, current.score + gain);

  return {
    record: {
      ...current,
      score,
      state: scoreToState(score),
      evidenceCount: current.evidenceCount + 1,
      lastPractisedAt: timestamp,
    },
    delta: score - current.score,
    xpAwarded: calculateXp(evidence),
    reason:
      evidence.hintsUsed > 0
        ? "Correct with help — mastery gained with a reduced independence bonus."
        : "Correct and independent — strong evidence of understanding.",
  };
}

export function calculateXp(evidence: AttemptEvidence): number {
  if (!evidence.correct) return 0;
  const base = evidence.difficulty === 1 ? 10 : evidence.difficulty === 2 ? 20 : 35;
  return Math.max(5, base - evidence.hintsUsed * 5 - (evidence.attempts - 1) * 3);
}

/** Topic and subject mastery are always derived, never stored, so they cannot drift. */
export function aggregateMastery(mastery: MasteryMap, subtopicIds: string[]): { score: number; state: MasteryState } {
  if (subtopicIds.length === 0) return { score: 0, state: "not_started" };
  const total = subtopicIds.reduce((sum, id) => sum + getRecord(mastery, id).score, 0);
  const score = Math.round(total / subtopicIds.length);
  return { score, state: scoreToState(score) };
}

export const UNLOCK_THRESHOLD = 40;

/**
 * Prerequisites guide sequence; they never hard-block access. A student who
 * wants to jump ahead may, and a prerequisite whose content is not yet
 * authored must not strand them. `isUnlocked` reports readiness, and callers
 * present a suggestion rather than a barrier.
 */
export function isUnlocked(mastery: MasteryMap, prerequisites: string[]): boolean {
  return prerequisites.every((id) => getRecord(mastery, id).score >= UNLOCK_THRESHOLD);
}

export function lockReason(
  mastery: MasteryMap,
  prerequisites: string[],
  nameOf: (id: string) => string,
): string | null {
  const blocking = prerequisites.filter((id) => getRecord(mastery, id).score < UNLOCK_THRESHOLD);
  if (blocking.length === 0) return null;
  return `We suggest ${blocking.map(nameOf).join(" and ")} first — but you can start here if you prefer.`;
}

export function weakestSubtopics(mastery: MasteryMap, candidateIds: string[], limit = 5): string[] {
  return [...candidateIds]
    .filter((id) => getRecord(mastery, id).evidenceCount > 0)
    .sort((a, b) => getRecord(mastery, a).score - getRecord(mastery, b).score)
    .slice(0, limit);
}
