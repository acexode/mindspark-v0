import "server-only";
import { generateText } from "ai";
import type { TutorContext } from "@/lib/domain/tutor/fallback";
import { buildFollowUpMessages, buildSuggestionMessages, parseSuggestions, suggestionKey } from "@/lib/domain/tutor/suggestions";
import { tutorProviders } from "./providers";

const cache = new Map<string, string[]>();
/** Follow-ups written during chats; also trusted, so tapping one never trips the scope check. */
const followUps = new Map<string, Set<string>>();
const inflight = new Map<string, Promise<string[]>>();
const MAX_CACHE = 500;
const GENERATE_TIMEOUT_MS = 45_000;

/** True when `message` is one of the questions this server wrote for the unit, so it needs no scope check. */
export function isSuggestedQuestion(context: Pick<TutorContext, "subjectName" | "topicName" | "subtopicName">, message?: string): boolean {
  if (!message) return false;
  const key = suggestionKey(context);
  const text = message.trim();
  return (cache.get(key)?.includes(text) ?? false) || (followUps.get(key)?.has(text) ?? false);
}

/**
 * Lesson-specific questions for one unit, written by the model from the lesson text. Cached per
 * unit (lesson content only changes on re-import) and de-duplicated while a generation is running.
 * Returns [] when no provider answers; the UI then keeps its generic chips.
 */
export async function suggestQuestions(context: TutorContext): Promise<string[]> {
  if (context.history && context.history.length > 0) return suggestFollowUps(context);
  const key = suggestionKey(context);
  const hit = cache.get(key);
  if (hit) return hit;
  const running = inflight.get(key);
  if (running) return running;

  const job = (async () => {
    const questions = await generate(buildSuggestionMessages(context));
    if (questions.length >= 1) {
      if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value as string);
      cache.set(key, questions);
    }
    return questions;
  })().finally(() => inflight.delete(key));

  inflight.set(key, job);
  return job;
}

async function suggestFollowUps(context: TutorContext): Promise<string[]> {
  const asked = new Set((context.history ?? []).filter((t) => t.role === "student").map((t) => t.text.trim().toLowerCase()));
  const questions = (await generate(buildFollowUpMessages(context, context.history ?? []))).filter((q) => !asked.has(q.toLowerCase()));
  if (questions.length > 0) {
    const key = suggestionKey(context);
    const set = followUps.get(key) ?? new Set<string>();
    questions.forEach((q) => set.add(q));
    if (set.size > 60) [...set].slice(0, set.size - 60).forEach((q) => set.delete(q));
    if (followUps.size >= MAX_CACHE) followUps.delete(followUps.keys().next().value as string);
    followUps.set(key, set);
  }
  return questions;
}

async function generate({ system, prompt }: { system: string; prompt: string }): Promise<string[]> {
  {
    for (const provider of tutorProviders()) {
      try {
        const { text } = await generateText({
          model: provider.model,
          system,
          prompt,
          maxTokens: 160,
          temperature: 0.4,
          maxRetries: 0,
          abortSignal: AbortSignal.timeout(Math.max(provider.timeoutMs, GENERATE_TIMEOUT_MS)),
        });
        const questions = parseSuggestions(text);
        if (questions.length >= 1) return questions;
      } catch {
        // Try the next provider.
      }
    }
    return [];
  }
}
