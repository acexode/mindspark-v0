import { describe, expect, it } from "vitest";
import type { TutorContext } from "./fallback";
import { buildMessages, buildSystemPrompt, defaultModeFor, HISTORY_CHAR_BUDGET } from "./prompt";

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

  it("keeps the most recent turns that fit the history budget and drops the oldest", () => {
    const turn = (n: number) => ({ role: n % 2 === 0 ? ("student" as const) : ("tutor" as const), text: `${n}`.padEnd(1000, "x") });
    const history = [0, 1, 2, 3, 4, 5].map(turn);
    const messages = buildMessages({ ...base, userMessage: "next", history });

    const historyChars = messages.slice(0, -1).reduce((sum, m) => sum + m.content.length, 0);
    expect(historyChars).toBeLessThanOrEqual(HISTORY_CHAR_BUDGET);
    expect(messages.at(-1)?.content).toBe("next");
    expect(messages.some((m) => m.content.startsWith("0x"))).toBe(false); // oldest gone
    expect(messages.some((m) => m.content.startsWith("5x") || m.content.startsWith("4x"))).toBe(true); // newest kept
  });

  it("never opens the conversation with a tutor reply whose question was dropped", () => {
    const history = [
      { role: "student" as const, text: "a".repeat(1100) },
      { role: "tutor" as const, text: "b".repeat(1100) },
      { role: "student" as const, text: "c".repeat(1100) },
      { role: "tutor" as const, text: "d".repeat(1100) },
    ];
    // Budget fits the last three turns (3300) but not all four, so the first kept turn would be a tutor reply.
    const roles = buildMessages({ ...base, userMessage: "q", history }).map((m) => m.role);
    expect(roles[0]).toBe("user");
  });

  it("truncates an oversized single turn instead of letting it use the whole budget", () => {
    const messages = buildMessages({ ...base, userMessage: "q", history: [{ role: "student", text: "z".repeat(5000) }] });
    expect(messages[0]?.content.length).toBeLessThanOrEqual(1200);
  });

  it("falls back to a default prompt when the student sent no text", () => {
    expect(buildMessages({ ...base, alternateExplanation: true }).at(-1)?.content).toContain("different representation");
  });
});
