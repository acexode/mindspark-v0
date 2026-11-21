import "server-only";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModelV1 } from "ai";
import { STUDENT_CLOUD_BASE_URL, STUDENT_CLOUD_MODEL } from "@/lib/domain/tutor/cloud-key";

/** "ollama" is the local model, "cloud" is any OpenAI-compatible hosted API, "ai" is OpenAI itself. */
export type ProviderName = "ollama" | "cloud" | "ai";

export interface TutorProvider {
  name: ProviderName;
  model: LanguageModelV1;
  timeoutMs: number;
}

export const DEFAULT_OLLAMA_MODEL = "llama3.2:3b";
const DEFAULT_ORDER: ProviderName[] = ["ollama", "cloud", "ai"];
const ORDER_NAMES: Record<string, ProviderName> = { ollama: "ollama", local: "ollama", cloud: "cloud", online: "cloud", openai: "ai", ai: "ai" };

/** `TUTOR_PROVIDER_ORDER=cloud,ollama` puts the hosted model first. Unknown names are ignored; unlisted providers are not used. */
export function providerOrder(env: Record<string, string | undefined> = process.env, hasStudentKey = false): ProviderName[] {
  const raw = env.TUTOR_PROVIDER_ORDER?.trim();
  // A student who saved their own key asked for the online model: it goes first unless the operator set an order.
  if (!raw) return hasStudentKey ? ["cloud", "ollama", "ai"] : DEFAULT_ORDER;
  const order = raw
    .split(",")
    .map((part) => ORDER_NAMES[part.trim().toLowerCase()])
    .filter((name): name is ProviderName => Boolean(name));
  return order.length > 0 ? [...new Set(order)] : DEFAULT_ORDER;
}

/**
 * Providers in the order they are tried; a provider that fails or is not configured falls through to
 * the next, and finally to the built-in guidance. Ollama is always attempted when listed: with nothing
 * listening it fails fast, so no flag is needed to run without it.
 *
 * The "cloud" provider is any OpenAI-compatible hosted API (Groq, Google AI Studio, OpenRouter, Cerebras, ...),
 * enabled by setting CLOUD_AI_BASE_URL, CLOUD_AI_API_KEY and CLOUD_AI_MODEL together.
 */
export function tutorProviders(env: Record<string, string | undefined> = process.env, studentCloudKey?: string): TutorProvider[] {
  const baseUrl = (env.OLLAMA_BASE_URL ?? "http://localhost:11434").replace(/\/+$/, "");
  const available: Partial<Record<ProviderName, TutorProvider>> = {
    ollama: {
      name: "ollama",
      // Ollama ignores the key; the SDK just requires one.
      model: createOpenAI({ baseURL: `${baseUrl}/v1`, apiKey: "ollama" })(env.OLLAMA_MODEL ?? DEFAULT_OLLAMA_MODEL),
      timeoutMs: Number(env.OLLAMA_TIMEOUT_MS) || 60_000,
    },
  };

  // The student's own key (saved on their profile) wins over the machine-wide one, so each student's usage is theirs.
  const cloudKey = studentCloudKey ?? env.CLOUD_AI_API_KEY;
  const cloudBase = studentCloudKey ? (env.CLOUD_AI_BASE_URL ?? STUDENT_CLOUD_BASE_URL) : env.CLOUD_AI_BASE_URL;
  const cloudModel = studentCloudKey ? (env.CLOUD_AI_MODEL ?? STUDENT_CLOUD_MODEL) : env.CLOUD_AI_MODEL;
  if (cloudKey && cloudBase && cloudModel) {
    available.cloud = {
      name: "cloud",
      model: createOpenAI({ baseURL: cloudBase.replace(/\/+$/, ""), apiKey: cloudKey })(cloudModel),
      timeoutMs: Number(env.CLOUD_AI_TIMEOUT_MS) || 25_000,
    };
  }

  if (env.OPENAI_API_KEY) {
    available.ai = {
      name: "ai",
      model: createOpenAI({ apiKey: env.OPENAI_API_KEY })(env.OPENAI_TUTOR_MODEL ?? "gpt-4o-mini"),
      timeoutMs: 30_000,
    };
  }

  return providerOrder(env, Boolean(studentCloudKey))
    .map((name) => available[name])
    .filter((provider): provider is TutorProvider => Boolean(provider));
}
