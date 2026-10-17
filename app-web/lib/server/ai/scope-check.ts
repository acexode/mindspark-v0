import "server-only";
import { generateText } from "ai";
import type { TutorContext } from "@/lib/domain/tutor/fallback";
import { buildScopeCheckMessages, readScopeVerdict } from "@/lib/domain/tutor/scope";
import { tutorProviders } from "./providers";

const CHECK_TIMEOUT_MS = 20_000;

/**
 * Asks a model whether the student's message is about studying. Fails open: if no provider
 * answers, the message is allowed and the tutor's own prompt still applies, so an outage
 * never blocks a student from legitimate help.
 */
export async function isStudyMessage(context: Pick<TutorContext, "userMessage" | "history">): Promise<boolean> {
  if (!context.userMessage?.trim()) return true;
  const { system, prompt } = buildScopeCheckMessages(context);

  for (const provider of tutorProviders()) {
    try {
      const { text } = await generateText({
        model: provider.model,
        system,
        prompt,
        maxTokens: 4,
        temperature: 0,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(Math.min(provider.timeoutMs, CHECK_TIMEOUT_MS)),
      });
      return readScopeVerdict(text) === "study";
    } catch {
      // Try the next provider.
    }
  }
  return true;
}
