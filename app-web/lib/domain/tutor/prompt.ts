import type { TutorContext, TutorMode, TutorSurface } from "./fallback";

/** Small local models follow short, concrete rules better than long policy text. */
const MODE_RULES: Record<TutorMode, string> = {
  explain:
    "Answer the student's question directly and clearly. Use the lesson content. Add one short example if it helps. You may state the answer.",
  hint: "Do NOT state the final answer. Give one hint or ask one guiding question that moves the student a single step forward.",
  "check-my-thinking":
    "The student is answering a question you asked, or sharing their own reasoning. Say clearly whether it is right. If it is wrong, point out the first step that goes wrong and give one hint, without stating the full answer. If it is right, praise it briefly and add one extra insight.",
};

/** Question surfaces default to a nudge; everywhere else the student asked, so answer. */
export function defaultModeFor(surface: TutorSurface | undefined): TutorMode {
  return surface === "practice" || surface === "quiz-review" ? "hint" : "explain";
}

export function resolveMode(context: Pick<TutorContext, "mode" | "surface">): TutorMode {
  return context.mode ?? defaultModeFor(context.surface);
}

export function buildSystemPrompt(context: TutorContext): string {
  const mode = resolveMode(context);
  const { question } = context;

  const register =
    context.educationLevel === "undergraduate"
      ? "Use precise academic language and correct notation."
      : context.ageBand === "12-13"
        ? "Use short sentences, concrete examples and everyday analogies. Be warm and upbeat."
        : "Be friendly and upbeat like a clever older student. Keep it clear and relatable for a senior secondary student preparing for WAEC, NECO or JAMB. An occasional emoji is fine; never let slang hide the meaning.";

  const questionBlock = question
    ? [
        "The student is asking about this question:",
        `Question: ${question.stem}`,
        `Student's answer: ${question.studentAnswerLabel || "(no answer)"}`,
        question.wasCorrect === null
          ? "This question is marked by hand, so you cannot tell if they were right."
          : question.wasCorrect
            ? "Their answer was correct."
            : "Their answer was wrong.",
        question.distractorNote ? `Why that choice is a common mistake: ${question.distractorNote}` : "",
        // Question surfaces only open after the student has been shown the verdict and explanation, so the
        // key is no secret here. Withholding it made a small model redo the arithmetic and get it wrong.
        `Correct answer: ${question.correctAnswerLabel}\nOfficial explanation: ${question.explanation}`,
        "Use the official explanation as the source of truth for every number. Check each calculation before you write it.",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return [
    `You are the Mindspark tutor, helping with ${context.subjectName}.`,
    context.topicName ? `Topic: ${context.topicName}.` : "",
    context.subtopicName ? `The student is studying: ${context.subtopicName}.` : "",
    context.objectives.length ? `Learning objectives:\n- ${context.objectives.join("\n- ")}` : "",
    context.groundingText
      ? `Approved lesson content you must stay consistent with:\n"""\n${context.groundingText.slice(0, 4000)}\n"""`
      : "",
    questionBlock,
    register,
    MODE_RULES[mode],
    "Never invent curriculum facts; if you are unsure, say so plainly. Write maths in LaTeX between $ signs. Keep replies under 150 words.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** What the model is asked when the student sent no text (e.g. tapped "Explain another way"). */
export function buildDefaultUserPrompt(context: TutorContext): string {
  if (context.alternateExplanation) {
    return "The student did not understand. Explain using a genuinely different representation, not a paraphrase.";
  }
  if (context.question) {
    return resolveMode(context) === "explain"
      ? "Explain this question to the student, including why their answer was right or wrong."
      : "Help the student understand this question without giving the answer away.";
  }
  return resolveMode(context) === "explain"
    ? "Give a short, friendly overview of what the student is studying."
    : "Give one Socratic question or one progressive hint for what the student is studying.";
}

/** Prior turns in the chat-completion shape, oldest first. */
export function buildMessages(context: TutorContext): { role: "user" | "assistant"; content: string }[] {
  const history = (context.history ?? []).map((turn) => ({
    role: turn.role === "student" ? ("user" as const) : ("assistant" as const),
    content: turn.text,
  }));
  return [...history, { role: "user", content: context.userMessage ?? buildDefaultUserPrompt(context) }];
}
