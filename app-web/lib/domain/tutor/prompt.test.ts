import { describe, expect, it } from "vitest";
import type { TutorContext } from "./fallback";
import { buildMessages, buildSystemPrompt, defaultModeFor } from "./prompt";

const base: TutorContext = {
  ageBand: "14-16",
  educationLevel: "secondary",
  subjectName: "Mathematics",
  topicName: "Algebra",
  subtopicName: "Linear equations",
  objectives: ["Solve one-step equations"],
  groundingText: "Subtract the same number from both sides.",
  alternateExplanation: false,
};

const question = {
  stem: "Solve x + 3 = 7",
  studentAnswerLabel: "10",
  wasCorrect: false,
  correctAnswerLabel: "4",
  explanation: "Subtract 3 from both sides to get x = 4.",
  distractorNote: "Adding instead of subtracting.",
};

describe("tutor prompt", () => {
  it("grounds the prompt in the subtopic and lesson text", () => {
    const prompt = buildSystemPrompt(base);
    expect(prompt).toContain("Linear equations");
    expect(prompt).toContain("Subtract the same number from both sides.");
  });

  it("gives the model the key on question surfaces but forbids reciting it in a hint", () => {
    const prompt = buildSystemPrompt({ ...base, surface: "practice", question });
    expect(prompt).toContain("Solve x + 3 = 7");
    expect(prompt).toContain("Correct answer: 4");
    expect(prompt).toContain("Do NOT state the final answer");
  });

  it("lets the model state the answer when the student asked for a full explanation", () => {
    const prompt = buildSystemPrompt({ ...base, surface: "practice", mode: "explain", question });
    expect(prompt).toContain("Correct answer: 4");
    expect(prompt).not.toContain("Do NOT state the final answer");
  });

  it("does not add a question block on non-question surfaces", () => {
    expect(buildSystemPrompt({ ...base, surface: "lesson" })).not.toContain("Correct answer");
  });

  it("defaults to a hint on question surfaces and to an answer elsewhere", () => {
    expect(defaultModeFor("practice")).toBe("hint");
    expect(defaultModeFor("quiz-review")).toBe("hint");
    expect(defaultModeFor("lesson")).toBe("explain");
    expect(defaultModeFor(undefined)).toBe("explain");
  });

  it("maps history to chat roles and ends with the new message", () => {
    const messages = buildMessages({
      ...base,
      userMessage: "why?",
      history: [
        { role: "student", text: "hi" },
        { role: "tutor", text: "hello" },
      ],
    });
    expect(messages.map((m) => m.role)).toEqual(["user", "assistant", "user"]);
    expect(messages.at(-1)?.content).toBe("why?");
  });

  it("falls back to a default prompt when the student sent no text", () => {
    expect(buildMessages({ ...base, alternateExplanation: true }).at(-1)?.content).toContain("different representation");
  });
});
