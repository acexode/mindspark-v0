import { NextResponse, type NextRequest } from "next/server";
import { askTutor } from "@/features/tutor/server/actions";
import { tutorRequestSchema } from "@/features/tutor/server/request";

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = tutorRequestSchema.safeParse(body);
  if (!parsed.success || (!parsed.data.subjectName && !parsed.data.subtopicId && !parsed.data.topicId && !parsed.data.questionId)) {
    return NextResponse.json({ error: "subjectName, subtopicId, topicId or questionId is required" }, { status: 400 });
  }
  return NextResponse.json(await askTutor(parsed.data));
}
