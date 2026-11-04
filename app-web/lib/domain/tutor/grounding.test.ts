import { describe, expect, it } from "vitest";
import type { ContentBlock } from "@/lib/content/schema";
import { blockToGroundingText, buildGroundingText, GROUNDING_CHAR_BUDGET } from "./grounding";

const text = (markdown: string): ContentBlock => ({ type: "text", markdown });

describe("blockToGroundingText", () => {
  it("includes a worked example's steps and answer, which hold the actual method", () => {
    const out = blockToGroundingText({
      type: "worked_example",
      title: "Offset a wall",
      prompt: "Make a 300 mm wall.",
      steps: [{ text: "Type OFFSET." }, { text: "Enter 300." }],
      answer: "A parallel line 300 mm away.",
    });
    expect(out).toContain("1. Type OFFSET.");
    expect(out).toContain("2. Enter 300.");
    expect(out).toContain("Answer: A parallel line 300 mm away.");
  });

  it("flattens a table into header and rows", () => {
    const out = blockToGroundingText({
      type: "table",
      headers: ["Bearing", "AutoCAD angle"],
      rows: [["90°", "0°"], ["180°", "270°"]],
    });
    expect(out).toBe("Bearing | AutoCAD angle\n90° | 0°\n180° | 270°");
  });

  it("keeps list items and wraps displayed maths for the model", () => {
    expect(blockToGroundingText({ type: "list", style: "bullet", items: ["first", "second"] })).toBe("- first\n- second");
    expect(blockToGroundingText({ type: "math", latex: "a^2 + b^2 = c^2" })).toBe("$a^2 + b^2 = c^2$");
  });

  it("drops blocks that add nothing for the tutor", () => {
    expect(blockToGroundingText({ type: "hook", text: "Imagine a very long bridge span." })).toBe("");
    expect(blockToGroundingText({ type: "check", questionId: "q001" })).toBe("");
  });
});

describe("buildGroundingText", () => {
  it("joins blocks in lesson order", () => {
    expect(buildGroundingText([text("one"), text("two")])).toBe("one\n\ntwo");
  });

  it("ignores blocks with no usable text", () => {
    expect(buildGroundingText([{ type: "hook", text: "A hook that is long enough" }, text("body")])).toBe("body");
  });

  it("cuts at a block boundary instead of mid-sentence", () => {
    const out = buildGroundingText([text("a".repeat(30)), text("b".repeat(30)), text("c".repeat(30))], 70);
    expect(out).toBe(`${"a".repeat(30)}\n\n${"b".repeat(30)}`);
  });

  it("stops at the first block that does not fit rather than skipping to a smaller later one", () => {
    const out = buildGroundingText([text("a".repeat(30)), text("b".repeat(100)), text("tiny")], 70);
    expect(out).toBe("a".repeat(30));
  });

  it("never returns nothing: an oversized first block is truncated", () => {
    expect(buildGroundingText([text("x".repeat(200))], 50)).toBe("x".repeat(50));
  });

  it("returns an empty string for a lesson with no usable text", () => {
    expect(buildGroundingText([])).toBe("");
  });

  it("defaults to the shared budget", () => {
    const out = buildGroundingText(Array.from({ length: 100 }, () => text("w".repeat(200))));
    expect(out.length).toBeLessThanOrEqual(GROUNDING_CHAR_BUDGET);
  });
});
