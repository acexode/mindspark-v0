export interface DiagnosticQuestion {
  id: string;
  conceptId: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  options: string[];
  correctIndex: number;
  probePrerequisite?: string;
}

export interface DiagnosticState {
  questionIndex: number;
  score: number;
  currentDifficulty: 1 | 2 | 3;
  weakConcepts: Set<string>;
  answered: number;
  complete: boolean;
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "d1",
    conceptId: "number-sense",
    difficulty: 1,
    prompt: "What is 7 + 8?",
    options: ["13", "14", "15", "16"],
    correctIndex: 2,
  },
  {
    id: "d2",
    conceptId: "algebra-basics",
    difficulty: 1,
    prompt: "If x + 4 = 10, what is x?",
    options: ["4", "5", "6", "14"],
    correctIndex: 2,
  },
  {
    id: "d3",
    conceptId: "algebra-basics",
    difficulty: 2,
    prompt: "Which fraction is equal to 0.5?",
    options: ["1/4", "1/2", "2/3", "3/4"],
    correctIndex: 1,
  },
  {
    id: "d4",
    conceptId: "linear-equations",
    difficulty: 2,
    prompt: "Solve: 2x = 14",
    options: ["x = 6", "x = 7", "x = 12", "x = 28"],
    correctIndex: 1,
  },
  {
    id: "d5",
    conceptId: "linear-equations",
    difficulty: 2,
    prompt: "Solve: x + 7 = 12",
    options: ["x = 3", "x = 5", "x = 7", "x = 19"],
    correctIndex: 1,
  },
  {
    id: "d6",
    conceptId: "linear-equations",
    difficulty: 3,
    prompt: "Solve: 4x + 2 = 18",
    options: ["x = 4", "x = 5", "x = 8", "x = 20"],
    correctIndex: 0,
    probePrerequisite: "algebra-basics",
  },
  {
    id: "d7",
    conceptId: "algebra-basics",
    difficulty: 1,
    prompt: "What is the inverse of adding 5?",
    options: ["Adding 5", "Subtracting 5", "Multiplying by 5", "Dividing by 5"],
    correctIndex: 1,
    probePrerequisite: "algebra-basics",
  },
  {
    id: "d8",
    conceptId: "linear-equations",
    difficulty: 3,
    prompt: "Solve: 3x − 6 = 15",
    options: ["x = 3", "x = 5", "x = 7", "x = 9"],
    correctIndex: 2,
  },
];

export function createInitialDiagnosticState(): DiagnosticState {
  return {
    questionIndex: 0,
    score: 0,
    currentDifficulty: 1,
    weakConcepts: new Set(),
    answered: 0,
    complete: false,
  };
}

export function selectNextQuestion(state: DiagnosticState): DiagnosticQuestion | null {
  if (state.complete || state.answered >= 8) return null;

  const remaining = DIAGNOSTIC_QUESTIONS.filter((_, i) => i >= state.questionIndex);
  const match = remaining.find((q) => q.difficulty <= state.currentDifficulty + 1);
  return match ?? remaining[0] ?? null;
}

export function processDiagnosticAnswer(
  state: DiagnosticState,
  question: DiagnosticQuestion,
  selectedIndex: number,
): DiagnosticState {
  const correct = selectedIndex === question.correctIndex;
  const weakConcepts = new Set(state.weakConcepts);

  if (!correct && question.probePrerequisite) {
    weakConcepts.add(question.probePrerequisite);
  } else if (!correct) {
    weakConcepts.add(question.conceptId);
  }

  let currentDifficulty = state.currentDifficulty;
  if (correct && state.answered >= 2) {
    currentDifficulty = Math.min(3, currentDifficulty + 1) as 1 | 2 | 3;
  } else if (!correct) {
    currentDifficulty = Math.max(1, currentDifficulty - 1) as 1 | 2 | 3;
  }

  const answered = state.answered + 1;
  const earlyStop = answered >= 6 && (correct ? state.score + 1 >= 5 : state.score <= 1);
  const complete = answered >= 8 || earlyStop;

  return {
    questionIndex: state.questionIndex + 1,
    score: state.score + (correct ? 1 : 0),
    currentDifficulty,
    weakConcepts,
    answered,
    complete,
  };
}

export function diagnosticMasteryFromScore(score: number, weakConcepts: string[]): number {
  let base = 20 + score * 5;
  if (weakConcepts.includes("algebra-basics")) base = Math.min(base, 35);
  return Math.min(60, base);
}
