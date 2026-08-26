import { describe, expect, it } from "vitest";
import { calculateMasteryAfterAttempt, calculateXpAward } from "./calculate-mastery";

describe("calculateMasteryAfterAttempt", () => {
  it("increases mastery on correct independent attempt", () => {
    const result = calculateMasteryAfterAttempt(34, {
      correct: true,
      attempts: 1,
      hintsUsed: 0,
      difficulty: 2,
      conceptId: "linear-equations",
    });
    expect(result.score).toBeGreaterThan(34);
    expect(result.state).toBe("proficient");
  });

  it("decreases mastery on incorrect attempt", () => {
    const result = calculateMasteryAfterAttempt(34, {
      correct: false,
      attempts: 1,
      hintsUsed: 0,
      difficulty: 2,
      conceptId: "linear-equations",
    });
    expect(result.score).toBe(32);
  });
});

describe("calculateXpAward", () => {
  it("awards zero XP for incorrect answers", () => {
    expect(calculateXpAward(2, 0, false)).toBe(0);
  });

  it("reduces XP when hints used", () => {
    expect(calculateXpAward(2, 2, true)).toBeLessThan(calculateXpAward(2, 0, true));
  });
});
