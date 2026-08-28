import { describe, expect, it } from "vitest";
import {
  aggregateMastery,
  applyEvidence,
  calculateXp,
  emptyRecord,
  isUnlocked,
  lockReason,
  scoreToState,
  type MasteryMap,
} from "./mastery";

const SUBTOPIC = "sec.mathematics.algebra.linear-equations";
const PREREQ = "sec.mathematics.algebra.expressions";

describe("scoreToState", () => {
  it.each([
    [0, "not_started"],
    [20, "exploring"],
    [50, "developing"],
    [70, "proficient"],
    [90, "mastered"],
  ])("maps %i to %s", (score, expected) => {
    expect(scoreToState(score)).toBe(expected);
  });
});

describe("applyEvidence", () => {
  it("gains more on harder questions", () => {
    const easy = applyEvidence(emptyRecord(SUBTOPIC), {
      subtopicId: SUBTOPIC,
      correct: true,
      difficulty: 1,
      attempts: 1,
      hintsUsed: 0,
    });
    const hard = applyEvidence(emptyRecord(SUBTOPIC), {
      subtopicId: SUBTOPIC,
      correct: true,
      difficulty: 3,
      attempts: 1,
      hintsUsed: 0,
    });
    expect(hard.delta).toBeGreaterThan(easy.delta);
  });

  it("reduces the gain when hints were used", () => {
    const unaided = applyEvidence(emptyRecord(SUBTOPIC), {
      subtopicId: SUBTOPIC,
      correct: true,
      difficulty: 2,
      attempts: 1,
      hintsUsed: 0,
    });
    const helped = applyEvidence(emptyRecord(SUBTOPIC), {
      subtopicId: SUBTOPIC,
      correct: true,
      difficulty: 2,
      attempts: 1,
      hintsUsed: 2,
    });
    expect(helped.delta).toBeLessThan(unaided.delta);
    expect(helped.delta).toBeGreaterThan(0);
  });

  it("applies a small penalty for an incorrect answer without zeroing progress", () => {
    const start = { ...emptyRecord(SUBTOPIC), score: 50, state: scoreToState(50) };
    const result = applyEvidence(start, {
      subtopicId: SUBTOPIC,
      correct: false,
      difficulty: 2,
      attempts: 1,
      hintsUsed: 0,
    });
    expect(result.record.score).toBe(47);
    expect(result.xpAwarded).toBe(0);
  });

  it("never exceeds 100", () => {
    const start = { ...emptyRecord(SUBTOPIC), score: 99 };
    const result = applyEvidence(start, {
      subtopicId: SUBTOPIC,
      correct: true,
      difficulty: 3,
      attempts: 1,
      hintsUsed: 0,
    });
    expect(result.record.score).toBe(100);
  });

  it("records an evidence count and timestamp", () => {
    const result = applyEvidence(emptyRecord(SUBTOPIC), {
      subtopicId: SUBTOPIC,
      correct: true,
      difficulty: 1,
      attempts: 1,
      hintsUsed: 0,
    });
    expect(result.record.evidenceCount).toBe(1);
    expect(result.record.lastPractisedAt).not.toBeNull();
  });
});

describe("calculateXp", () => {
  it("awards nothing for an incorrect answer", () => {
    expect(calculateXp({ subtopicId: SUBTOPIC, correct: false, difficulty: 3, attempts: 1, hintsUsed: 0 })).toBe(0);
  });

  it("awards more for harder questions", () => {
    const easy = calculateXp({ subtopicId: SUBTOPIC, correct: true, difficulty: 1, attempts: 1, hintsUsed: 0 });
    const hard = calculateXp({ subtopicId: SUBTOPIC, correct: true, difficulty: 3, attempts: 1, hintsUsed: 0 });
    expect(hard).toBeGreaterThan(easy);
  });
});

describe("aggregateMastery", () => {
  it("averages subtopic scores", () => {
    const mastery: MasteryMap = {
      a: { ...emptyRecord("a"), score: 80 },
      b: { ...emptyRecord("b"), score: 40 },
    };
    expect(aggregateMastery(mastery, ["a", "b"]).score).toBe(60);
  });

  it("returns not_started for an empty set", () => {
    expect(aggregateMastery({}, []).state).toBe("not_started");
  });

  it("counts unvisited subtopics as zero", () => {
    const mastery: MasteryMap = { a: { ...emptyRecord("a"), score: 100 } };
    expect(aggregateMastery(mastery, ["a", "b"]).score).toBe(50);
  });
});

describe("prerequisite gating", () => {
  it("reports not-ready until the prerequisite reaches Developing", () => {
    const mastery: MasteryMap = { [PREREQ]: { ...emptyRecord(PREREQ), score: 20 } };
    expect(isUnlocked(mastery, [PREREQ])).toBe(false);
    expect(lockReason(mastery, [PREREQ], () => "Algebraic Expressions")).toContain("Algebraic Expressions");
  });

  it("phrases the prerequisite as a suggestion, not a barrier", () => {
    const mastery: MasteryMap = { [PREREQ]: { ...emptyRecord(PREREQ), score: 10 } };
    expect(lockReason(mastery, [PREREQ], () => "Algebraic Expressions")).toMatch(/suggest/i);
  });

  it("unlocks once the prerequisite is met", () => {
    const mastery: MasteryMap = { [PREREQ]: { ...emptyRecord(PREREQ), score: 45 } };
    expect(isUnlocked(mastery, [PREREQ])).toBe(true);
    expect(lockReason(mastery, [PREREQ], () => "Algebraic Expressions")).toBeNull();
  });

  it("treats a subtopic with no prerequisites as unlocked", () => {
    expect(isUnlocked({}, [])).toBe(true);
  });
});
