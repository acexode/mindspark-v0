export interface TutorContext {
  ageBand: string;
  educationLevel: string;
  conceptId: string;
  equationStep: number;
  solved: boolean;
  recentAttempts: number;
  alternateExplanation: boolean;
  userMessage?: string;
}

export const PROMPT_VERSION = "tutor-v1.0.0";

const FALLBACK_RESPONSES: Record<string, string[]> = {
  socratic: [
    "Why must we apply the same operation to both sides of the equation?",
    "What happens to the balance if we only change one side?",
    "Which term is preventing x from being alone?",
  ],
  hint: [
    "Look at the constant term on the left. What inverse operation removes +5?",
    "Think of the equation as a balanced scale. Both trays must change equally.",
  ],
  alternate: [
    "Imagine an equal balance. Taking 5 from only one tray would tip it. What must happen to the other tray?",
    "Picture two identical boxes. If you remove 5 marbles from one, you must remove 5 from the other to stay equal.",
  ],
};

export function getDeterministicTutorResponse(context: TutorContext): { response: string; strategy: string } {
  if (context.alternateExplanation) {
    return { response: FALLBACK_RESPONSES.alternate[0], strategy: "alternate-representation" };
  }
  if (context.solved) {
    return {
      response: "You kept the equation balanced. Why does 3x remain after the fives cancel?",
      strategy: "socratic",
    };
  }
  if (context.recentAttempts >= 2) {
    return { response: FALLBACK_RESPONSES.hint[0], strategy: "hint-ladder" };
  }
  return { response: FALLBACK_RESPONSES.socratic[0], strategy: "socratic" };
}
