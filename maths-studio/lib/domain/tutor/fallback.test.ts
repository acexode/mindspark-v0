import { describe, expect, it } from "vitest";
import { getDeterministicTutorResponse, PROMPT_VERSION } from "./fallback";

describe("tutor fallback", () => {
  it("returns socratic fallback by default", () => {
    const result = getDeterministicTutorResponse({
      ageBand: "14-16",
      educationLevel: "secondary",
      conceptId: "linear-equations",
      equationStep: 0,
      solved: false,
      recentAttempts: 0,
      alternateExplanation: false,
    });
    expect(result.response.length).toBeGreaterThan(10);
    expect(result.strategy).toBe("socratic");
    expect(PROMPT_VERSION).toBeTruthy();
  });

  it("uses alternate strategy when requested", () => {
    const result = getDeterministicTutorResponse({
      ageBand: "12-13",
      educationLevel: "secondary",
      conceptId: "linear-equations",
      equationStep: 0,
      solved: false,
      recentAttempts: 0,
      alternateExplanation: true,
    });
    expect(result.strategy).toBe("alternate-representation");
  });
});
