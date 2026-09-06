import { describe, expect, it } from "vitest";
import {
  answeredIdsFor,
  coverageOf,
  coveredSubtopicIds,
  partitionByAnswered,
  recordAnswered,
} from "./coverage";
import { emptyRecord } from "@/lib/domain/mastery/mastery";

const SUB_A = "sec.maths.number.primes";
const SUB_B = "sec.maths.number.lcm";

describe("recordAnswered", () => {
  it("adds a question to its subtopic", () => {
    expect(recordAnswered({}, SUB_A, "q1")).toEqual({ [SUB_A]: ["q1"] });
  });

  it("never records the same question twice", () => {
    const once = recordAnswered({}, SUB_A, "q1");
    expect(recordAnswered(once, SUB_A, "q1")).toBe(once);
  });

  it("keeps subtopics separate", () => {
    const both = recordAnswered(recordAnswered({}, SUB_A, "q1"), SUB_B, "q2");
    expect(both).toEqual({ [SUB_A]: ["q1"], [SUB_B]: ["q2"] });
  });
});

describe("answeredIdsFor", () => {
  it("collects ids across the given subtopics only", () => {
    const map = { [SUB_A]: ["q1", "q2"], [SUB_B]: ["q3"] };
    expect([...answeredIdsFor(map, [SUB_A])]).toEqual(["q1", "q2"]);
    expect(answeredIdsFor(map, [SUB_A, SUB_B]).size).toBe(3);
  });
});

describe("coverageOf", () => {
  it("reports progress through a bank", () => {
    const coverage = coverageOf(new Set(["q1", "q2"]), ["q1", "q2", "q3", "q4"]);
    expect(coverage).toEqual({ answered: 2, total: 4, percent: 50, complete: false });
  });

  it("is complete only when every question is answered", () => {
    expect(coverageOf(new Set(["q1", "q2"]), ["q1", "q2"]).complete).toBe(true);
  });

  it("does not divide by zero on an empty bank", () => {
    expect(coverageOf(new Set(), [])).toEqual({ answered: 0, total: 0, percent: 0, complete: false });
  });
});

describe("partitionByAnswered", () => {
  const pool = [{ id: "q1" }, { id: "q2" }, { id: "q3" }];

  it("serves unseen questions first", () => {
    const { questions, revisiting } = partitionByAnswered(pool, new Set(["q1"]));
    expect(questions.map((q) => q.id)).toEqual(["q2", "q3"]);
    expect(revisiting).toBe(false);
  });

  /** A finished bank must stay usable — an empty pool would strand the student. */
  it("reopens the whole pool once everything has been answered", () => {
    const { questions, revisiting } = partitionByAnswered(pool, new Set(["q1", "q2", "q3"]));
    expect(questions).toHaveLength(3);
    expect(revisiting).toBe(true);
  });
});

describe("coveredSubtopicIds", () => {
  const ids = [SUB_A, SUB_B];

  it("counts a subtopic whose lesson was opened", () => {
    const profile = { visitedSubtopicIds: { [SUB_A]: "2026-01-01" }, mastery: {}, answeredQuestionIds: {} };
    expect(coveredSubtopicIds(profile, ids)).toEqual([SUB_A]);
  });

  it("counts a subtopic practised without opening the lesson", () => {
    const profile = {
      visitedSubtopicIds: {},
      mastery: { [SUB_B]: { ...emptyRecord(SUB_B), evidenceCount: 1 } },
      answeredQuestionIds: {},
    };
    expect(coveredSubtopicIds(profile, ids)).toEqual([SUB_B]);
  });

  it("excludes subtopics the student has not reached", () => {
    const profile = { visitedSubtopicIds: {}, mastery: {}, answeredQuestionIds: {} };
    expect(coveredSubtopicIds(profile, ids)).toEqual([]);
  });
});
