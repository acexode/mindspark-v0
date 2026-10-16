"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { EducationLevel } from "@/lib/domain/student/types";

const TutorLevelContext = createContext<EducationLevel>("secondary");

/** Lets deeply nested question cards pick the right tutor voice without prop-drilling the level. */
export function TutorLevelProvider({ level, children }: { level: EducationLevel; children: ReactNode }) {
  return <TutorLevelContext.Provider value={level}>{children}</TutorLevelContext.Provider>;
}

export function useTutorLevel(): EducationLevel {
  return useContext(TutorLevelContext);
}

export interface TutorChip {
  label: string;
  /** Sent as the student's message. */
  prompt: string;
  mode?: "explain" | "hint" | "check-my-thinking";
  /** The tutor replies with a question, so the next thing the student types is an answer to it. */
  quiz?: boolean;
}

export function chipsFor(level: EducationLevel, surface: "lesson" | "question"): TutorChip[] {
  const undergraduate = level === "undergraduate";
  if (surface === "question") {
    return undergraduate
      ? [
          { label: "Where did I go wrong?", prompt: "Where did my reasoning go wrong?", mode: "check-my-thinking" },
          { label: "Worked solution", prompt: "Show me a worked solution.", mode: "explain" },
        ]
      : [
          { label: "Why was I wrong? 🤔", prompt: "Why is my answer not right?", mode: "hint" },
          { label: "Break it down", prompt: "Break this question down step by step.", mode: "explain" },
          { label: "Another example", prompt: "Give me a similar example I can try.", mode: "explain" },
        ];
  }
  return undergraduate
    ? [
        { label: "Worked example", prompt: "Give me a worked example.", mode: "explain" },
        { label: "Common mistakes", prompt: "What are the common mistakes here?", mode: "explain" },
        { label: "Why does this hold?", prompt: "Why does this hold? Give the reasoning.", mode: "explain" },
      ]
    : [
        { label: "Explain it simply 💡", prompt: "Explain this simply, like I'm new to it.", mode: "explain" },
        { label: "Give me an example", prompt: "Give me an example.", mode: "explain" },
        { label: "Quiz me 🎯", prompt: "Ask me one question to check I understand.", mode: "hint", quiz: true },
        { label: "Exam tips", prompt: "How does this show up in WAEC/NECO/JAMB, and what should I watch out for?", mode: "explain" },
      ];
}
