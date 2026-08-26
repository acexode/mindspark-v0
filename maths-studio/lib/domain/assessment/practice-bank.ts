export interface PracticeQuestion {
  id: string;
  conceptId: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  options: string[];
  correctIndex: number;
  misconception?: string;
}

export const PRACTICE_BANK: PracticeQuestion[] = [
  {
    id: "p1",
    conceptId: "linear-equations",
    difficulty: 1,
    prompt: "Solve: x + 7 = 12",
    options: ["x = 3", "x = 5", "x = 7"],
    correctIndex: 1,
  },
  {
    id: "p2",
    conceptId: "linear-equations",
    difficulty: 2,
    prompt: "Solve: 2x = 14",
    options: ["x = 6", "x = 7", "x = 12"],
    correctIndex: 1,
  },
  {
    id: "p3",
    conceptId: "linear-equations",
    difficulty: 2,
    prompt: "Solve: 4x + 2 = 18",
    options: ["x = 4", "x = 5", "x = 8"],
    correctIndex: 0,
  },
  {
    id: "p4",
    conceptId: "linear-equations",
    difficulty: 3,
    prompt: "Solve: 5x − 3 = 22",
    options: ["x = 4", "x = 5", "x = 6"],
    correctIndex: 1,
  },
  {
    id: "p5",
    conceptId: "algebra-basics",
    difficulty: 1,
    prompt: "If 3 + x = 8, what is x?",
    options: ["x = 3", "x = 5", "x = 11"],
    correctIndex: 1,
    misconception: "inverse-operation",
  },
];

export interface PracticeSessionState {
  questionIds: string[];
  currentIndex: number;
  correctCount: number;
  errorsOnConcept: Record<string, number>;
  difficulty: 1 | 2 | 3;
}

export function createPracticeSession(mode: "normal" | "repair" | "retention" = "normal"): PracticeSessionState {
  let pool = [...PRACTICE_BANK];
  if (mode === "repair") {
    pool = pool.filter((q) => q.conceptId === "algebra-basics" || q.difficulty === 1);
  }
  return {
    questionIds: pool.slice(0, 3).map((q) => q.id),
    currentIndex: 0,
    correctCount: 0,
    errorsOnConcept: {},
    difficulty: mode === "retention" ? 2 : 1,
  };
}

export function selectNextPracticeQuestion(state: PracticeSessionState): PracticeQuestion | null {
  if (state.currentIndex >= state.questionIds.length) return null;
  const id = state.questionIds[state.currentIndex];
  return PRACTICE_BANK.find((q) => q.id === id) ?? null;
}

export function processPracticeAnswer(
  state: PracticeSessionState,
  question: PracticeQuestion,
  selectedIndex: number,
): PracticeSessionState {
  const correct = selectedIndex === question.correctIndex;
  const errorsOnConcept = { ...state.errorsOnConcept };

  if (!correct) {
    errorsOnConcept[question.conceptId] = (errorsOnConcept[question.conceptId] ?? 0) + 1;
  }

  let difficulty = state.difficulty;
  if (correct && state.correctCount >= 1) {
    difficulty = Math.min(3, difficulty + 1) as 1 | 2 | 3;
  } else if (!correct && (errorsOnConcept[question.conceptId] ?? 0) >= 2) {
    difficulty = Math.max(1, difficulty - 1) as 1 | 2 | 3;
  }

  return {
    ...state,
    currentIndex: state.currentIndex + 1,
    correctCount: state.correctCount + (correct ? 1 : 0),
    errorsOnConcept,
    difficulty,
  };
}

export function getQuestionById(id: string): PracticeQuestion | undefined {
  return PRACTICE_BANK.find((q) => q.id === id);
}
