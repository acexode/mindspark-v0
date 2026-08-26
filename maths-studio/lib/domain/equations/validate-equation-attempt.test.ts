import { describe, expect, it } from "vitest";
import { validateBalanceAttempt, getNextStep } from "./validate-equation-attempt";

describe("validateBalanceAttempt", () => {
  it("accepts subtract-five on step 0", () => {
    const result = validateBalanceAttempt("subtract-five", 0);
    expect(result.correct).toBe(true);
  });

  it("rejects add-five on step 0", () => {
    const result = validateBalanceAttempt("add-five", 0);
    expect(result.correct).toBe(false);
    expect(result.misconception).toBe("inverse-operation");
  });

  it("accepts divide-three on step 2", () => {
    const result = validateBalanceAttempt("divide-three", 2);
    expect(result.correct).toBe(true);
  });
});

describe("getNextStep", () => {
  it("advances from step 0 to 2 on correct subtract", () => {
    expect(getNextStep(0, "subtract-five")).toBe(2);
  });

  it("returns null on incorrect operation", () => {
    expect(getNextStep(0, "add-five")).toBeNull();
  });
});
