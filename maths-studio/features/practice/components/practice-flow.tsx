"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { PRACTICE_BANK } from "@/lib/domain/assessment/practice-bank";
import { completePractice } from "@/features/learning/server/actions";
import { useStudentProfile } from "@/features/student-profile/profile-provider";
import { QuizFlow } from "@/features/diagnostic/components/quiz-flow";

export function PracticeFlow() {
  const router = useRouter();
  const { updateProfile, refreshProfile } = useStudentProfile();
  const [, startTransition] = useTransition();

  const items = PRACTICE_BANK.slice(0, 3).map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: q.options,
    correctIndex: q.correctIndex,
  }));

  function handleComplete(score: number) {
    startTransition(async () => {
      const result = await completePractice(score, items.length);
      updateProfile((current) => ({
        ...current,
        practiceCorrect: score,
        linearEquationsMastery: Math.max(current.linearEquationsMastery, result.mastery),
        xp: current.xp + result.xp,
      }));
      await refreshProfile();
      router.push("/progress");
    });
  }

  return (
    <QuizFlow
      title="Independent practice"
      eyebrow="Level 2 · Linear equations"
      items={items}
      onComplete={handleComplete}
    />
  );
}
