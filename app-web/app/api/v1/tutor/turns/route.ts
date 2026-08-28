import { NextResponse, type NextRequest } from "next/server";
import { askTutor } from "@/features/tutor/server/actions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body?.subjectName && !body?.subtopicId) {
    return NextResponse.json({ error: "subjectName or subtopicId is required" }, { status: 400 });
  }
  return NextResponse.json(await askTutor(body));
}
