import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { guardedStream, TRUNCATION_NOTICE } from "./guarded-stream";

async function readAll(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return out;
    out += decoder.decode(value);
  }
}

function iteratorOf(chunks: string[]): AsyncIterator<string> {
  return (async function* () {
    for (const chunk of chunks) yield chunk;
  })();
}

describe("guardedStream", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("passes a complete reply through untouched", async () => {
    const stream = guardedStream("Hello", iteratorOf([", ", "world"]), { idleMs: 1000, finishReason: Promise.resolve("stop") });
    expect(await readAll(stream)).toBe("Hello, world");
  });

  it("labels a reply that hit the token cap", async () => {
    const stream = guardedStream("Half an", iteratorOf([" answer"]), { idleMs: 1000, finishReason: Promise.resolve("length") });
    expect(await readAll(stream)).toBe(`Half an answer${TRUNCATION_NOTICE}`);
  });

  it("does not call a reply cut off just because the provider reported no reason", async () => {
    for (const reason of ["unknown", "other"]) {
      const stream = guardedStream("Done.", iteratorOf([]), { idleMs: 1000, finishReason: Promise.resolve(reason) });
      expect(await readAll(stream)).toBe("Done.");
    }
  });

  it("keeps what was read and labels it when the model fails mid-stream", async () => {
    const failing = (async function* () {
      yield "part one, ";
      throw new Error("connection reset");
    })();
    const stream = guardedStream("Start: ", failing, { idleMs: 1000 });
    expect(await readAll(stream)).toBe(`Start: part one, ${TRUNCATION_NOTICE}`);
  });

  it("detects a stalled model by silence, aborts it and labels the reply", async () => {
    const stalling: AsyncIterator<string> = { next: () => new Promise<IteratorResult<string>>(() => {}) };
    const onStall = vi.fn();
    const stream = guardedStream("Beginning", stalling, { idleMs: 5000, onStall });

    const result = readAll(stream);
    await vi.advanceTimersByTimeAsync(5000);

    expect(await result).toBe(`Beginning${TRUNCATION_NOTICE}`);
    expect(onStall).toHaveBeenCalledOnce();
  });

  it("lets a slow but steady answer finish: silence is measured per chunk, not in total", async () => {
    const slow = (async function* () {
      for (const chunk of ["a", "b", "c"]) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        yield chunk;
      }
    })();
    const stream = guardedStream("0", slow, { idleMs: 5000, finishReason: Promise.resolve("stop") });

    const result = readAll(stream);
    await vi.advanceTimersByTimeAsync(12_000); // well past one idle window in total

    expect(await result).toBe("0abc");
  });

  it("treats a finish reason that never resolves as an error, not a hang", async () => {
    const stream = guardedStream("Hi", iteratorOf([]), { idleMs: 1000, finishReason: Promise.reject(new Error("aborted")) });
    expect(await readAll(stream)).toBe(`Hi${TRUNCATION_NOTICE}`);
  });

  it("releases its resources exactly once, whether it ends or is cancelled", async () => {
    const onEnd = vi.fn();
    await readAll(guardedStream("x", iteratorOf([]), { idleMs: 1000, finishReason: Promise.resolve("stop"), onEnd }));
    expect(onEnd).toHaveBeenCalledOnce();

    const cancelled = vi.fn();
    const iterator = iteratorOf(["a", "b"]);
    const returnSpy = vi.spyOn(iterator, "return");
    const stream = guardedStream("y", iterator, { idleMs: 1000, onEnd: cancelled });
    await stream.cancel();
    expect(cancelled).toHaveBeenCalledOnce();
    expect(returnSpy).toHaveBeenCalled();
  });
});
