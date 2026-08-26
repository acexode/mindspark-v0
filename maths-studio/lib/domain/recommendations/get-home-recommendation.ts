export interface RecommendationInput {
  preferredName: string;
  lessonComplete: boolean;
  linearEquationsMastery: number;
  practiceCorrect: number;
  diagnosticScore: number;
  weakConcepts: string[];
  retentionDue: string[];
}

export interface Recommendation {
  action: "lesson" | "practice" | "review" | "retention" | "prerequisite";
  title: string;
  description: string;
  href: string;
  reason: string;
  estimatedMinutes: number;
}

export function getHomeRecommendation(input: RecommendationInput): Recommendation {
  if (input.retentionDue.length > 0) {
    return {
      action: "retention",
      title: "Retention check: Linear Equations",
      description: "Quick review to keep what you've mastered.",
      href: "/practice/linear-equations?mode=retention",
      reason: "Spaced repetition scheduled for a concept you previously mastered.",
      estimatedMinutes: 8,
    };
  }

  if (input.weakConcepts.includes("algebra-basics")) {
    return {
      action: "prerequisite",
      title: "Repair: Algebra basics",
      description: "Strengthen foundations before advancing.",
      href: "/practice/linear-equations?mode=repair",
      reason: "Diagnostic identified a prerequisite gap in algebra basics.",
      estimatedMinutes: 15,
    };
  }

  if (!input.lessonComplete) {
    return {
      action: "lesson",
      title: "Solving Linear Equations",
      description: "Learn why every operation must keep both sides balanced.",
      href: "/learn/linear-equations",
      reason: input.diagnosticScore >= 2 ? "You're ready for the main lesson." : "Start with guided balancing steps.",
      estimatedMinutes: 12,
    };
  }

  if (input.linearEquationsMastery < 70 || input.practiceCorrect < 2) {
    return {
      action: "practice",
      title: "Independent practice",
      description: "Apply what you learned with adaptive questions.",
      href: "/practice/linear-equations",
      reason: "Lesson complete — practice will strengthen independent transfer.",
      estimatedMinutes: 10,
    };
  }

  return {
    action: "review",
    title: "Explore the knowledge map",
    description: "See what you've unlocked and what's next.",
    href: "/knowledge-map",
    reason: "Strong progress on linear equations — explore your learning path.",
    estimatedMinutes: 5,
  };
}
