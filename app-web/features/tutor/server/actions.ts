"use server";

import { PROMPT_VERSION } from "@/lib/domain/tutor/fallback";
import { generateTutorTurn, type TutorReply } from "@/lib/server/ai/tutor";
import { buildTutorContext } from "./context";
import { tutorRequestSchema } from "./request";

const INVALID_REQUEST_REPLY: TutorReply = {
  response: "I couldn't read that question. Try rewording it, or ask something shorter.",
  strategy: "invalid-request",
  promptVersion: PROMPT_VERSION,
  source: "fallback",
};

/** Takes `unknown`: a server action is a public endpoint, so the input is validated here, not trusted from the types. */
export async function askTutor(input: unknown): Promise<TutorReply> {
  const parsed = tutorRequestSchema.safeParse(input);
  if (!parsed.success) return INVALID_REQUEST_REPLY;
  return generateTutorTurn(await buildTutorContext(parsed.data));
}
