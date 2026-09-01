import { describe, expect, it } from "vitest";
import { scoreMood } from "./score-mood";

describe("scoreMood", () => {
  it("celebrates scores of 75% and above", () => {
    expect(scoreMood(75)).toBe("celebrate");
    expect(scoreMood(100)).toBe("celebrate");
  });

  it("encourages passing scores below 75%", () => {
    expect(scoreMood(50)).toBe("encourage");
    expect(scoreMood(74)).toBe("encourage");
  });

  it("is a let-down below 50%", () => {
    expect(scoreMood(49)).toBe("letdown");
    expect(scoreMood(0)).toBe("letdown");
  });
});
