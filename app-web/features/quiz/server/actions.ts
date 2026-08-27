"use server";

import { getQuestionById } from "@/lib/content/loader";
import { gradeAnswer, type SubmittedAnswer } from "@/lib/domain/assessment/grading";
import { applyEvidence, getRecord } from "@/lib/domain/mastery/mastery";
import { readProfileOrDefault, writeProfile } from "@/lib/server/profile/store";

export interface QuizReviewItem {
  questionId: string;
  stem: string;
  correct: boolean;
  yourAnswerLabel: string;
  correctAnswerLabel: string;
  explanation: string;
}

export interface QuizSubmission {
  questionId: string;
  answer: SubmittedAnswer;
}

/**
 * Grades a whole paper at once. Mastery is applied per question so a quiz
 * contributes the same kind of evidence as practice, at a lower weight since
 * no hints were available.
 */
export async function submitQuiz(submissions: QuizSubmission[]): Promise<{ items: QuizReviewItem[] }> {
  const profile = await readProfileOrDefault();
  const mastery = { ...profile.mastery };
  const items: QuizReviewItem[] = [];
  let xpEarned = 0;

  for (const submission of submissions) {
    const question = getQuestionById(submission.questionId);
    if (!question) continue;

    const answered = Boolean(submission.answer.optionId || submission.answer.value);
    const grade = gradeAnswer(question, submission.answer);
    const correct = answered && grade.correct;

    const update = applyEvidence(getRecord(mastery, question.subtopicId), {
      subtopicId: question.subtopicId,
      correct,
      difficulty: question.difficulty,
      attempts: 1,
      hintsUsed: 0,
    });

    mastery[question.subtopicId] = update.record;
    xpEarned += update.xpAwarded;

    items.push({
      questionId: question.id,
      stem: question.stem,
      correct,
      yourAnswerLabel: labelFor(question, submission.answer),
      correctAnswerLabel: grade.correctAnswerLabel,
      explanation: grade.explanation,
    });
  }

  await writeProfile({
    ...profile,
    xp: profile.xp + xpEarned,
    mastery,
    lastActiveDate: new Date().toISOString().slice(0, 10),
  });

  return { items };
}

function labelFor(
  question: NonNullable<ReturnType<typeof getQuestionById>>,
  answer: SubmittedAnswer,
): string {
  if (answer.optionId) {
    return question.options?.find((o) => o.id === answer.optionId)?.text ?? answer.optionId;
  }
  return answer.value !== undefined ? String(answer.value) : "";
}
