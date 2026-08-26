"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { ProgressBar } from "@/components/ui/progress-bar";

export interface QuizItem {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

interface QuizFlowProps {
  title: string;
  eyebrow: string;
  items: QuizItem[];
  onComplete: (score: number) => void;
}

export function QuizFlow({ title, eyebrow, items, onComplete }: QuizFlowProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = items[index];

  function next() {
    const nextScore = score + (selected === question.correctIndex ? 1 : 0);
    if (index === items.length - 1) {
      onComplete(nextScore);
      return;
    }
    setScore(nextScore);
    setSelected(null);
    setIndex(index + 1);
  }

  return (
    <section className="flow-page">
      <div className="flow-card">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <ProgressBar value={index + 1} max={items.length} label="Quiz progress" />
        <p className="question-count">
          Question {index + 1} of {items.length}
        </p>
        <h2>{question.prompt}</h2>
        <div className="answer-list" role="radiogroup" aria-label={question.prompt}>
          {question.options.map((option, optionIndex) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected === optionIndex}
              className={selected === optionIndex ? "selected" : ""}
              onClick={() => setSelected(optionIndex)}
            >
              <span>{String.fromCharCode(65 + optionIndex)}</span>
              {option}
            </button>
          ))}
        </div>
        <button className="primary-action" type="button" disabled={selected === null} onClick={next}>
          {index === items.length - 1 ? "Finish" : "Next question"}
          <ArrowRight aria-hidden />
        </button>
      </div>
    </section>
  );
}
