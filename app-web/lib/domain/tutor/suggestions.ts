import type { TutorContext } from "./fallback";

export const SUGGESTION_COUNT = 3;
const MAX_QUESTION_CHARS = 110;

export type SuggestionFocus = Pick<
  TutorContext,
  "subjectName" | "topicName" | "subtopicName" | "objectives" | "groundingText" | "educationLevel"
>;

/** Stable key for one unit, used to cache suggestions and to recognise them when the student taps one. */
export function suggestionKey(focus: Pick<TutorContext, "subjectName" | "topicName" | "subtopicName">): string {
  return [focus.subjectName, focus.topicName ?? "", focus.subtopicName ?? ""].join("|");
}

export function buildSuggestionMessages(focus: SuggestionFocus): { system: string; prompt: string } {
  const unit = focus.subtopicName ?? focus.topicName ?? focus.subjectName;
  const system = `You write short study questions a student might ask a tutor about ONE lesson.
Rules:
- Write exactly ${SUGGESTION_COUNT} questions, one per line, no numbering, no bullets, no extra text.
- Each question must name or clearly depend on a specific idea, term, number or step from the lesson text. Never write generic questions such as "Give me an example".
- Vary them: one asking why or how something works, one about a worked example, step or calculation, one about a common mistake or confusion.
- Each question is under ${MAX_QUESTION_CHARS} characters, phrased the way a student would say it, and ends with a question mark.
- Use only facts in the lesson text. Do not invent content.`;

  const objectives = focus.objectives.length ? `Objectives:\n${focus.objectives.map((o) => `- ${o}`).join("\n")}\n\n` : "";
  const lesson = focus.groundingText ? `Lesson text:\n${focus.groundingText.slice(0, 3500)}` : "No lesson text is available; use the objectives.";
  return { system, prompt: `Subject: ${focus.subjectName}\nUnit: ${unit}\n\n${objectives}${lesson}\n\nThe ${SUGGESTION_COUNT} questions:` };
}

/** Turns a model reply into clean, distinct questions; anything malformed is dropped rather than shown. */
export function parseSuggestions(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw
      .replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "")
      .replace(/^["'“”]+|["'“”]+$/g, "")
      .trim();
    if (line.length < 12 || line.length > MAX_QUESTION_CHARS || !line.endsWith("?")) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
    if (out.length === SUGGESTION_COUNT) break;
  }
  return out;
}

/** Short chip label for a full question: the question itself, trimmed at a word boundary. */
export function chipLabel(question: string, max = 46): string {
  if (question.length <= max) return question;
  const cut = question.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 20 ? cut.lastIndexOf(" ") : cut.length)}…`;
}

/** Next questions for a chat already under way: built on what was just explained, never repeating what was asked. */
export function buildFollowUpMessages(
  focus: SuggestionFocus,
  history: ReadonlyArray<{ role: "student" | "tutor"; text: string }>,
): { system: string; prompt: string } {
  const base = buildSuggestionMessages(focus);
  const system = `${base.system}
- This is a follow-up: the student has already been chatting. Write questions that naturally come NEXT, building on the tutor's latest answer (a deeper why, a variation, a related step, a check of understanding).
- Never repeat or rephrase a question the student already asked.`;
  const convo = history
    .slice(-4)
    .map((t) => `${t.role === "student" ? "Student" : "Tutor"}: ${t.text.slice(0, 900)}`)
    .join("\n");
  return { system, prompt: `${base.prompt.replace(/\n\nThe \d+ questions:$/, "")}\n\nConversation so far:\n${convo}\n\nThe ${SUGGESTION_COUNT} follow-up questions:` };
}
