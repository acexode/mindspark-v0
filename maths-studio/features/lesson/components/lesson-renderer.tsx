"use client";

import type { LessonDefinition } from "../types";
import { EquationWorkspace } from "./equation-workspace";

interface LessonRendererProps {
  lesson: LessonDefinition;
}

export function LessonRenderer({ lesson }: LessonRendererProps) {
  const interactionStep = lesson.steps.find((s) => s.type === "attempt" || s.type === "interaction");
  if (interactionStep?.content.interaction === "equation-balance") {
    return <EquationWorkspace />;
  }
  return <EquationWorkspace />;
}
