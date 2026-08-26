"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createInitialDiagnosticState,
  DIAGNOSTIC_QUESTIONS,
  processDiagnosticAnswer,
  selectNextQuestion,
} from "@/lib/domain/diagnostic/branching";
import { completeDiagnostic } from "@/features/learning/server/actions";
import { useStudentProfile } from "@/features/student-profile/profile-provider";

export function BranchingDiagnostic() {
  const router = useRouter();
  const { updateProfile } = useStudentProfile();
  const [, startTransition] = useTransition();

  const activeQuestions = useMemo(() => {
    const questions = [];
    let tempState = createInitialDiagnosticState();
    while (!tempState.complete && questions.length < 8) {
      const q = selectNextQuestion(tempState);
      if (!q) break;
      questions.push({
        id: q.id,
        prompt: q.prompt,
        options: q.options,
        correctIndex: q.correctIndex,
      });
      tempState = processDiagnosticAnswer(tempState, q, q.correctIndex);
    }
    return questions.length > 0 ? questions : DIAGNOSTIC_QUESTIONS.slice(0, 6).map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
    }));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [diagState, setDiagState] = useState(createInitialDiagnosticState);

  const currentQuestion = DIAGNOSTIC_QUESTIONS.find((q) => q.id === activeQuestions[currentIndex]?.id);

  function handleAnswer(selectedIndex: number) {
    if (!currentQuestion) return;
    const nextState = processDiagnosticAnswer(diagState, currentQuestion, selectedIndex);
    setDiagState(nextState);

    if (nextState.complete || currentIndex >= activeQuestions.length - 1) {
      startTransition(async () => {
        const weakConcepts = Array.from(nextState.weakConcepts);
        const result = await completeDiagnostic(nextState.score, weakConcepts);
        updateProfile((current) => ({
          ...current,
          onboarded: true,
          diagnosticScore: nextState.score,
          linearEquationsMastery: result.mastery,
        }));
        router.push("/home");
      });
      return;
    }

    setCurrentIndex(currentIndex + 1);
  }

  if (!currentQuestion) return null;

  return (
    <section className="flow-page">
      <div className="flow-card">
        <span className="eyebrow">Quick diagnostic</span>
        <h1>Find your starting point</h1>
        <p className="question-count">
          Question {currentIndex + 1} — Difficulty {diagState.currentDifficulty}
        </p>
        <h2>{currentQuestion.prompt}</h2>
        <div className="answer-list">
          {currentQuestion.options.map((option, i) => (
            <button key={option} type="button" className="" onClick={() => handleAnswer(i)}>
              <span>{String.fromCharCode(65 + i)}</span>
              {option}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
