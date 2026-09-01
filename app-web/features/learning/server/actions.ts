"use server";

import { revalidatePath } from "next/cache";
import { getQuestionById, getSubject } from "@/lib/content/loader";
import { filterSubjectForClass } from "@/lib/content/class-visibility";
import { gradeAnswer, type SubmittedAnswer } from "@/lib/domain/assessment/grading";
import { applyEvidence, getRecord } from "@/lib/domain/mastery/mastery";
import { TOPIC_PRACTICE_UNLOCK_PERCENT } from "@/lib/domain/mastery/progression";
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

function subjectsVisibleForClass(subjectIds: string[], classLevel: string): string[] {
  return subjectIds.filter((id) => {
    const subject = getSubject(id);
    return subject !== null && filterSubjectForClass(subject, classLevel).topics.length > 0;
  });
}

function normalizeProfileInput(input: OnboardingInput) {
  const preferredName = input.preferredName.trim();
  const isUndergraduate = input.educationLevel === "undergraduate";
  const selectedSubjectIds = subjectsVisibleForClass(input.selectedSubjectIds, input.classLevel);

  return {
    preferredName,
    ageBand: input.ageBand,
    educationLevel: input.educationLevel,
    classLevel: input.classLevel,
    institution: isUndergraduate ? input.institution?.trim() || undefined : undefined,
    programme: isUndergraduate ? input.programme?.trim() || undefined : undefined,
    examTargets: isUndergraduate
      ? (["none"] as StudentProfile["examTargets"])
      : input.examTargets.length > 0
        ? input.examTargets
        : (["none"] as StudentProfile["examTargets"]),
    selectedSubjectIds,
    goal: input.goal,
  };
}

function revalidateStudentPaths() {
  revalidatePath("/home");
  revalidatePath("/library");
  revalidatePath("/practice");
  revalidatePath("/quiz");
  revalidatePath("/progress");
  revalidatePath("/profile");
}

export async function saveOnboarding(input: OnboardingInput): Promise<{ ok: boolean }> {
  if (!input.preferredName.trim()) return { ok: false };

  const next = normalizeProfileInput(input);
  if (next.selectedSubjectIds.length === 0) return { ok: false };

  await updateProfile((current) => ({
    ...current,
    ...next,
    onboarded: true,
    lastActiveDate: new Date().toISOString().slice(0, 10),
  }));

  revalidateStudentPaths();
  return { ok: true };
}

export async function updateStudentProfile(input: OnboardingInput): Promise<{ ok: boolean }> {
  if (!input.preferredName.trim()) return { ok: false };

  const next = normalizeProfileInput(input);
  if (next.selectedSubjectIds.length === 0) return { ok: false };

  await updateProfile((current) => ({
    ...current,
    ...next,
    lastActiveDate: new Date().toISOString().slice(0, 10),
  }));

  revalidateStudentPaths();
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

export interface TopicPracticeRecordResult {
  best: number;
  passed: boolean;
  justUnlocked: boolean;
}

/** Records a finished topic-practice session. Best score wins; 50% unlocks the next topic. */
export async function recordTopicPracticeScore(
  topicId: string,
  accuracyPercent: number,
): Promise<TopicPracticeRecordResult> {
  const clamped = Math.max(0, Math.min(100, Math.round(accuracyPercent)));
  let previous = 0;

  await updateProfile((current) => {
    previous = current.topicPracticeBest[topicId] ?? 0;
    if (clamped <= previous) return current;
    return {
      ...current,
      topicPracticeBest: { ...current.topicPracticeBest, [topicId]: clamped },
    };
  });

  const best = Math.max(previous, clamped);
    const passed = best >= TOPIC_PRACTICE_UNLOCK_PERCENT;
    revalidateStudentPaths();
    return { best, passed, justUnlocked: previous < TOPIC_PRACTICE_UNLOCK_PERCENT && passed };
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
