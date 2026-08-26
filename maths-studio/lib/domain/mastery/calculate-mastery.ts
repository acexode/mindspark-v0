import type { MasteryState } from "../student/types";
import { masteryScoreToState } from "../student/types";

export interface MasteryEvidenceInput {
  correct: boolean;
  attempts: number;
  hintsUsed: number;
  difficulty: 1 | 2 | 3;
  conceptId: string;
}

export interface MasteryResult {
  score: number;
  state: MasteryState;
  delta: number;
  reason: string;
}

export function calculateMasteryAfterAttempt(current: number, evidence: MasteryEvidenceInput): MasteryResult {
  if (!evidence.correct) {
    const score = Math.max(0, current - 2);
    return {
      score,
      state: masteryScoreToState(score),
      delta: score - current,
      reason: "Incorrect attempt reduced confidence slightly.",
    };
  }

  const independencePenalty = Math.min(8, (evidence.attempts - 1) * 3 + evidence.hintsUsed * 2);
  const gain = 8 + evidence.difficulty * 4 - independencePenalty;
  const score = Math.min(100, Math.max(current, current + gain));

  return {
    score,
    state: masteryScoreToState(score),
    delta: score - current,
    reason:
      evidence.hintsUsed > 0
        ? "Correct with hints — mastery gained with reduced independence bonus."
        : "Independent success — strong mastery evidence recorded.",
  };
}

export function calculateXpAward(difficulty: 1 | 2 | 3, hintsUsed: number, correct: boolean): number {
  if (!correct) return 0;
  const base = difficulty === 1 ? 15 : difficulty === 2 ? 25 : 40;
  return Math.max(5, base - hintsUsed * 5);
}
