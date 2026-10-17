import Link from "next/link";
import type { Route } from "next";
import { DIFFICULTY_LABELS, QUIZ_DIFFICULTIES, quizMinutes } from "@/features/quiz/difficulty";

export interface QuizMode {
  /** Route segment: /quiz/[subject]/[mode]. */
  mode: "subject" | "exam";
  label: string;
  questionCount: number;
}

interface QuizSubjectRowProps {
  slug: string;
  label: string;
  accent: string;
  questionCount: number;
  curricula: string[];
  modes: QuizMode[];
}

/**
 * One subject, each paper on its own line, each difficulty showing how long it runs.
 * Students pick by time available as much as by difficulty, so the minutes are the point.
 */
export function QuizSubjectRow({ slug, label, accent, questionCount, curricula, modes }: QuizSubjectRowProps) {
  return (
    <article className="quiz-row" style={{ ["--accent" as string]: accent }}>
      <header className="quiz-row-head">
        <h2>{label}</h2>
        <p>
          {questionCount.toLocaleString("en-NG")} questions
          {curricula.length > 0 && ` · ${curricula.join(" · ")}`}
        </p>
      </header>
      <div className="quiz-row-modes">
        {modes.map((mode) => (
          <div key={mode.mode} className="quiz-row-mode">
            <p>
              <strong>{mode.label}</strong>
              <span>{mode.questionCount} questions</span>
            </p>
            <ul aria-label={`${label} ${mode.label}: choose a difficulty`}>
              {QUIZ_DIFFICULTIES.map((difficulty) => (
                <li key={difficulty}>
                  <Link href={`/quiz/${slug}/${mode.mode}?difficulty=${difficulty}` as Route} className={`quiz-pace is-${difficulty}`}>
                    <span>{DIFFICULTY_LABELS[difficulty]}</span>
                    <small>{quizMinutes(mode.questionCount, difficulty)} min</small>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
