import "server-only";
import { generateText, streamText } from "ai";
import { getDeterministicTutorResponse, PROMPT_VERSION, type TutorContext } from "@/lib/domain/tutor/fallback";
import { buildMessages, buildSystemPrompt } from "@/lib/domain/tutor/prompt";
import { tutorProviders, type ProviderName } from "./providers";

export type { TutorContext };

export interface TutorReply {
  response: string;
  strategy: string;
  promptVersion: string;
  source: ProviderName | "fallback";
}

export interface TutorStream {
  source: TutorReply["source"];
  promptVersion: string;
  stream: ReadableStream<Uint8Array>;
}

const MAX_TOKENS = 400;
/** Low enough to keep small models from drifting on arithmetic, high enough to avoid canned wording. */
const TEMPERATURE = 0.3;

function fallbackReply(context: TutorContext): TutorReply {
  return { ...getDeterministicTutorResponse(context), promptVersion: PROMPT_VERSION, source: "fallback" };
}

export async function generateTutorTurn(context: TutorContext): Promise<TutorReply> {
  for (const provider of tutorProviders()) {
    try {
      const { text } = await generateText({
        model: provider.model,
        system: buildSystemPrompt(context),
        messages: buildMessages(context),
        maxTokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(provider.timeoutMs),
      });

      const response = text.trim();
      if (response) {
        const strategy = context.alternateExplanation ? "alternate-representation" : "socratic";
        return { response, strategy, promptVersion: PROMPT_VERSION, source: provider.name };
      }
    } catch {
      // Unreachable, model not pulled, or timed out — try the next provider.
    }
  }

  return fallbackReply(context);
}

/**
 * Same provider order as generateTutorTurn, but the reply is streamed as it is
 * written. A provider only wins once its first chunk arrives, so a dead or
 * missing model still falls through to the next provider before any bytes are sent.
 */
export async function streamTutorTurn(context: TutorContext): Promise<TutorStream> {
  const encoder = new TextEncoder();

  for (const provider of tutorProviders()) {
    try {
      const result = streamText({
        model: provider.model,
        system: buildSystemPrompt(context),
        messages: buildMessages(context),
        maxTokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(provider.timeoutMs),
        onError: () => {},
      });

      const chunks = result.textStream[Symbol.asyncIterator]();
      const first = await chunks.next();
      if (first.done || !first.value) continue;

      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(first.value));
        },
        async pull(controller) {
          try {
            const next = await chunks.next();
            if (next.done) controller.close();
            else controller.enqueue(encoder.encode(next.value));
          } catch {
            // A mid-stream failure keeps what the student has already read.
            controller.close();
          }
        },
        cancel() {
          void chunks.return?.();
        },
      });

      return { source: provider.name, promptVersion: PROMPT_VERSION, stream };
    } catch {
      // Fall through to the next provider.
    }
  }

  const { response } = fallbackReply(context);
  return {
    source: "fallback",
    promptVersion: PROMPT_VERSION,
    stream: new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(response));
        controller.close();
      },
    }),
  };
}
