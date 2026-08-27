import { describe, expect, it } from "vitest";
import { buildContentIndex } from "@/lib/content/loader";
import {
  advanceSelection,
  gradeAnswer,
  initialSelectionState,
  selectNextQuestion,
} from "./grading";

/**
 * These tests run against real seeded content, not fixtures. If the reference
 * pack is removed or renamed they must fail — that is intentional.
 */
const index = buildContentIndex();
const SUBTOPIC = "sec.mathematics.algebra.linear-equations";
const questions = index.questionsBySubtopicId.get(SUBTOPIC) ?? [];

describe("real content is present", () => {
  it("loads the reference subtopic", () => {
    expect(index.subtopicById.has(SUBTOPIC)).toBe(true);
  });

  it("has at least 10 questions", () => {
    expect(questions.length).toBeGreaterThanOrEqual(10);
  });

  it("gives every question an explanation", () => {
    for (const question of questions) {
      expect(question.explanation.length).toBeGreaterThan(20);
    }
  });
});

describe("gradeAnswer", () => {
  it("grades a real mcq correctly", () => {
    const question = index.questionById.get(`${SUBTOPIC}.q003`);
    expect(question).toBeDefined();
    const result = gradeAnswer(question!, { optionId: "a" });
    expect(result.correct).toBe(true);
    expect(result.explanation).toContain("Subtract 5");
  });

  it("returns the distractor rationale on a wrong mcq answer", () => {
    const question = index.questionById.get(`${SUBTOPIC}.q003`)!;
    const result = gradeAnswer(question, { optionId: "c" });
    expect(result.correct).toBe(false);
    expect(result.distractorNote).toBeTruthy();
  });

  it("grades a real numeric question", () => {
    const question = index.questionById.get(`${SUBTOPIC}.q007`)!;
    expect(gradeAnswer(question, { value: 6 }).correct).toBe(true);
    expect(gradeAnswer(question, { value: 7 }).correct).toBe(false);
  });

  it("grades a real true/false question", () => {
    const question = index.questionById.get(`${SUBTOPIC}.q009`)!;
    expect(gradeAnswer(question, { optionId: "b" }).correct).toBe(true);
  });

  it("flags theory questions for manual review", () => {
    const question = { ...questions[0], type: "theory" as const, markingGuide: ["point"] };
    expect(gradeAnswer(question, { text: "anything" }).requiresManualReview).toBe(true);
  });
});

describe("adaptive selection", () => {
  it("raises difficulty after two consecutive correct answers", () => {
    let state = initialSelectionState(1);
    state = advanceSelection(state, "q1", true);
    state = advanceSelection(state, "q2", true);
    expect(state.difficulty).toBe(2);
  });

  it("lowers difficulty after two consecutive wrong answers", () => {
    let state = initialSelectionState(3);
    state = advanceSelection(state, "q1", false);
    state = advanceSelection(state, "q2", false);
    expect(state.difficulty).toBe(2);
  });

  it("never repeats a question", () => {
    let state = initialSelectionState(1);
    const seen = new Set<string>();
    for (let i = 0; i < questions.length; i++) {
      const next = selectNextQuestion(questions, state);
      if (!next) break;
      expect(seen.has(next.id)).toBe(false);
      seen.add(next.id);
      state = advanceSelection(state, next.id, true);
    }
    expect(seen.size).toBe(questions.length);
  });

  it("returns null when the pool is exhausted", () => {
    const state = { ...initialSelectionState(1), answeredIds: questions.map((q) => q.id) };
    expect(selectNextQuestion(questions, state)).toBeNull();
  });
});
