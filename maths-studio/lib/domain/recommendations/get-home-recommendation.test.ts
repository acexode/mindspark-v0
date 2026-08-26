import { describe, expect, it } from "vitest";
import { getHomeRecommendation } from "./get-home-recommendation";

describe("getHomeRecommendation", () => {
  it("recommends lesson when not complete", () => {
    const rec = getHomeRecommendation({
      preferredName: "Ada",
      lessonComplete: false,
      linearEquationsMastery: 34,
      practiceCorrect: 0,
      diagnosticScore: 2,
      weakConcepts: [],
      retentionDue: [],
    });
    expect(rec.action).toBe("lesson");
    expect(rec.href).toBe("/learn/linear-equations");
  });

  it("recommends practice after lesson complete", () => {
    const rec = getHomeRecommendation({
      preferredName: "Ada",
      lessonComplete: true,
      linearEquationsMastery: 55,
      practiceCorrect: 1,
      diagnosticScore: 3,
      weakConcepts: [],
      retentionDue: [],
    });
    expect(rec.action).toBe("practice");
  });
});
