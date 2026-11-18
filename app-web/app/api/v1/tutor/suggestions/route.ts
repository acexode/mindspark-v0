import { NextResponse, type NextRequest } from "next/server";
import { buildTutorContext } from "@/features/tutor/server/context";
import { tutorRequestSchema } from "@/features/tutor/server/request";
import { suggestQuestions } from "@/lib/server/ai/suggestions";

/** Lesson-specific starter questions for the tutor chips. Always 200: an empty list means "use the generic chips". */
export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = tutorRequestSchema.safeParse({ ...(body as object), surface: "lesson" });
  if (!parsed.success) return NextResponse.json({ questions: [] });
  const context = await buildTutorContext(parsed.data);
  return NextResponse.json({ questions: await suggestQuestions(context) }, { headers: { "cache-control": "no-store" } });
}
