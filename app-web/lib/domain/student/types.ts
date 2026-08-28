import type { MasteryMap } from "@/lib/domain/mastery/mastery";

export type EducationLevel = "secondary" | "undergraduate";
export type ExamTarget = "WAEC" | "NECO" | "JAMB" | "none";
export type AgeBand = "12-13" | "14-16" | "17-20" | "21+";
export type LearningGoal = "foundations" | "school" | "exam" | "research";

export interface AccessibilityPreferences {
  dyslexiaFriendlyFont: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  textScale: number;
}

export interface StudentProfile {
  preferredName: string;
  ageBand: AgeBand;
  educationLevel: EducationLevel;
  /** JSS1–SS3 for secondary, Year1–Year4 for undergraduate. */
  classLevel: string;
  institution?: string;
  programme?: string;
  examTargets: ExamTarget[];
  /** Subject IDs the student chose at onboarding, e.g. "sec.mathematics". */
  selectedSubjectIds: string[];
  goal: LearningGoal;
  onboarded: boolean;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  /** Mastery keyed by subtopic ID. Topic and subject mastery are derived. */
  mastery: MasteryMap;
  /** Last visited subtopic per subject, for "Continue where you left off". */
  lastVisited: Record<string, string>;
  accessibilityPreferences: AccessibilityPreferences;
}

export const DEFAULT_ACCESSIBILITY: AccessibilityPreferences = {
  dyslexiaFriendlyFont: false,
  reducedMotion: false,
  highContrast: false,
  textScale: 1,
};

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  preferredName: "",
  ageBand: "14-16",
  educationLevel: "secondary",
  classLevel: "SS2",
  examTargets: [],
  selectedSubjectIds: [],
  goal: "school",
  onboarded: false,
  xp: 0,
  streak: 1,
  lastActiveDate: null,
  mastery: {},
  lastVisited: {},
  accessibilityPreferences: DEFAULT_ACCESSIBILITY,
};

export const SECONDARY_CLASS_LEVELS = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"] as const;
export const UNDERGRADUATE_CLASS_LEVELS = ["Year1", "Year2", "Year3", "Year4"] as const;
