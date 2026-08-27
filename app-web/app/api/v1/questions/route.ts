import { NextResponse } from "next/server";
import { getQuestions, getQuestionsForSubject, getQuestionsForTopic } from "@/lib/content/loader";
import { toPublicQuestion } from "@/lib/content/schema";

/**
 * Scoped question retrieval. Always requires a scope — there is no
 * "give me some questions" default that silently picks a subject.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subtopicId = searchParams.get("subtopicId");
  const topicId = searchParams.get("topicId");
  const subjectId = searchParams.get("subjectId");
  const limit = Number(searchParams.get("limit") ?? 10);

  let questions = subtopicId
    ? getQuestions(subtopicId)
    : topicId
      ? getQuestionsForTopic(topicId)
      : subjectId
        ? getQuestionsForSubject(subjectId)
        : null;

  if (questions === null) {
    return NextResponse.json({ error: "A subtopicId, topicId or subjectId scope is required" }, { status: 400 });
  }

  questions = questions.slice(0, Math.min(Math.max(limit, 1), 60));

  return NextResponse.json({
    count: questions.length,
    questions: questions.map(toPublicQuestion),
  });
}
