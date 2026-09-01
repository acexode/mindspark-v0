export type ScoreMood = "celebrate" | "encourage" | "letdown";

export function scoreMood(percent: number): ScoreMood {
  if (percent >= 75) return "celebrate";
  if (percent >= 50) return "encourage";
  return "letdown";
}

export const SCORE_REACTION: Record<ScoreMood, string> = {
  celebrate: "Brilliant work!",
  encourage: "Nice effort — keep going.",
  letdown: "Don't worry — try this one again.",
};
