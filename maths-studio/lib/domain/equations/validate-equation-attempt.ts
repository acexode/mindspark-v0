import type { EquationOperation } from "./types";

export interface ValidationResult {
  correct: boolean;
  feedback: string;
  misconception?: "inverse-operation" | "unbalanced" | "premature-divide";
}

export function validateBalanceAttempt(operation: EquationOperation, currentStep = 0): ValidationResult {
  if (currentStep === 0) {
    if (operation === "subtract-five") {
      return { correct: true, feedback: "Correct — both sides stayed equal." };
    }
    if (operation === "add-five") {
      return {
        correct: false,
        feedback: "Adding 5 would increase both sides. We need to remove the constant +5.",
        misconception: "inverse-operation",
      };
    }
    return {
      correct: false,
      feedback: "Divide after isolating the variable term. First remove the constant.",
      misconception: "premature-divide",
    };
  }

  if (currentStep === 2) {
    if (operation === "divide-three") {
      return { correct: true, feedback: "Correct — you divided both sides by 3." };
    }
    if (operation === "subtract-five") {
      return {
        correct: false,
        feedback: "The constant is already removed. What operation isolates x?",
        misconception: "inverse-operation",
      };
    }
    return {
      correct: false,
      feedback: "Adding would undo your progress. Divide to isolate x.",
      misconception: "unbalanced",
    };
  }

  return { correct: false, feedback: "Apply the same operation to both sides." };
}

export function getNextStep(currentStep: number, operation: EquationOperation): number | null {
  const result = validateBalanceAttempt(operation, currentStep);
  if (!result.correct) return null;
  if (currentStep === 0) return 2;
  if (currentStep === 2) return 4;
  return null;
}
