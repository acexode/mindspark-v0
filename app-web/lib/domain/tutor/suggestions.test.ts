import { describe, expect, it } from "vitest";
import { chipLabel, parseSuggestions, suggestionKey } from "./suggestions";

describe("parseSuggestions", () => {
  it("cleans bullets, numbering and quotes, and keeps only real questions", () => {
    const text = `1. Why does the periosteum matter in fracture healing?\n- "What is the first step in splinting a long-bone fracture?"\nHere you go:\nShort?\n3) How do I tell open from closed fractures?`;
    expect(parseSuggestions(text)).toEqual([
      "Why does the periosteum matter in fracture healing?",
      "What is the first step in splinting a long-bone fracture?",
      "How do I tell open from closed fractures?",
    ]);
  });
  it("drops duplicates and caps at three", () => {
    const q = (n: number) => `Question number ${n} about this lesson topic?`;
    expect(parseSuggestions([q(1), q(1), q(2), q(3), q(4)].join("\n"))).toHaveLength(3);
  });
  it("returns nothing for prose", () => {
    expect(parseSuggestions("Sure! Here are some ideas about fractures.")).toEqual([]);
  });
});

describe("chipLabel / suggestionKey", () => {
  it("trims long questions at a word", () => {
    const label = chipLabel("Why does the periosteum matter so much in the healing of a long-bone fracture?");
    expect(label.length).toBeLessThanOrEqual(46);
    expect(label.endsWith("…")).toBe(true);
  });
  it("keys per unit", () => {
    expect(suggestionKey({ subjectName: "A", topicName: "B", subtopicName: "C" })).toBe("A|B|C");
  });
});
