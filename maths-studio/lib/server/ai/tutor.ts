import "server-only";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import curriculumContent from "@/content/curricula/waec-neco-algebra-linear-equations.json";
import {
  getDeterministicTutorResponse,
  PROMPT_VERSION,
  type TutorContext,
} from "@/lib/domain/tutor/fallback";

export type { TutorContext };

export async function generateTutorTurn(context: TutorContext): Promise<{
  response: string;
  strategy: string;
  promptVersion: string;
  source: "ai" | "fallback";
}> {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    const fallback = getDeterministicTutorResponse(context);
    return { ...fallback, promptVersion: PROMPT_VERSION, source: "fallback" };
  }

  try {
    const openai = createOpenAI({ apiKey: openaiKey });
    const concept = curriculumContent.concepts.find((c) => c.id === context.conceptId);
    const ageGuidance =
      context.educationLevel === "university"
        ? "Use academically rigorous language with proper notation."
        : context.ageBand === "12-13"
          ? "Use simple language, visual analogies, and short sentences."
          : "Use clear exam-focused language appropriate for WAEC/NECO preparation.";

    const systemPrompt = `You are a Socratic maths tutor for Mindspark. ${ageGuidance}
Ground all explanations in this approved curriculum content only:
Concept: ${concept?.label ?? "Linear equations"}
Objectives: ${concept?.objectives?.join("; ") ?? "Solve linear equations by balancing"}
Never invent curriculum claims. If uncertain, say so and refer to inverse operations.
Do not give the final answer immediately. Ask one guiding question or give one progressive hint.
Current equation step: ${context.equationStep}. Solved: ${context.solved}.`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt:
        context.userMessage ??
        (context.alternateExplanation
          ? "The student asked for another explanation. Use a different representation."
          : "Provide a Socratic hint for the current step."),
      maxTokens: 200,
    });

    return {
      response: text,
      strategy: context.alternateExplanation ? "alternate-representation" : "socratic",
      promptVersion: PROMPT_VERSION,
      source: "ai",
    };
  } catch {
    const fallback = getDeterministicTutorResponse(context);
    return { ...fallback, promptVersion: PROMPT_VERSION, source: "fallback" };
  }
}
