import type { ProgressionMode } from "@/lib/domain/mastery/progression";
import type { EducationLevel, StudentProfile } from "./types";

/**
 * One place decides how an education level behaves and reads. Pages, the shell
 * and the progression seam all consult this rather than testing
 * `educationLevel` inline, so adding a level or running an experiment means
 * editing this file instead of hunting conditionals.
 */
export interface NavItem {
  href: string;
  label: string;
  /** Phosphor icon name, resolved by the sidebar. */
  icon: string;
}

export interface ExperienceCopy {
  /** What the home route is called. */
  home: string;
  /** What the library route is called. */
  catalogue: string;
  /** What a subject package is called in prose: "subject" / "course". */
  container: string;
  /** What a topic is called: "topic" / "module". */
  module: string;
  /** What a subtopic is called: "subtopic" / "unit". */
  unit: string;
}

export interface ExperienceConfig {
  level: EducationLevel;
  progressionMode: ProgressionMode;
  /** XP totals, streaks and score celebrations. Off for undergraduates. */
  gamification: boolean;
  /** Questions per practice session. */
  practiceSessionLength: number;
  nav: NavItem[];
  copy: ExperienceCopy;
}

const SECONDARY_NAV: NavItem[] = [
  { href: "/home", label: "Today", icon: "CalendarBlank" },
  { href: "/library", label: "Library", icon: "Books" },
  { href: "/practice", label: "Practice", icon: "PencilSimpleLine" },
  { href: "/quiz", label: "Quiz", icon: "Exam" },
  { href: "/tutor", label: "Tutor", icon: "ChatsCircle" },
  { href: "/progress", label: "Progress", icon: "ChartBar" },
  { href: "/profile", label: "Profile", icon: "User" },
];

const UNDERGRADUATE_NAV: NavItem[] = [
  { href: "/home", label: "Dashboard", icon: "Gauge" },
  { href: "/library", label: "Courses", icon: "GraduationCap" },
  { href: "/practice", label: "Practice", icon: "PencilSimpleLine" },
  { href: "/quiz", label: "Assessments", icon: "Exam" },
  { href: "/tutor", label: "Tutor", icon: "ChatsCircle" },
  { href: "/progress", label: "Progress", icon: "ChartBar" },
  { href: "/profile", label: "Profile", icon: "User" },
];

const SECONDARY: ExperienceConfig = {
  level: "secondary",
  progressionMode: "sequential",
  gamification: true,
  practiceSessionLength: 8,
  nav: SECONDARY_NAV,
  copy: { home: "Today", catalogue: "Library", container: "subject", module: "topic", unit: "subtopic" },
};

const UNDERGRADUATE: ExperienceConfig = {
  level: "undergraduate",
  progressionMode: "open",
  gamification: false,
  practiceSessionLength: 12,
  nav: UNDERGRADUATE_NAV,
  copy: { home: "Dashboard", catalogue: "Courses", container: "course", module: "module", unit: "unit" },
};

export function experienceFor(profile: Pick<StudentProfile, "educationLevel">): ExperienceConfig {
  return profile.educationLevel === "undergraduate" ? UNDERGRADUATE : SECONDARY;
}

export function experienceForLevel(level: EducationLevel): ExperienceConfig {
  return level === "undergraduate" ? UNDERGRADUATE : SECONDARY;
}
