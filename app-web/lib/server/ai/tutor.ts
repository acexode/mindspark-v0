import "server-only";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getDeterministicTutorResponse, PROMPT_VERSION, type TutorContext } from "@/lib/domain/tutor/fallback";

export type { TutorContext };

export interface TutorReply {
  response: string;
  strategy: string;
  promptVersion: string;
  source: "ai" | "fallback";
}

export async function generateTutorTurn(context: TutorContext): Promise<TutorReply> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return { ...getDeterministicTutorResponse(context), promptVersion: PROMPT_VERSION, source: "fallback" };
  }

  try {
    const openai = createOpenAI({ apiKey });
    const { text } = await generateText({
      model: openai(process.env.OPENAI_TUTOR_MODEL ?? "gpt-4o-mini"),
      system: buildSystemPrompt(context),
      prompt:
        context.userMessage ??
        (context.alternateExplanation
          ? "The student did not understand. Explain using a genuinely different representation, not a paraphrase."
          : "Give one Socratic question or one progressive hint for what the student is studying."),
      maxTokens: 320,
    });

    return {
      response: text.trim(),
      strategy: context.alternateExplanation ? "alternate-representation" : "socratic",
      promptVersion: PROMPT_VERSION,
      source: "ai",
    };
  } catch {
    return { ...getDeterministicTutorResponse(context), promptVersion: PROMPT_VERSION, source: "fallback" };
  }
}

function buildSystemPrompt(context: TutorContext): string {
  const register =
    context.educationLevel === "undergraduate"
      ? "Use precise academic language and correct notation."
      : context.ageBand === "12-13"
        ? "Use short sentences, concrete examples and everyday analogies."
        : "Use clear language suited to a senior secondary student preparing for WAEC, NECO or JAMB.";

  return [
    `You are a Socratic tutor for Mindspark, helping with ${context.subjectName}.`,
    context.subtopicName ? `The student is studying: ${context.subtopicName}.` : "",
    context.objectives.length ? `Learning objectives:\n- ${context.objectives.join("\n- ")}` : "",
    context.groundingText ? `Approved lesson content you must stay consistent with:\n"""\n${context.groundingText.slice(0, 4000)}\n"""` : "",
    register,
    "Rules: never invent curriculum facts; if you are unsure, say so plainly. Do not reveal a final answer immediately — ask one guiding question or give one progressive hint. Keep replies under 120 words.",
  ]
    .filter(Boolean)
    .join("\n\n");
}
