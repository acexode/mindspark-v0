import { describe, expect, it } from "vitest";
import { explanationProblem, isPlaceholderExplanation } from "./explanations";

describe("isPlaceholderExplanation", () => {
  it.each(["The correct answer is DIMSTYLE.", "The correct answer is False.", "  The correct answer is 5 mm.  "])(
    "flags %s",
    (text) => expect(isPlaceholderExplanation(text)).toBe(true),
  );

  it("does not flag a real explanation that happens to open the same way", () => {
    const real =
      "The correct answer is a closed polyline because OFFSET treats a polyline as one object, so all four sides move together.";
    expect(isPlaceholderExplanation(real)).toBe(false);
  });

  it("does not flag ordinary explanations", () => {
    expect(isPlaceholderExplanation("Plotting at 1:50 shrinks everything by 50, so 3 mm plots at 0.06 mm.")).toBe(false);
  });
});

describe("explanationProblem", () => {
  const good = "At 1:100, 1 mm on paper stands for 100 mm on the ground, so 50 mm on the sheet is 5,000 mm, which is 5 m.";

  it("accepts a real explanation", () => expect(explanationProblem(good)).toBeNull());

  it("rejects filler, short text and non-strings", () => {
    expect(explanationProblem("The correct answer is True.")).toMatch(/too short/);
    expect(explanationProblem(42)).toMatch(/not a string/);
    expect(explanationProblem("x".repeat(1000))).toMatch(/too long/);
  });

  it("rejects text that restates the answer even when long enough", () => {
    expect(explanationProblem(`The correct answer is 5 m. ${good}`)).toMatch(/instead of explaining/);
  });

  it("rejects leaked values, unpaired dollars and option letters", () => {
    expect(explanationProblem(`${good} The value was undefined here.`)).toMatch(/leaked/);
    expect(explanationProblem(`${good} It cost $5 to print.`)).toMatch(/unpaired/);
    expect(explanationProblem(`Option B is wrong because the scale factor is inverted, so the plotted size comes out too large.`)).toMatch(
      /by letter/,
    );
  });

  it("allows the statistics term 'null hypothesis'", () => {
    expect(explanationProblem("The null hypothesis states that there is no effect, so a small p-value is evidence against it being true.")).toBeNull();
  });

  it("allows paired dollars for maths", () => {
    expect(explanationProblem(`Since $a^2 + b^2 = c^2$ holds for a right triangle, the hypotenuse of a 3-4 triangle is 5 units long.`)).toBeNull();
  });
});
