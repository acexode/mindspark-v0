import type { Question } from "@/lib/content/schema";

export interface SubmittedAnswer {
  optionId?: string;
  optionIds?: string[];
  value?: string | number;
  text?: string;
}

export interface GradeResult {
  correct: boolean;
  explanation: string;
  correctAnswerLabel: string;
  distractorNote?: string;
  misconceptionTags: string[];
  requiresManualReview: boolean;
}

/**
 * Server-side grading. Answer keys never leave the server, so this is the only
 * place a response is judged.
 */
export function gradeAnswer(question: Question, answer: SubmittedAnswer): GradeResult {
  const base = {
    explanation: question.explanation,
    misconceptionTags: question.misconceptionTags ?? [],
    requiresManualReview: false,
  };

  switch (question.type) {
    case "mcq":
    case "true_false": {
      const correct = Boolean(answer.optionId) && answer.optionId === question.correctOptionId;
      return {
        ...base,
        correct,
        correctAnswerLabel: labelForOption(question, question.correctOptionId),
        distractorNote: !correct && answer.optionId ? question.distractorRationale?.[answer.optionId] : undefined,
      };
    }

    case "multi_select": {
      const expected = new Set(question.correctOptionIds ?? []);
      const received = new Set(answer.optionIds ?? []);
      const correct = expected.size === received.size && [...expected].every((id) => received.has(id));
      return {
        ...base,
        correct,
        correctAnswerLabel: (question.correctOptionIds ?? []).map((id) => labelForOption(question, id)).join(", "),
      };
    }

    case "numeric": {
      const expected = Number(question.correctValue);
      const received = Number(answer.value);
      const tolerance = question.tolerance ?? 0;
      const correct = Number.isFinite(received) && Math.abs(received - expected) <= tolerance;
      return { ...base, correct, correctAnswerLabel: String(question.correctValue) };
    }

    case "short_answer": {
      const expected = normalise(String(question.correctValue ?? ""));
      const received = normalise(String(answer.value ?? answer.text ?? ""));
      return { ...base, correct: expected.length > 0 && expected === received, correctAnswerLabel: String(question.correctValue) };
    }

    case "theory":
    case "matching":
    case "ordering":
    default:
      return {
        ...base,
        correct: false,
        correctAnswerLabel: question.markingGuide?.join(" · ") ?? "See marking guide",
        requiresManualReview: true,
      };
  }
}

function labelForOption(question: Question, optionId?: string): string {
  if (!optionId) return "";
  return question.options?.find((o) => o.id === optionId)?.text ?? optionId;
}

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Adaptive selection: start near the requested difficulty, step up after two
 * consecutive successes and down after two errors, never repeating a question.
 */
export interface SelectionState {
  answeredIds: string[];
  consecutiveCorrect: number;
  consecutiveWrong: number;
  difficulty: 1 | 2 | 3;
}

export function initialSelectionState(startDifficulty: 1 | 2 | 3 = 1): SelectionState {
  return { answeredIds: [], consecutiveCorrect: 0, consecutiveWrong: 0, difficulty: startDifficulty };
}

export function advanceSelection(state: SelectionState, questionId: string, correct: boolean): SelectionState {
  const consecutiveCorrect = correct ? state.consecutiveCorrect + 1 : 0;
  const consecutiveWrong = correct ? 0 : state.consecutiveWrong + 1;

  let difficulty = state.difficulty;
  if (consecutiveCorrect >= 2) difficulty = Math.min(3, difficulty + 1) as 1 | 2 | 3;
  if (consecutiveWrong >= 2) difficulty = Math.max(1, difficulty - 1) as 1 | 2 | 3;

  return {
    answeredIds: [...state.answeredIds, questionId],
    consecutiveCorrect: consecutiveCorrect >= 2 ? 0 : consecutiveCorrect,
    consecutiveWrong: consecutiveWrong >= 2 ? 0 : consecutiveWrong,
    difficulty,
  };
}

export function selectNextQuestion(pool: Question[], state: SelectionState): Question | null {
  const remaining = pool.filter((q) => !state.answeredIds.includes(q.id));
  if (remaining.length === 0) return null;

  const exact = remaining.filter((q) => q.difficulty === state.difficulty);
  if (exact.length > 0) return exact[0];

  return [...remaining].sort(
    (a, b) => Math.abs(a.difficulty - state.difficulty) - Math.abs(b.difficulty - state.difficulty),
  )[0];
}
