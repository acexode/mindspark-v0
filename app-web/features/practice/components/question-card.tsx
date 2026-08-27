"use client";

import { useState, useTransition } from "react";
import type { PublicQuestion } from "@/lib/content/schema";
import { MathText } from "@/components/ui/math-text";
import { submitAnswer, type AnswerResult } from "@/features/learning/server/actions";

interface QuestionCardProps {
  question: PublicQuestion;
  onAnswered?: (result: AnswerResult) => void;
  compact?: boolean;
  /** Quiz mode withholds feedback until the whole paper is submitted. */
  deferFeedback?: boolean;
  onSelectionChange?: (answer: { optionId?: string; value?: string }) => void;
}

export function QuestionCard({
  question,
  onAnswered,
  compact = false,
  deferFeedback = false,
  onSelectionChange,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [pending, startTransition] = useTransition();

  const hasOptions = Boolean(question.options?.length);
  const answered = result !== null;

  function select(optionId: string) {
    if (answered) return;
    setSelected(optionId);
    onSelectionChange?.({ optionId });
  }

  function changeValue(next: string) {
    if (answered) return;
    setValue(next);
    onSelectionChange?.({ value: next });
  }

  function check() {
    if (deferFeedback) return;
    const answer = hasOptions ? { optionId: selected ?? undefined } : { value };
    if (!answer.optionId && !answer.value) return;

    startTransition(async () => {
      const response = await submitAnswer(question.id, answer);
      if ("error" in response) return;
      setResult(response);
      onAnswered?.(response);
    });
  }

  return (
    <div className={`question-card ${compact ? "is-compact" : ""} ${answered ? (result.correct ? "is-correct" : "is-incorrect") : ""}`}>
      <p className="question-stem">
        <MathText text={question.stem} />
      </p>

      {question.media && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="question-media" src={question.media.src} alt={question.media.alt} loading="lazy" />
      )}

      {hasOptions ? (
        <ul className="option-list" role="radiogroup" aria-label="Answer options">
          {question.options?.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="radio"
                aria-checked={selected === option.id}
                disabled={answered || pending}
                className={`option ${selected === option.id ? "is-selected" : ""}`}
                onClick={() => select(option.id)}
              >
                <span className="option-key">{option.id.toUpperCase()}</span>
                <MathText text={option.text} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <label className="numeric-answer">
          <span className="sr-only">Your answer</span>
          <input
            type="text"
            inputMode="decimal"
            value={value}
            disabled={answered || pending}
            onChange={(e) => changeValue(e.target.value)}
            placeholder="Type your answer"
          />
        </label>
      )}

      {!deferFeedback && !answered && (
        <button
          type="button"
          className="primary-action"
          onClick={check}
          disabled={pending || (hasOptions ? !selected : value.trim().length === 0)}
        >
          {pending ? "Checking…" : "Check answer"}
        </button>
      )}

      {answered && (
        <div className="feedback" role="status">
          <p className="feedback-verdict">
            {result.correct ? "Correct" : `Not quite — the answer is ${result.correctAnswerLabel}`}
          </p>
          {result.distractorNote && <p className="feedback-distractor">{result.distractorNote}</p>}
          <p className="feedback-explanation">
            <MathText text={result.explanation} />
          </p>
          <p className="feedback-mastery">
            Mastery {result.masteryDelta >= 0 ? "+" : ""}
            {result.masteryDelta} → {result.masteryScore}%
            {result.xpAwarded > 0 && ` · +${result.xpAwarded} XP`}
          </p>
        </div>
      )}
    </div>
  );
}
