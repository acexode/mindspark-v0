import "server-only";
import { getLesson, getQuestionById, getSubtopic, getTopic } from "@/lib/content/loader";
import type { Question } from "@/lib/content/schema";
import { gradeAnswer, type SubmittedAnswer } from "@/lib/domain/assessment/grading";
import type { TutorContext, TutorQuestionContext } from "@/lib/domain/tutor/fallback";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import type { TutorRequest } from "./request";

/** Resolves a validated request into everything the model may see. Ids are looked up here, never trusted. */
export async function buildTutorContext(request: TutorRequest): Promise<TutorContext> {
  const profile = await readProfileOrDefault();
  const question = request.questionId ? getQuestionById(request.questionId) : null;
  const subtopicId = question?.subtopicId ?? request.subtopicId;
  const entry = subtopicId ? getSubtopic(subtopicId) : null;
  const topicEntry = !entry && request.topicId ? getTopic(request.topicId) : null;
  const lesson = subtopicId ? getLesson(subtopicId) : null;

  const groundingText = lesson?.blocks
    .map((block) =>
      block.type === "text"
        ? block.markdown
        : block.type === "callout"
          ? `${block.title}: ${block.text}`
          : block.type === "summary"
            ? block.points.join(" ")
            : "",
    )
    .filter(Boolean)
    .join("\n\n");

  return {
    ageBand: profile.ageBand,
    educationLevel: profile.educationLevel,
    subjectName: entry?.subject.name ?? topicEntry?.subject.name ?? request.subjectName ?? "your subject",
    topicName: entry?.topic.name ?? topicEntry?.topic.name,
    subtopicName: entry?.subtopic.name,
    objectives: entry?.subtopic.objectives.map((o) => o.text) ?? topicEntry?.topic.subtopics.map((s) => s.name) ?? [],
    groundingText,
    alternateExplanation: request.alternateExplanation ?? false,
    userMessage: request.userMessage || undefined,
    surface: request.surface,
    mode: request.mode,
    history: request.history,
    question: question ? questionContext(question, request.studentAnswer ?? {}) : undefined,
  };
}

function questionContext(question: Question, answer: SubmittedAnswer): TutorQuestionContext {
  const grade = gradeAnswer(question, answer);
  return {
    stem: question.stem,
    studentAnswerLabel: answerLabel(question, answer),
    wasCorrect: grade.requiresManualReview ? null : grade.correct,
    correctAnswerLabel: grade.correctAnswerLabel,
    explanation: grade.explanation,
    distractorNote: grade.distractorNote,
  };
}

function answerLabel(question: Question, answer: SubmittedAnswer): string {
  const optionIds = answer.optionIds ?? (answer.optionId ? [answer.optionId] : []);
  if (optionIds.length > 0) {
    return optionIds.map((id) => question.options?.find((o) => o.id === id)?.text ?? id).join(", ");
  }
  return answer.value !== undefined ? String(answer.value) : "";
}
