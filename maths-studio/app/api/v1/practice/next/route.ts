import { NextRequest, NextResponse } from "next/server";
import { getQuestionById, createPracticeSession, selectNextPracticeQuestion } from "@/lib/domain/assessment/practice-bank";

export async function GET(request: NextRequest) {
  const mode = (request.nextUrl.searchParams.get("mode") ?? "normal") as "normal" | "repair" | "retention";
  const session = createPracticeSession(mode);
  const question = selectNextPracticeQuestion(session);
  if (!question) return NextResponse.json({ question: null });

  return NextResponse.json({
    sessionId: crypto.randomUUID(),
    question: {
      id: question.id,
      prompt: question.prompt,
      options: question.options,
      difficulty: question.difficulty,
    },
  });
}

export async function POST(request: NextRequest) {
  const { questionId, selectedIndex } = await request.json();
  const question = getQuestionById(questionId);
  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

  const correct = selectedIndex === question.correctIndex;
  return NextResponse.json({
    correct,
    explanation: correct
      ? "Well done — your reasoning is correct."
      : "Review inverse operations. Apply the same operation to both sides.",
    misconception: correct ? null : question.misconception,
  });
}
