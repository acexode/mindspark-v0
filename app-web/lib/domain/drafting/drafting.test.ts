import { describe, expect, it } from "vitest";
import { extractScript, repairPrompt, buildDraftingSystemPrompt } from "./prompt";
import { roomPlanScript, traverseScript } from "./templates";
import { draftingRequestSchema } from "./request";

describe("extractScript", () => {
  it("takes the first fenced python block", () => {
    expect(extractScript("Here you go:\n```python\nd.line((0,0),(1,1))\n```\nEnjoy")).toBe("d.line((0,0),(1,1))");
  });
  it("handles an unclosed fence from a cut-off reply", () => {
    expect(extractScript("```python\nd.line((0,0),(1,1))\nd.circle((0,0),5)")).toContain("d.circle");
  });
  it("accepts a bare script", () => {
    expect(extractScript("d.line((0,0),(1,1))")).toBe("d.line((0,0),(1,1))");
  });
});

describe("repairPrompt", () => {
  it("names the line and error", () => {
    const text = repairPrompt("d.nope()", { stage: "run", error: "no attribute nope", line: 1 });
    expect(text).toMatch(/on line 1: no attribute nope/);
    expect(text).toContain("d.nope()");
  });
});

describe("system prompt", () => {
  it("states units and scale", () => {
    expect(buildDraftingSystemPrompt({ units: "mm", scale: 100 })).toMatch(/millimetres[\s\S]*1:100/);
  });
});

describe("templates", () => {
  it("builds a room script from numbers only", () => {
    const script = roomPlanScript({ width: 4000, height: 3000, wall: 230, doors: [{ side: "south", at: 600, width: 900 }], windows: [], label: 'BED"); import os #' });
    expect(script).toContain('d.room((0, 0), 4000, 3000, wall=230');
    const labelLine = script.split("\n").find((line) => line.includes("BED")) ?? "";
    expect(labelLine.match(/"/g)).toHaveLength(4); // the label's own two quotes plus align="..."; it cannot add one
    expect(script).not.toContain("#");
  });
  it("rejects non-finite values and unknown sides", () => {
    expect(() => roomPlanScript({ width: NaN, height: 1, wall: 1, doors: [], windows: [] })).toThrow();
    expect(() => roomPlanScript({ width: 4000, height: 3000, wall: 230, doors: [{ side: "up" as never, at: 1, width: 1 }], windows: [] })).toThrow();
  });
  it("builds a traverse script", () => {
    const script = traverseScript({ startX: 0, startY: 0, legs: [{ bearing: 0, distance: 10 }, { bearing: 90, distance: 10 }], closed: false });
    expect(script).toContain("d.traverse((0, 0), [(0, 10), (90, 10)], closed=False)");
  });
});

describe("draftingRequestSchema", () => {
  it("defaults units and scale", () => {
    const parsed = draftingRequestSchema.parse({ kind: "describe", prompt: "a 3 x 3 m room" });
    expect(parsed).toMatchObject({ units: "mm", scale: 50 });
  });
  it("rejects short prompts, bad bearings and unknown kinds", () => {
    expect(draftingRequestSchema.safeParse({ kind: "describe", prompt: "a" }).success).toBe(false);
    expect(draftingRequestSchema.safeParse({ kind: "traverse", legs: [{ bearing: 400, distance: 1 }, { bearing: 0, distance: 1 }] }).success).toBe(false);
    expect(draftingRequestSchema.safeParse({ kind: "other" }).success).toBe(false);
  });
});
