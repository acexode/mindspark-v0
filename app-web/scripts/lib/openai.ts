import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * The OpenAI client shared by the content scripts. It exists because the generator's retry
 * handling was learned the hard way and a second script (explanation repair) needs the same
 * behaviour: dropped connections, 429s that say how long to wait, and a per-minute token
 * budget that counts `max_tokens` whether or not it is used.
 */

export function loadEnvLocal(): void {
  const file = path.join(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

export function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

export function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_ATTEMPTS = 8;

/**
 * OpenAI reserves `max_tokens` against the per-minute token budget whether or
 * not the completion uses it. Measured across 291 generated units, output is
 * ~3k tokens median and ~8.3k at p90 — so reserving 12k throttled a 30k TPM
 * account to roughly two requests a minute. An occasional truncation is cheaper
 * than that: it fails JSON parsing and the existing retry regenerates.
 */
export const DEFAULT_MAX_OUTPUT_TOKENS = Number(process.env.OPENAI_MAX_OUTPUT_TOKENS ?? "8000");

/** Honour the server's own backoff hint before falling back to exponential. */
function retryDelayMs(response: Response, body: string, attempt: number): number {
  const header = Number(response.headers.get("retry-after-ms"));
  if (Number.isFinite(header) && header > 0) return header + 250;
  const seconds = Number(response.headers.get("retry-after"));
  if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000 + 250;
  const stated = body.match(/try again in ([\d.]+)s/);
  if (stated) return Number(stated[1]) * 1000 + 250;
  return Math.min(4000 * 2 ** (attempt - 1), 60_000);
}

/**
 * GPT-5 and o-series models reason before answering: they reject `temperature` and
 * `max_tokens`, take `max_completion_tokens`, and count their hidden reasoning against
 * that budget, so it needs headroom beyond the visible JSON.
 */
export function isReasoningModel(model: string): boolean {
  return /^(gpt-5|o\d)/.test(model);
}

const REASONING_OUTPUT_TOKENS = Number(process.env.OPENAI_REASONING_OUTPUT_TOKENS ?? "32000");

/** Running token totals for this process, so a generation run can report what it actually used. */
export const usageTotals = { calls: 0, inputTokens: 0, outputTokens: 0, reasoningTokens: 0 };

export interface ChatOptions {
  /** Defaults to 0.4 on the first attempt and 0.2 on retries. */
  temperature?: number;
  maxTokens?: number;
}

export async function chatJson<T = unknown>(
  model: string,
  system: string,
  user: string,
  attempt = 1,
  options: ChatOptions = {},
): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set. Add it to app-web/.env.local");

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(240_000),
      body: JSON.stringify({
        model,
        ...(isReasoningModel(model)
          ? {
              max_completion_tokens: options.maxTokens ?? REASONING_OUTPUT_TOKENS,
              reasoning_effort: process.env.OPENAI_REASONING_EFFORT ?? "medium",
            }
          : {
              temperature: options.temperature ?? (attempt === 1 ? 0.4 : 0.2),
              max_tokens: options.maxTokens ?? DEFAULT_MAX_OUTPUT_TOKENS,
            }),
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
  } catch (error) {
    /**
     * A dropped connection or timeout rejects the fetch rather than returning a
     * status, so it bypassed the 429/5xx handling below entirely — which is why
     * a concurrency-10 run failed 406 of 437 units with a bare "fetch failed".
     */
    if (attempt < MAX_ATTEMPTS) {
      await sleep(Math.min(4000 * 2 ** (attempt - 1), 60_000));
      return chatJson<T>(model, system, user, attempt + 1, options);
    }
    const cause = (error as { cause?: { code?: string; message?: string } }).cause;
    throw new Error(
      `network error after ${MAX_ATTEMPTS} attempts: ${(error as Error).message}${cause?.code ? ` (${cause.code})` : ""}`,
    );
  }

  if (!response.ok) {
    const body = await response.text();
    if ((response.status === 429 || response.status >= 500) && attempt < MAX_ATTEMPTS) {
      await sleep(retryDelayMs(response, body, attempt));
      return chatJson<T>(model, system, user, attempt + 1, options);
    }
    throw new Error(`OpenAI ${response.status}: ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; completion_tokens_details?: { reasoning_tokens?: number } };
  };
  usageTotals.calls += 1;
  usageTotals.inputTokens += data.usage?.prompt_tokens ?? 0;
  usageTotals.outputTokens += data.usage?.completion_tokens ?? 0;
  usageTotals.reasoningTokens += data.usage?.completion_tokens_details?.reasoning_tokens ?? 0;
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned an empty completion");
  return JSON.parse(content) as T;
}

export async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function run(): Promise<void> {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
  return results;
}
