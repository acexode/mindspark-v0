import "server-only";
import { generateText } from "ai";
import type { TutorContext } from "@/lib/domain/tutor/fallback";
import { buildSuggestionMessages, parseSuggestions, suggestionKey } from "@/lib/domain/tutor/suggestions";
import { tutorProviders } from "./providers";

const cache = new Map<string, string[]>();
const inflight = new Map<string, Promise<string[]>>();
const MAX_CACHE = 500;
const GENERATE_TIMEOUT_MS = 45_000;

/** True when `message` is one of the questions this server wrote for the unit, so it needs no scope check. */
export function isSuggestedQuestion(context: Pick<TutorContext, "subjectName" | "topicName" | "subtopicName">, message?: string): boolean {
  if (!message) return false;
  return cache.get(suggestionKey(context))?.includes(message.trim()) ?? false;
}

/**
 * Lesson-specific questions for one unit, written by the model from the lesson text. Cached per
 * unit (lesson content only changes on re-import) and de-duplicated while a generation is running.
 * Returns [] when no provider answers; the UI then keeps its generic chips.
 */
export async function suggestQuestions(context: TutorContext): Promise<string[]> {
  const key = suggestionKey(context);
  const hit = cache.get(key);
  if (hit) return hit;
  const running = inflight.get(key);
  if (running) return running;

  const job = (async () => {
    const { system, prompt } = buildSuggestionMessages(context);
    for (const provider of tutorProviders()) {
      try {
        const { text } = await generateText({
          model: provider.model,
          system,
          prompt,
          maxTokens: 220,
          temperature: 0.4,
          maxRetries: 0,
          abortSignal: AbortSignal.timeout(Math.max(provider.timeoutMs, GENERATE_TIMEOUT_MS)),
        });
        const questions = parseSuggestions(text);
        if (questions.length >= 2) {
          if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value as string);
          cache.set(key, questions);
          return questions;
        }
      } catch {
        // Try the next provider.
      }
    }
    return [];
  })().finally(() => inflight.delete(key));

  inflight.set(key, job);
  return job;
}
