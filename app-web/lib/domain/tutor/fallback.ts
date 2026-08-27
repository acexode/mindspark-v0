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
}

export const PROMPT_VERSION = "tutor-v2.0.0";

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
