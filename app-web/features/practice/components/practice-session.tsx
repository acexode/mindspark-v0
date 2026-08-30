"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import type { PublicQuestion } from "@/lib/content/schema";
import type { AnswerResult } from "@/features/learning/server/actions";
import { advanceSelection, initialSelectionState, selectNextQuestion } from "@/lib/domain/assessment/grading";
import { shuffle } from "@/lib/domain/assessment/shuffle";
import { QuestionCard } from "./question-card";

interface PracticeSessionProps {
  title: string;
  scopeLabel: string;
  questions: PublicQuestion[];
  backHref: string;
  subjectSlug: string;
  sessionLength?: number;
}

export function PracticeSession({
  title,
  scopeLabel,
  questions,
  backHref,
  subjectSlug,
  sessionLength = 8,
}: PracticeSessionProps) {
  const total = Math.min(sessionLength, questions.length);
  const [pool] = useState(() => shuffle(questions));
  const [state, setState] = useState(() => initialSelectionState(1));
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [answeredCurrent, setAnsweredCurrent] = useState(false);

  const current = useMemo(
    () => selectNextQuestion(pool as never, state) as PublicQuestion | null,
    [pool, state],
  );

  const finished = results.length >= total || current === null;
  const correctCount = results.filter((r) => r.correct).length;

  function handleAnswered(result: AnswerResult) {
    setResults((prev) => [...prev, result]);
    setAnsweredCurrent(true);
  }

  function next() {
    if (!current) return;
    setState((prev) => advanceSelection(prev, current.id, results[results.length - 1]?.correct ?? false));
    setAnsweredCurrent(false);
  }

  if (finished) {
    const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
    const masteryGain = results.reduce((sum, r) => sum + r.masteryDelta, 0);
    const xp = results.reduce((sum, r) => sum + r.xpAwarded, 0);

    return (
      <section className="practice-summary">
        <span className="eyebrow">Session complete</span>
        <h1>{title}</h1>
        <dl className="summary-stats">
          <div>
            <dt>Score</dt>
            <dd>
              {correctCount}/{results.length}
            </dd>
          </div>
          <div>
            <dt>Accuracy</dt>
            <dd>{accuracy}%</dd>
          </div>
          <div>
            <dt>Mastery</dt>
            <dd>
              {masteryGain >= 0 ? "+" : ""}
              {masteryGain}
            </dd>
          </div>
          <div>
            <dt>XP</dt>
            <dd>+{xp}</dd>
          </div>
        </dl>
        <div className="summary-actions">
          <Link className="primary-action" href={backHref as Route}>
            Back to {scopeLabel}
          </Link>
          <Link className="secondary-action" href={`/quiz/${subjectSlug}/subject` as Route}>
            Try a timed quiz
          </Link>
          <Link className="secondary-action" href="/progress">
            See progress
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="practice-session">
      <header className="practice-header">
        <div>
          <span className="eyebrow">{scopeLabel}</span>
          <h1>{title}</h1>
        </div>
        <p className="practice-counter">
          Question {results.length + 1} of {total} · Difficulty {state.difficulty}
        </p>
      </header>

      <QuestionCard key={current.id} question={current} onAnswered={handleAnswered} />

      {answeredCurrent && (
        <button type="button" className="primary-action" onClick={next}>
          {results.length + 1 >= total ? "Finish session" : "Next question"}
        </button>
      )}
    </section>
  );
}
