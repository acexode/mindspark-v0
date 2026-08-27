import { describe, expect, it } from "vitest";
import { getDeterministicTutorResponse, PROMPT_VERSION } from "./fallback";

const base = {
  ageBand: "14-16",
  educationLevel: "secondary",
  subjectName: "Biology",
  topicName: "Cell Biology",
  subtopicName: "Cell Structure",
  objectives: ["Identify the parts of an animal cell"],
  alternateExplanation: false,
};

describe("deterministic tutor fallback", () => {
  it("works for any subject, not just Mathematics", () => {
    const result = getDeterministicTutorResponse(base);
    expect(result.response).toContain("Identify the parts of an animal cell");
    expect(result.strategy).toBe("socratic");
  });

  it("switches strategy when the student asks for another explanation", () => {
    const result = getDeterministicTutorResponse({ ...base, alternateExplanation: true });
    expect(result.strategy).toBe("alternate-representation");
  });

  it("responds to a direct question without giving the answer away", () => {
    const result = getDeterministicTutorResponse({ ...base, userMessage: "What is a mitochondrion?" });
    expect(result.response).toContain("Cell Structure");
    expect(result.strategy).toBe("socratic");
  });

  it("falls back to the subject name when no topic is known", () => {
    const result = getDeterministicTutorResponse({
      ...base,
      topicName: undefined,
      subtopicName: undefined,
      objectives: [],
    });
    expect(result.response).toContain("Biology");
  });

  it("publishes a prompt version for traceability", () => {
    expect(PROMPT_VERSION).toMatch(/^tutor-v/);
  });
});
