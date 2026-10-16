"use client";

import { useState } from "react";
import { AskTutorPanel } from "./ask-tutor-panel";
import { useTutorLevel } from "./tutor-tone";

interface QuestionHelpProps {
  questionId: string;
  subtopicId?: string;
  subjectName?: string;
  surface: "practice" | "quiz-review";
  /** What the student submitted; graded again on the server, never trusted for correctness. */
  answer: { optionId?: string; optionIds?: string[]; value?: string };
}

/** Only rendered once the answer is in, so the tutor can never be used to peek at a live question. */
export function QuestionHelp({ questionId, subtopicId, subjectName, surface, answer }: QuestionHelpProps) {
  const casual = useTutorLevel() !== "undergraduate";
  const [open, setOpen] = useState(false);

  return (
    <div className="question-help">
      <button type="button" className="secondary-action" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? "Hide tutor" : casual ? "Still confused? Ask why 💬" : "Ask the tutor about this"}
      </button>
      {open && <AskTutorPanel scope={{ subjectName, subtopicId, surface, question: { id: questionId, answer } }} />}
    </div>
  );
}
