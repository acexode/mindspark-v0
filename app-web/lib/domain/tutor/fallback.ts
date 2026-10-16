export type TutorSurface = "general" | "lesson" | "practice" | "quiz-review";

/** explain: answer directly. hint: one nudge, no final answer. check-my-thinking: judge the student's own reasoning. */
export type TutorMode = "explain" | "hint" | "check-my-thinking";

export interface TutorTurn {
  role: "student" | "tutor";
  text: string;
}

/** A question the student has already attempted. Answer-key fields are filled in by the server only. */
export interface TutorQuestionContext {
  stem: string;
  studentAnswerLabel: string;
  /** Null when the question cannot be auto-graded. */
  wasCorrect: boolean | null;
  correctAnswerLabel: string;
  explanation: string;
  /** Rationale for the specific wrong option the student picked, when the author wrote one. */
  distractorNote?: string;
}

export interface TutorContext {
  ageBand: string;
  educationLevel: string;
  subjectName: string;
  topicName?: string;
  subtopicName?: string;
  objectives: string[];
  /** Reviewed lesson text the reply must stay grounded in. */
  groundingText?: string;
  alternateExplanation: boolean;
  userMessage?: string;
  surface?: TutorSurface;
  mode?: TutorMode;
  history?: TutorTurn[];
  question?: TutorQuestionContext;
}

export const PROMPT_VERSION = "tutor-v3.0.0";

/**
 * Deterministic replies used whenever no AI provider is configured or a call
 * fails. Subject-agnostic so every subject has a working tutor on day one.
 */
export function getDeterministicTutorResponse(context: TutorContext): { response: string; strategy: string } {
  const subject = context.subjectName;
  const focus = context.subtopicName ?? context.topicName ?? subject;

  if (context.alternateExplanation) {
    return {
      strategy: "alternate-representation",
      response: context.objectives.length
        ? `Let's approach ${focus} differently. Try this: ${context.objectives[0]}. Work through that one goal in your own words first, then check it against the worked example in the lesson.`
        : `Let's approach ${focus} from another angle. Explain it back to me in your own words, one sentence at a time, and I'll tell you where the reasoning breaks.`,
    };
  }

  if (context.question && context.question.wasCorrect !== true) {
    return {
      strategy: "socratic",
      response: `Let's look at that question again. Re-read what it asks and tell me which idea from ${focus} it is testing. Then check your choice against the lesson, one step at a time.`,
    };
  }

  if (context.userMessage) {
    return {
      strategy: "socratic",
      response: `Good question about ${focus}. Before I answer, tell me which part you are sure about and which part loses you. Naming the exact step usually reveals the gap — and it is the step I want us to work on.`,
    };
  }

  if (context.objectives.length > 0) {
    return {
      strategy: "socratic",
      response: `We are working towards this: ${context.objectives[0]}. In your own words, what is the first thing you would do to get there?`,
    };
  }

  return {
    strategy: "socratic",
    response: `Let's start with ${focus}. What do you already know about it, and where does your understanding stop?`,
  };
}
