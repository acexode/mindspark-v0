import type { ContentBlock } from "@/lib/content/schema";

/**
 * How much lesson text the tutor is given, in characters (~1,250 tokens of prose).
 *
 * Small local models have small context windows, and the system prompt, the chat history
 * and the reply all share it. Measured across the published lessons, this fits about 90%
 * of them whole; the rest are cut at a block boundary rather than mid-sentence.
 */
export const GROUNDING_CHAR_BUDGET = 5000;

/**
 * The text of one lesson block as the tutor should see it, or "" if it adds nothing.
 *
 * Worked examples, tables, lists and displayed maths are most of what a university lesson
 * actually teaches — a command sequence or a calculation lives there, not in the prose — so
 * leaving them out meant the tutor "grounded" itself on barely more than half the lesson.
 */
export function blockToGroundingText(block: ContentBlock): string {
  switch (block.type) {
    case "text":
      return block.markdown;
    case "callout":
      return `${block.title}: ${block.text}`;
    case "summary":
      return block.points.join(" ");
    case "list":
      return block.items.map((item) => `- ${item}`).join("\n");
    case "table":
      return [block.headers.join(" | "), ...block.rows.map((row) => row.join(" | "))].join("\n");
    case "math":
      return `$${block.latex}$`;
    case "worked_example":
      return [
        `Worked example, ${block.title}: ${block.prompt}`,
        ...block.steps.map((step, index) => `${index + 1}. ${step.text}${step.latex ? ` $${step.latex}$` : ""}`),
        `Answer: ${block.answer}`,
      ].join("\n");
    // A hook is atmosphere, a check is a question the student is about to answer, and media
    // blocks carry no text the tutor can use.
    default:
      return "";
  }
}

/**
 * Lesson text for the tutor prompt, in lesson order, within the character budget.
 * Stops at the first block that does not fit rather than skipping ahead, so what the tutor
 * sees is always a coherent opening of the lesson.
 */
export function buildGroundingText(blocks: readonly ContentBlock[], budget: number = GROUNDING_CHAR_BUDGET): string {
  const parts = blocks.map(blockToGroundingText).filter((part) => part.trim().length > 0);
  const kept: string[] = [];
  let used = 0;

  for (const part of parts) {
    const cost = part.length + (kept.length > 0 ? 2 : 0);
    if (used + cost > budget) {
      // Never hand back nothing: a first block longer than the whole budget is cut instead.
      if (kept.length === 0) kept.push(part.slice(0, budget));
      break;
    }
    kept.push(part);
    used += cost;
  }

  return kept.join("\n\n");
}
