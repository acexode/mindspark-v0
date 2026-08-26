export type LessonStepType =
  | "hook"
  | "concept"
  | "visual"
  | "interaction"
  | "worked_example"
  | "attempt"
  | "feedback"
  | "challenge"
  | "recap";

export interface LessonStep {
  id: string;
  type: LessonStepType;
  content: Record<string, unknown>;
}

export interface LessonDefinition {
  id: string;
  conceptId: string;
  title: string;
  steps: LessonStep[];
}

export interface InteractiveComponentProps {
  step: LessonStep;
  onComplete?: (result: { correct: boolean }) => void;
}

export type InteractiveComponentRegistry = Record<string, React.ComponentType<InteractiveComponentProps>>;
