export type CurriculumTrack = "WAEC" | "NECO" | "WAEC_AND_NECO";
export type EducationLevel = "secondary" | "university";
export type MasteryState = "not_started" | "exploring" | "developing" | "proficient" | "mastered";
export type AgeBand = "12-13" | "14-16" | "17-20" | "21+";

export interface StudentProfile {
  id?: string;
  userId?: string;
  preferredName: string;
  ageBand: AgeBand;
  educationLevel: EducationLevel;
  classLevel: string;
  curriculum: CurriculumTrack;
  institution?: string;
  programme?: string;
  goal: "foundations" | "school" | "exam" | "research";
  onboarded: boolean;
  diagnosticScore: number;
  xp: number;
  streak: number;
  linearEquationsMastery: number;
  lessonComplete: boolean;
  practiceCorrect: number;
  accessibilityPreferences?: AccessibilityPreferences;
}

export interface AccessibilityPreferences {
  dyslexiaFriendlyFont: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  textScale: number;
}

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  preferredName: "",
  ageBand: "14-16",
  educationLevel: "secondary",
  classLevel: "SS2",
  curriculum: "WAEC_AND_NECO",
  goal: "school",
  onboarded: false,
  diagnosticScore: 0,
  xp: 0,
  streak: 1,
  linearEquationsMastery: 34,
  lessonComplete: false,
  practiceCorrect: 0,
};

export function masteryScoreToState(score: number): MasteryState {
  if (score <= 0) return "not_started";
  if (score < 25) return "exploring";
  if (score < 50) return "developing";
  if (score < 80) return "proficient";
  return "mastered";
}
