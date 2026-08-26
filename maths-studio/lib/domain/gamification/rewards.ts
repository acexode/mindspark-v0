export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "repair";
  target: number;
  progress: number;
  xpReward: number;
  href: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

export interface LeagueTier {
  id: string;
  name: string;
  minXp: number;
  color: string;
}

export const LEAGUE_TIERS: LeagueTier[] = [
  { id: "bronze", name: "Bronze", minXp: 0, color: "#b87333" },
  { id: "silver", name: "Silver", minXp: 100, color: "#9ca3af" },
  { id: "gold", name: "Gold", minXp: 250, color: "#d4a017" },
  { id: "platinum", name: "Platinum", minXp: 500, color: "#67e8f9" },
  { id: "diamond", name: "Diamond", minXp: 800, color: "#818cf8" },
  { id: "master", name: "Master", minXp: 1200, color: "#a855f7" },
];

export function getLeagueTier(xp: number): LeagueTier {
  return [...LEAGUE_TIERS].reverse().find((t) => xp >= t.minXp) ?? LEAGUE_TIERS[0];
}

export function generateDailyQuests(profile: {
  lessonComplete: boolean;
  practiceCorrect: number;
  linearEquationsMastery: number;
}): Quest[] {
  const quests: Quest[] = [
    {
      id: "daily-lesson",
      title: "Complete today's Mathematics mission",
      description: "Finish one focused learning activity.",
      type: "daily",
      target: 1,
      progress: profile.lessonComplete ? 1 : 0,
      xpReward: 30,
      href: "/learn/linear-equations",
    },
    {
      id: "daily-practice",
      title: "Practise independently",
      description: "Answer practice questions without hints.",
      type: "daily",
      target: 3,
      progress: Math.min(3, profile.practiceCorrect),
      xpReward: 25,
      href: "/practice/linear-equations",
    },
  ];

  if (profile.linearEquationsMastery < 50) {
    quests.push({
      id: "daily-mastery",
      title: "Master an Algebra concept",
      description: "Reach Developing on linear equations.",
      type: "daily",
      target: 50,
      progress: profile.linearEquationsMastery,
      xpReward: 50,
      href: "/learn/linear-equations",
    });
  }

  return quests;
}

export function checkAchievements(profile: {
  lessonComplete: boolean;
  practiceCorrect: number;
  linearEquationsMastery: number;
  streak: number;
}): Achievement[] {
  return [
    {
      id: "first-lesson",
      title: "First steps",
      description: "Complete your first lesson step.",
      earned: profile.lessonComplete,
    },
    {
      id: "clean-solve",
      title: "Clean solve",
      description: "Solve without using hints.",
      earned: profile.lessonComplete && profile.linearEquationsMastery >= 58,
    },
    {
      id: "practice-pro",
      title: "Practice pro",
      description: "Get 3/3 on practice.",
      earned: profile.practiceCorrect >= 3,
    },
    {
      id: "streak-3",
      title: "Consistent learner",
      description: "Maintain a 3-day streak.",
      earned: profile.streak >= 3,
    },
    {
      id: "concept-master",
      title: "Concept master",
      description: "Reach Mastered on linear equations.",
      earned: profile.linearEquationsMastery >= 80,
    },
  ];
}

export function calculateStreak(lastActiveDate: string | null, currentStreak: number): number {
  if (!lastActiveDate) return 1;
  const last = new Date(lastActiveDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}
