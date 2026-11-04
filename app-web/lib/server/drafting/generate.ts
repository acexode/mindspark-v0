import "server-only";
import { generateText, type CoreMessage } from "ai";
import { buildDraftingSystemPrompt, extractScript, repairPrompt, type ScriptFailure } from "@/lib/domain/drafting/prompt";
import { roomPlanScript, traverseScript } from "@/lib/domain/drafting/templates";
import type { DraftingRequest } from "@/lib/domain/drafting/request";
import { tutorProviders } from "@/lib/server/ai/providers";
import { runDraftingScript, type DraftingResult, type DraftingSuccess } from "./python";

const MAX_ATTEMPTS = 3;
const MAX_TOKENS = 900;

export type DraftingOutcome =
  | { ok: true; script: string; result: DraftingSuccess; source: string; attempts: number }
  | { ok: false; error: string; script?: string; stage: string; line?: number | null };

function settingsOf(request: DraftingRequest) {
  return { units: request.kind === "traverse" ? ("m" as const) : request.units, scale: request.scale };
}

function asOutcome(script: string, result: DraftingResult, source: string, attempts: number): DraftingOutcome {
  if (result.ok) return { ok: true, script, result, source, attempts };
  return { ok: false, error: result.error, script, stage: result.stage, line: result.line };
}

/** Asks each provider in turn, feeding script errors back so the model can correct itself. */
async function describeDrawing(request: Extract<DraftingRequest, { kind: "describe" }>): Promise<DraftingOutcome> {
  const providers = tutorProviders();
  const system = buildDraftingSystemPrompt(request);
  let lastError = "no model is available; start Ollama or set OPENAI_API_KEY";

  for (const provider of providers) {
    const messages: CoreMessage[] = [{ role: "user", content: request.prompt }];
    let script = "";

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      let text: string;
      try {
        ({ text } = await generateText({
          model: provider.model,
          system,
          messages,
          maxTokens: MAX_TOKENS,
          temperature: 0.2,
          maxRetries: 0,
          abortSignal: AbortSignal.timeout(Math.max(provider.timeoutMs, 90_000)),
        }));
      } catch (error) {
        lastError = `the ${provider.name === "ollama" ? "local" : "online"} model did not answer: ${error instanceof Error ? error.message : "unknown error"}`;
        break; // unreachable or timed out: try the next provider
      }

      script = extractScript(text);
      const result = await runDraftingScript(script, request);
      if (result.ok) return { ok: true, script, result, source: provider.name, attempts: attempt };

      if (result.stage === "setup") return asOutcome(script, result, provider.name, attempt);
      lastError = result.error;
      const failure: ScriptFailure = { stage: result.stage, error: result.error, line: result.line };
      messages.push({ role: "assistant", content: text }, { role: "user", content: repairPrompt(script, failure) });
    }

    if (script) return { ok: false, error: lastError, script, stage: "run" };
  }
  return { ok: false, error: lastError, stage: "model" };
}

export async function generateDrawing(request: DraftingRequest): Promise<DraftingOutcome> {
  switch (request.kind) {
    case "describe":
      return describeDrawing(request);
    case "room": {
      const script = roomPlanScript(request);
      return asOutcome(script, await runDraftingScript(script, settingsOf(request)), "template", 1);
    }
    case "traverse": {
      const script = traverseScript(request);
      return asOutcome(script, await runDraftingScript(script, settingsOf(request)), "template", 1);
    }
    case "script":
      return asOutcome(request.script, await runDraftingScript(request.script, settingsOf(request)), "script", 1);
  }
}
