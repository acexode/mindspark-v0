import "server-only";
import { generateText, streamText } from "ai";
import { getDeterministicTutorResponse, PROMPT_VERSION, type TutorContext } from "@/lib/domain/tutor/fallback";
import { buildMessages, buildSystemPrompt } from "@/lib/domain/tutor/prompt";
import { guardedStream } from "@/lib/domain/tutor/guarded-stream";
import { checkScope, offTopicReply } from "@/lib/domain/tutor/scope";
import { tutorProviders, type ProviderName } from "./providers";
import { isStudyMessage } from "./scope-check";
import { isSuggestedQuestion } from "./suggestions";

export type { TutorContext };

export interface TutorReply {
  response: string;
  strategy: string;
  promptVersion: string;
  /** "scope" is a deliberate redirect, not a failure: the UI must not call it offline guidance. */
  source: ProviderName | "fallback" | "scope";
}

export interface TutorStream {
  source: TutorReply["source"];
  promptVersion: string;
  stream: ReadableStream<Uint8Array>;
}

const MAX_TOKENS = 400;
/**
 * Longest the model may stay silent mid-reply. Generous, because a CPU-only machine can pause between
 * tokens, yet far shorter than a whole reply: the old single 60s deadline cut slow answers off silently.
 */
const STREAM_IDLE_MS = 30_000;
/** Absolute cap on one streamed reply, so a model that keeps trickling output cannot hold a request open forever. */
const STREAM_CEILING_MS = 5 * 60_000;
/** Low enough to keep small models from drifting on arithmetic, high enough to avoid canned wording. */
const TEMPERATURE = 0.3;

function fallbackReply(context: TutorContext): TutorReply {
  return { ...getDeterministicTutorResponse(context), promptVersion: PROMPT_VERSION, source: "fallback" };
}

function scopeReply(context: TutorContext): TutorReply {
  return { response: offTopicReply(context), strategy: "scope-redirect", promptVersion: PROMPT_VERSION, source: "scope" };
}

/** Free pattern check first, then a short model check; off-topic messages never reach the tutor prompt. */
async function withinScope(context: TutorContext): Promise<boolean> {
  if (!checkScope(context.userMessage).allowed) return false;
  // A question this server wrote from the lesson itself is on topic by construction.
  if (isSuggestedQuestion(context, context.userMessage)) return true;
  return isStudyMessage(context);
}

function singleChunkStream(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
}

export async function generateTutorTurn(context: TutorContext): Promise<TutorReply> {
  if (!(await withinScope(context))) return scopeReply(context);

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
  const redirect = (): TutorStream => {
    const { response, promptVersion, source } = scopeReply(context);
    return { source, promptVersion, stream: singleChunkStream(response) };
  };

  if (!(await withinScope(context))) return redirect();

  for (const provider of tutorProviders()) {
    // `timeoutMs` now bounds the wait for the FIRST token (a cold model load plus reading the prompt),
    // not the whole reply. Once words are flowing, silence between chunks is what is watched.
    const controller = new AbortController();
    const firstTokenTimer = setTimeout(() => controller.abort(), provider.timeoutMs);
    let ceilingTimer: ReturnType<typeof setTimeout> | undefined;

    try {
      const result = streamText({
        model: provider.model,
        system: buildSystemPrompt(context),
        messages: buildMessages(context),
        maxTokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        maxRetries: 0,
        abortSignal: controller.signal,
        onError: () => {},
      });

      const chunks = result.textStream[Symbol.asyncIterator]();
      const first = await chunks.next();
      clearTimeout(firstTokenTimer);
      if (first.done || !first.value) {
        controller.abort();
        continue;
      }

      ceilingTimer = setTimeout(() => controller.abort(), STREAM_CEILING_MS);
      const stream = guardedStream(first.value, chunks, {
        idleMs: STREAM_IDLE_MS,
        finishReason: result.finishReason,
        onStall: () => controller.abort(),
        onEnd: () => clearTimeout(ceilingTimer),
      });

      return { source: provider.name, promptVersion: PROMPT_VERSION, stream };
    } catch {
      // Unreachable, model not pulled, or no first token in time — fall through to the next provider.
      clearTimeout(firstTokenTimer);
      clearTimeout(ceilingTimer);
      controller.abort();
    }
  }

  const { response } = fallbackReply(context);
  return { source: "fallback", promptVersion: PROMPT_VERSION, stream: singleChunkStream(response) };
}
