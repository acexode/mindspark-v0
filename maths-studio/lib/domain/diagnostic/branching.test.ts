import { describe, expect, it } from "vitest";
import {
  createInitialDiagnosticState,
  processDiagnosticAnswer,
  DIAGNOSTIC_QUESTIONS,
  diagnosticMasteryFromScore,
} from "./branching";

describe("branching diagnostic", () => {
  it("starts at difficulty 1", () => {
    const state = createInitialDiagnosticState();
    expect(state.currentDifficulty).toBe(1);
  });

  it("increases difficulty after correct answers", () => {
    let state = createInitialDiagnosticState();
    const q = DIAGNOSTIC_QUESTIONS[0];
    state = processDiagnosticAnswer(state, q, q.correctIndex);
    state = processDiagnosticAnswer(state, DIAGNOSTIC_QUESTIONS[1], DIAGNOSTIC_QUESTIONS[1].correctIndex);
    state = processDiagnosticAnswer(state, DIAGNOSTIC_QUESTIONS[2], DIAGNOSTIC_QUESTIONS[2].correctIndex);
    expect(state.currentDifficulty).toBeGreaterThanOrEqual(2);
  });

  it("tracks weak concepts on incorrect answers", () => {
    let state = createInitialDiagnosticState();
    const q = DIAGNOSTIC_QUESTIONS[5];
    state = processDiagnosticAnswer(state, q, 1);
    expect(state.weakConcepts.has("algebra-basics")).toBe(true);
  });
});

describe("diagnosticMasteryFromScore", () => {
  it("caps mastery when prerequisite weak", () => {
    expect(diagnosticMasteryFromScore(5, ["algebra-basics"])).toBeLessThanOrEqual(35);
  });
});
