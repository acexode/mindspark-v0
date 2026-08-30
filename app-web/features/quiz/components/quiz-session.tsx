"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState, useTransition } from "react";
import type { PublicQuestion } from "@/lib/content/schema";
import { MathText } from "@/components/ui/math-text";
import { shuffle } from "@/lib/domain/assessment/shuffle";
import { submitQuiz, type QuizReviewItem } from "@/features/quiz/server/actions";

interface QuizSessionProps {
  title: string;
  subjectName: string;
  subjectSlug: string;
  questions: PublicQuestion[];
  durationSeconds: number;
}

type Answers = Record<string, { optionId?: string; value?: string }>;

export function QuizSession({ title, subjectName, subjectSlug, questions, durationSeconds }: QuizSessionProps) {
  const [paper] = useState(() =>
    shuffle(questions).map((question) => ({
      ...question,
      options: question.options?.length ? shuffle(question.options) : question.options,
    })),
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [remaining, setRemaining] = useState(durationSeconds);
  const [review, setReview] = useState<QuizReviewItem[] | null>(null);
  const [pending, startTransition] = useTransition();

  const question = paper[index];
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    if (review) return;
    const timer = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(timer);
  }, [review]);

  useEffect(() => {
    if (remaining === 0 && !review && !pending) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  function record(answer: { optionId?: string; value?: string }) {
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitQuiz(
        paper.map((q) => ({ questionId: q.id, answer: answers[q.id] ?? {} })),
      );
      setReview(result.items);
    });
  }

  if (review) return <QuizReview title={title} items={review} subjectSlug={subjectSlug} />;

  return (
    <section className="quiz-session">
      <header className="quiz-header">
        <div>
          <span className="eyebrow">{subjectName}</span>
          <h1>{title}</h1>
        </div>
        <div className="quiz-timer" role="timer" aria-live="off">
          {formatTime(remaining)}
        </div>
      </header>

      <p className="quiz-progress-text">
        Question {index + 1} of {paper.length} · {answeredCount} answered
      </p>

      <div className="quiz-question">
        <p className="question-stem">
          <MathText text={question.stem} />
        </p>

        {question.options?.length ? (
          <div className="option-list" role="radiogroup" aria-label="Answer options">
            {question.options.map((option, optionIndex) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={answers[question.id]?.optionId === option.id}
                className={`option ${answers[question.id]?.optionId === option.id ? "is-selected" : ""}`}
                onClick={() => record({ optionId: option.id })}
              >
                <span className="option-key">{String.fromCharCode(65 + optionIndex)}</span>
                <MathText text={option.text} />
              </button>
            ))}
          </div>
        ) : (
          <label className="numeric-answer">
            <span className="sr-only">Your answer</span>
            <input
              type="text"
              inputMode="decimal"
              value={answers[question.id]?.value ?? ""}
              onChange={(e) => record({ value: e.target.value })}
              placeholder="Type your answer"
            />
          </label>
        )}
      </div>

      <nav className="quiz-nav">
        <button type="button" className="secondary-action" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Previous
        </button>
        {index < paper.length - 1 ? (
          <button type="button" className="primary-action" onClick={() => setIndex(index + 1)}>
            Next
          </button>
        ) : (
          <button type="button" className="primary-action" onClick={handleSubmit} disabled={pending}>
            {pending ? "Submitting…" : "Submit quiz"}
          </button>
        )}
      </nav>

      <ol className="quiz-palette" aria-label="Question navigator">
        {paper.map((q, i) => (
          <li key={q.id}>
            <button
              type="button"
              className={`palette-dot ${answers[q.id] ? "is-answered" : ""} ${i === index ? "is-current" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Question ${i + 1}${answers[q.id] ? ", answered" : ""}`}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function QuizReview({ title, items, subjectSlug }: { title: string; items: QuizReviewItem[]; subjectSlug: string }) {
  const correct = items.filter((i) => i.correct).length;
  const percentage = Math.round((correct / items.length) * 100);

  return (
    <section className="quiz-review">
      <header>
        <span className="eyebrow">Results</span>
        <h1>{title}</h1>
        <p className="quiz-score">
          {correct}/{items.length} · {percentage}%
        </p>
      </header>

      <ol className="review-list">
        {items.map((item, i) => (
          <li key={item.questionId} className={item.correct ? "is-correct" : "is-incorrect"}>
            <p className="review-index">Question {i + 1}</p>
            <p className="question-stem">
              <MathText text={item.stem} />
            </p>
            <p className="review-verdict">
              {item.correct ? "Correct" : `Your answer: ${item.yourAnswerLabel || "not answered"} · Correct: ${item.correctAnswerLabel}`}
            </p>
            <p className="review-explanation">
              <MathText text={item.explanation} />
            </p>
          </li>
        ))}
      </ol>

      <div className="summary-actions">
        <Link className="primary-action" href={`/practice/${subjectSlug}` as Route}>
          Practise the weak areas
        </Link>
        <Link className="secondary-action" href="/progress">
          See progress
        </Link>
      </div>
    </section>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
