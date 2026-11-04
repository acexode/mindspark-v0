/**
 * What counts as an explanation that teaches, versus filler.
 *
 * The validator only required 20 characters, so "The correct answer is B." passed. About one
 * in five generated undergraduate questions carried exactly that, which tells a student who got
 * a question wrong nothing they did not already see. One definition lives here so the validator,
 * the generator and the repair job cannot disagree about it.
 */

/** A restated answer with no reasoning: short, and opening with the stock phrase. */
export function isPlaceholderExplanation(explanation: string): boolean {
  const text = explanation.trim();
  return text.length < 70 && /^The correct answer is\b/i.test(text);
}

const MIN_EXPLANATION_CHARS = 60;
const MAX_EXPLANATION_CHARS = 900;

/** Why a candidate explanation is not good enough to store, or null when it is fine. */
export function explanationProblem(explanation: unknown): string | null {
  if (typeof explanation !== "string") return "not a string";
  const text = explanation.trim();
  if (text.length < MIN_EXPLANATION_CHARS) return `too short (${text.length} chars)`;
  if (text.length > MAX_EXPLANATION_CHARS) return `too long (${text.length} chars)`;
  if (/^The correct answer is\b/i.test(text)) return 'opens with "The correct answer is" instead of explaining';
  // "null" is deliberately not listed: it is ordinary vocabulary in statistics ("the null hypothesis").
  if (/\bundefined\b|\[object Object\]/.test(text)) return "contains a leaked programming value";
  // MathText treats "$" as a maths delimiter, so an odd count breaks the rest of the paragraph.
  if ((text.match(/\$/g) ?? []).length % 2 !== 0) return 'unpaired "$" (write currency in words)';
  // Option letters move when a quiz shuffles its choices, so an explanation must not rely on them.
  if (/\b(?:option|choice|answer)\s+\(?[a-h]\)?(?=[\s.,;:)])/i.test(text)) return "refers to an option by letter";
  return null;
}
