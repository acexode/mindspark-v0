import { describe, expect, it } from "vitest";
import { courseAvailability, isDraftContent } from "./availability";
import type { Subject } from "./schema";

const subject = {
  id: "ug.test.course",
  topics: [
    { id: "ug.test.course.t1", subtopics: [{ id: "ug.test.course.t1.a", name: "A" }, { id: "ug.test.course.t1.b", name: "B" }] },
    { id: "ug.test.course.t2", subtopics: [{ id: "ug.test.course.t2.c", name: "C" }] },
  ],
} as unknown as Subject;

function indexWith(lessons: string[], questions: Record<string, number>) {
  return {
    subjectById: new Map([[subject.id, subject]]),
    lessonBySubtopicId: new Map(lessons.map((id) => [id, {} as never])),
    questionsBySubtopicId: new Map(Object.entries(questions).map(([id, n]) => [id, Array.from({ length: n }, () => ({}) as never)])),
  };
}

describe("courseAvailability", () => {
  it("counts a unit ready only with a lesson and questions", () => {
    const result = courseAvailability(indexWith(["ug.test.course.t1.a", "ug.test.course.t1.b"], { "ug.test.course.t1.a": 3 }), subject.id);
    expect(result.total).toBe(3);
    expect(result.ready).toBe(1);
    expect(result.missing.map((m) => m.subtopicId)).toEqual(["ug.test.course.t1.b", "ug.test.course.t2.c"]);
    expect(result.missing[0]).toMatchObject({ topicId: "ug.test.course.t1", name: "B" });
  });

  it("is fully ready when every unit is generated", () => {
    const ids = ["ug.test.course.t1.a", "ug.test.course.t1.b", "ug.test.course.t2.c"];
    const result = courseAvailability(indexWith(ids, Object.fromEntries(ids.map((id) => [id, 2]))), subject.id);
    expect(result).toEqual({ ready: 3, total: 3, missing: [] });
  });

  it("returns an empty result for an unknown subject", () => {
    expect(courseAvailability(indexWith([], {}), "ug.nope")).toEqual({ ready: 0, total: 0, missing: [] });
  });
});

describe("isDraftContent", () => {
  it("labels unverified undergraduate content", () => {
    expect(isDraftContent("undergraduate", { verified: false, reviewStatus: "published" })).toBe(true);
    expect(isDraftContent("undergraduate", { verified: true, reviewStatus: "draft" })).toBe(true);
  });
  it("does not label verified undergraduate or secondary content", () => {
    expect(isDraftContent("undergraduate", { verified: true, reviewStatus: "published" })).toBe(false);
    expect(isDraftContent("secondary", { verified: false, reviewStatus: "draft" })).toBe(false);
  });
});
