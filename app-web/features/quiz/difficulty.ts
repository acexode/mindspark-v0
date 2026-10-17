/**
 * Minutes allowed per question, by difficulty. Easy gives the most thinking
 * time; medium sits close to easy so the step down doesn't feel punishing;
 * hard is a deliberately tight, exam-pressure pace.
 */
export const DIFFICULTY_MINUTES_PER_QUESTION = {
  easy: 2.2,
  medium: 1.8,
  hard: 1.0,
} as const;

export type QuizDifficulty = keyof typeof DIFFICULTY_MINUTES_PER_QUESTION;

export const DIFFICULTY_LABELS: Record<QuizDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const QUIZ_DIFFICULTIES = Object.keys(DIFFICULTY_MINUTES_PER_QUESTION) as QuizDifficulty[];

export function resolveDifficulty(value: string | undefined): QuizDifficulty {
  return value === "easy" || value === "medium" || value === "hard" ? value : "medium";
}

/** Whole minutes for a paper, matching how the session computes its timer. */
export function quizMinutes(questionCount: number, difficulty: QuizDifficulty): number {
  return Math.round(questionCount * DIFFICULTY_MINUTES_PER_QUESTION[difficulty]);
}
