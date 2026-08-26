"use server";

import { calculateMasteryAfterAttempt, calculateXpAward } from "@/lib/domain/mastery/calculate-mastery";
import { validateBalanceAttempt, getNextStep } from "@/lib/domain/equations/validate-equation-attempt";
import type { EquationOperation } from "@/lib/domain/equations/types";
import { createServerProfileRepository } from "@/lib/server/repositories/profile-service";

export interface AssessStepInput {
  operation: EquationOperation;
  currentStep: number;
  hintsUsed?: number;
}

export interface AssessStepResult {
  correct: boolean;
  feedback: string;
  misconception?: string;
  mastery: number;
  xpAwarded: number;
  nextStep: number | null;
  lessonComplete: boolean;
}

export async function assessBalanceStep(input: AssessStepInput): Promise<AssessStepResult> {
  const validation = validateBalanceAttempt(input.operation, input.currentStep);
  const repo = createServerProfileRepository();
  const profile = (await repo.get()) ?? { linearEquationsMastery: 34, lessonComplete: false, xp: 0 };

  const masteryResult = calculateMasteryAfterAttempt(profile.linearEquationsMastery, {
    correct: validation.correct,
    attempts: 1,
    hintsUsed: input.hintsUsed ?? 0,
    difficulty: 2,
    conceptId: "linear-equations",
  });

  const xpAwarded = calculateXpAward(2, input.hintsUsed ?? 0, validation.correct);
  const nextStep = getNextStep(input.currentStep, input.operation);
  const lessonComplete = nextStep === 4 || (input.currentStep === 4 && validation.correct);

  if (validation.correct || !validation.correct) {
    await repo.update((current) => ({
      ...current,
      linearEquationsMastery: masteryResult.score,
      lessonComplete: current.lessonComplete || lessonComplete,
      xp: current.xp + xpAwarded,
    }));
  }

  return {
    correct: validation.correct,
    feedback: validation.feedback,
    misconception: validation.misconception,
    mastery: masteryResult.score,
    xpAwarded,
    nextStep,
    lessonComplete,
  };
}

export async function completeDiagnostic(score: number, weakConcepts: string[]): Promise<{ mastery: number }> {
  const { diagnosticMasteryFromScore } = await import("@/lib/domain/diagnostic/branching");
  const mastery = diagnosticMasteryFromScore(score, weakConcepts);
  const repo = createServerProfileRepository();
  await repo.update((current) => ({
    ...current,
    onboarded: true,
    diagnosticScore: score,
    linearEquationsMastery: mastery,
  }));
  return { mastery };
}

export async function completePractice(correctCount: number, total: number): Promise<{ mastery: number; xp: number }> {
  const repo = createServerProfileRepository();
  const profile = (await repo.get()) ?? { linearEquationsMastery: 34, xp: 0, practiceCorrect: 0 };

  const masteryResult = calculateMasteryAfterAttempt(profile.linearEquationsMastery, {
    correct: correctCount >= 2,
    attempts: total - correctCount + 1,
    hintsUsed: 0,
    difficulty: 2,
    conceptId: "linear-equations",
  });

  const xp = correctCount * 15;

  await repo.update((current) => ({
    ...current,
    practiceCorrect: correctCount,
    linearEquationsMastery: Math.max(current.linearEquationsMastery, masteryResult.score),
    xp: current.xp + xp,
  }));

  return { mastery: masteryResult.score, xp };
}

export async function saveOnboarding(data: {
  preferredName: string;
  ageBand: string;
  educationLevel: string;
  classLevel: string;
  curriculum: string;
  institution?: string;
  programme?: string;
  goal: string;
}): Promise<void> {
  const repo = createServerProfileRepository();
  await repo.update((current) => ({
    ...current,
    preferredName: data.preferredName,
    ageBand: data.ageBand as "12-13" | "14-16" | "17-20" | "21+",
    educationLevel: data.educationLevel as "secondary" | "university",
    classLevel: data.classLevel,
    curriculum: data.curriculum as "WAEC" | "NECO" | "WAEC_AND_NECO",
    institution: data.institution,
    programme: data.programme,
    goal: data.goal as "foundations" | "school" | "exam" | "research",
  }));
}

export async function getServerProfile() {
  const repo = createServerProfileRepository();
  return repo.get();
}

export async function resetProfile(): Promise<void> {
  const repo = createServerProfileRepository();
  await repo.reset();
}
