"use server";

import { revalidatePath } from "next/cache";
import { getQuestionById } from "@/lib/content/loader";
import { gradeAnswer, type SubmittedAnswer } from "@/lib/domain/assessment/grading";
import { applyEvidence, getRecord } from "@/lib/domain/mastery/mastery";
import type { StudentProfile } from "@/lib/domain/student/types";
import { readProfileOrDefault, resetProfile, updateProfile, writeProfile } from "@/lib/server/profile/store";

export interface OnboardingInput {
  preferredName: string;
  ageBand: StudentProfile["ageBand"];
  educationLevel: StudentProfile["educationLevel"];
  classLevel: string;
  institution?: string;
  programme?: string;
  examTargets: StudentProfile["examTargets"];
  selectedSubjectIds: string[];
  goal: StudentProfile["goal"];
}

export async function saveOnboarding(input: OnboardingInput): Promise<{ ok: boolean }> {
  if (!input.preferredName.trim()) return { ok: false };
  if (input.selectedSubjectIds.length === 0) return { ok: false };

  await updateProfile((current) => ({
    ...current,
    ...input,
    preferredName: input.preferredName.trim(),
    onboarded: true,
    lastActiveDate: new Date().toISOString().slice(0, 10),
  }));

  revalidatePath("/home");
  revalidatePath("/library");
  revalidatePath("/practice");
  revalidatePath("/quiz");
  revalidatePath("/progress");
  return { ok: true };
}

export interface AnswerResult {
  correct: boolean;
  explanation: string;
  correctAnswerLabel: string;
  distractorNote?: string;
  masteryScore: number;
  masteryDelta: number;
  masteryState: string;
  xpAwarded: number;
  reason: string;
}

/**
 * The only place an answer is graded. The client never receives an answer key
 * before submitting, and never computes mastery or XP itself.
 */
export async function submitAnswer(
  questionId: string,
  answer: SubmittedAnswer,
  context: { hintsUsed?: number; attempts?: number } = {},
): Promise<AnswerResult | { error: string }> {
  const question = getQuestionById(questionId);
  if (!question) return { error: "Question not found" };

  const grade = gradeAnswer(question, answer);
  const profile = await readProfileOrDefault();
  const currentRecord = getRecord(profile.mastery, question.subtopicId);

  const update = applyEvidence(currentRecord, {
    subtopicId: question.subtopicId,
    correct: grade.correct,
    difficulty: question.difficulty,
    attempts: context.attempts ?? 1,
    hintsUsed: context.hintsUsed ?? 0,
  });

  await writeProfile({
    ...profile,
    xp: profile.xp + update.xpAwarded,
    mastery: { ...profile.mastery, [question.subtopicId]: update.record },
    lastActiveDate: new Date().toISOString().slice(0, 10),
  });

  return {
    correct: grade.correct,
    explanation: grade.explanation,
    correctAnswerLabel: grade.correctAnswerLabel,
    distractorNote: grade.distractorNote,
    masteryScore: update.record.score,
    masteryDelta: update.delta,
    masteryState: update.record.state,
    xpAwarded: update.xpAwarded,
    reason: update.reason,
  };
}

export async function recordLessonVisit(subjectId: string, subtopicId: string): Promise<void> {
  await updateProfile((current) => ({
    ...current,
    lastVisited: { ...current.lastVisited, [subjectId]: subtopicId },
    lastActiveDate: new Date().toISOString().slice(0, 10),
  }));
}

export async function addSubject(subjectId: string): Promise<void> {
  await updateProfile((current) =>
    current.selectedSubjectIds.includes(subjectId)
      ? current
      : { ...current, selectedSubjectIds: [...current.selectedSubjectIds, subjectId] },
  );
  revalidatePath("/library");
}

export async function getProfile(): Promise<StudentProfile> {
  return readProfileOrDefault();
}

export async function clearProfile(): Promise<void> {
  await resetProfile();
  revalidatePath("/", "layout");
}
