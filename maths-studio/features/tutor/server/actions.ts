"use server";

import { generateTutorTurn, type TutorContext } from "@/lib/server/ai/tutor";

export async function requestTutorTurn(context: TutorContext) {
  return generateTutorTurn(context);
}
