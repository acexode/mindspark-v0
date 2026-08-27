import { NextResponse } from "next/server";
import { getLesson, getQuestionById, getSubtopic } from "@/lib/content/loader";
import { toPublicQuestion } from "@/lib/content/schema";

export async function GET(_request: Request, { params }: { params: Promise<{ subtopicId: string }> }) {
  const { subtopicId } = await params;
  const entry = getSubtopic(subtopicId);
  if (!entry) return NextResponse.json({ error: "Subtopic not found" }, { status: 404 });

  const lesson = getLesson(subtopicId);
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  // Inline check questions ship without their answer keys.
  const checkQuestions = lesson.blocks
    .filter((block): block is { type: "check"; questionId: string } => block.type === "check")
    .map((block) => getQuestionById(block.questionId))
    .filter((question) => question !== null)
    .map(toPublicQuestion);

  return NextResponse.json({
    lesson,
    checkQuestions,
    subtopic: { id: entry.subtopic.id, name: entry.subtopic.name },
    topic: { id: entry.topic.id, name: entry.topic.name },
    subject: { id: entry.subject.id, name: entry.subject.name, accentColor: entry.subject.accentColor },
  });
}
