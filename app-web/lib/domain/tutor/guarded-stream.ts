/**
 * Turns a model's text chunks into a response stream that can never silently stop halfway.
 *
 * Before this, one 60-second deadline covered the whole streamed reply and a mid-stream failure
 * simply closed the stream. On a slow, CPU-only machine a long answer was cut at 60 seconds and
 * the student saw it end as if it were finished. Now:
 *   - a stalled model is detected by silence between chunks, not by total time, so a slow but
 *     steady answer is allowed to finish, and
 *   - anything that stops early, whether a stall, an error or the token cap, is labelled.
 */

/** Appended when a reply stops before the model finished, so a cut-off answer never reads as a complete one. */
export const TRUNCATION_NOTICE = "\n\n[The answer was cut off. Ask me to continue.]";

export interface GuardOptions {
  /** Longest silence between chunks before the reply is declared stalled. */
  idleMs: number;
  /** Resolves with the model's finish reason once the stream ends. */
  finishReason?: Promise<string>;
  /** Called when the reply stalls, so the underlying model request can be aborted. */
  onStall?: () => void;
  /** Called once when the stream ends for any reason, to release timers. */
  onEnd?: () => void;
}

type Outcome = { kind: "chunk"; value: string } | { kind: "done" } | { kind: "stalled" } | { kind: "error" };

async function nextWithin(chunks: AsyncIterator<string>, ms: number): Promise<Outcome> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const stalled = new Promise<Outcome>((resolve) => {
    timer = setTimeout(() => resolve({ kind: "stalled" }), ms);
  });
  try {
    const next = chunks.next().then((result): Outcome => (result.done ? { kind: "done" } : { kind: "chunk", value: result.value }));
    return await Promise.race([next, stalled]);
  } catch {
    return { kind: "error" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Only "length" (the token cap) and "error" mean the reply is incomplete. "unknown" and "other"
 * are what a provider reports when it does not say, which must not make every reply look cut off.
 */
function isIncomplete(reason: string): boolean {
  return reason === "length" || reason === "error";
}

export function guardedStream(first: string, rest: AsyncIterator<string>, options: GuardOptions): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let ended = false;

  const finish = (controller: ReadableStreamDefaultController<Uint8Array>, incomplete: boolean) => {
    if (ended) return;
    ended = true;
    if (incomplete) controller.enqueue(encoder.encode(TRUNCATION_NOTICE));
    controller.close();
    options.onEnd?.();
  };

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(first));
    },
    async pull(controller) {
      if (ended) return;
      const outcome = await nextWithin(rest, options.idleMs);

      if (outcome.kind === "chunk") {
        controller.enqueue(encoder.encode(outcome.value));
        return;
      }
      if (outcome.kind === "stalled") options.onStall?.();

      let incomplete = outcome.kind !== "done";
      if (!incomplete && options.finishReason) {
        incomplete = isIncomplete(await options.finishReason.catch(() => "error"));
      }
      finish(controller, incomplete);
    },
    cancel() {
      if (!ended) {
        ended = true;
        options.onEnd?.();
      }
      void rest.return?.();
    },
  });
}
