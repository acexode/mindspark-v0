import "server-only";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModelV1 } from "ai";

export type ProviderName = "ollama" | "ai";

export interface TutorProvider {
  name: ProviderName;
  model: LanguageModelV1;
  timeoutMs: number;
}

export const DEFAULT_OLLAMA_MODEL = "llama3.2:3b";

/**
 * Providers in the order they are tried. Ollama is always attempted first: when
 * nothing is listening it fails fast and the next provider (or the deterministic
 * fallback) takes over, so no flag is needed to run without it.
 */
export function tutorProviders(env: NodeJS.ProcessEnv = process.env): TutorProvider[] {
  const baseUrl = (env.OLLAMA_BASE_URL ?? "http://localhost:11434").replace(/\/+$/, "");
  const providers: TutorProvider[] = [
    {
      name: "ollama",
      // Ollama ignores the key; the SDK just requires one.
      model: createOpenAI({ baseURL: `${baseUrl}/v1`, apiKey: "ollama" })(env.OLLAMA_MODEL ?? DEFAULT_OLLAMA_MODEL),
      timeoutMs: Number(env.OLLAMA_TIMEOUT_MS) || 60_000,
    },
  ];

  if (env.OPENAI_API_KEY) {
    providers.push({
      name: "ai",
      model: createOpenAI({ apiKey: env.OPENAI_API_KEY })(env.OPENAI_TUTOR_MODEL ?? "gpt-4o-mini"),
      timeoutMs: 30_000,
    });
  }

  return providers;
}
