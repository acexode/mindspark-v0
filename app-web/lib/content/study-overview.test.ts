import { describe, expect, it } from "vitest";
import { filterSubjectForClass } from "./class-visibility";
import { getSubject } from "./loader";
import { buildSubjectOverview } from "./study-overview";
import { DEFAULT_STUDENT_PROFILE, type StudentProfile } from "@/lib/domain/student/types";

const maths = getSubject("sec.mathematics")!;
const profile = (overrides: Partial<StudentProfile> = {}): StudentProfile => ({
  ...DEFAULT_STUDENT_PROFILE,
  onboarded: true,
  classLevel: "SS2",
  selectedSubjectIds: ["sec.mathematics"],
  ...overrides,
});

describe("buildSubjectOverview", () => {
  it("only includes topics visible to the student's class", () => {
    const overview = buildSubjectOverview(maths, profile());
    const visible = new Set(filterSubjectForClass(maths, "SS2").topics.map((t) => t.id));
    expect(overview.topics.length).toBeGreaterThan(0);
    expect(overview.topics.every((t) => visible.has(t.id))).toBe(true);
  });

  it("gives a new secondary student exactly one current topic and locks the rest", () => {
    const overview = buildSubjectOverview(maths, profile());
    expect(overview.topics.filter((t) => t.status === "current")).toHaveLength(1);
    expect(overview.current?.status).toBe("current");
    expect(overview.clearedCount).toBe(0);
    expect(overview.lockedCount).toBeGreaterThan(0);
    expect(overview.started).toBe(false);
  });

  it("moves the current topic on once the checkpoint is passed", () => {
    const first = buildSubjectOverview(maths, profile()).current!;
    const next = buildSubjectOverview(maths, profile({ topicPracticeBest: { [first.id]: 60 } }));
    expect(next.topics.find((t) => t.id === first.id)?.status).toBe("cleared");
    expect(next.current?.id).not.toBe(first.id);
    expect(next.clearedCount).toBe(1);
  });

  it("never marks anything current or locked for undergraduates (modules are open)", () => {
    const course = getSubject("ug.cs-programming-fundamentals") ?? null;
    if (!course) return;
    const overview = buildSubjectOverview(course, profile({ educationLevel: "undergraduate", classLevel: "Year1" }));
    expect(overview.topics.some((t) => t.status === "current" || t.status === "locked")).toBe(false);
  });

  it("counts mastery bands across every in-scope subtopic", () => {
    const overview = buildSubjectOverview(maths, profile());
    const total = Object.values(overview.distribution).reduce((a, b) => a + b, 0);
    expect(total).toBe(overview.subtopicCount);
    expect(overview.distribution.not_started).toBe(overview.subtopicCount);
  });

  it("offers a way back into the last lesson opened", () => {
    const unit = maths.topics[0].subtopics[0];
    const overview = buildSubjectOverview(maths, profile({ lastVisited: { [maths.id]: unit.id } }));
    expect(overview.continueUnit?.name).toBe(unit.name);
    expect(overview.continueUnit?.href).toContain("/learn/");
    expect(overview.started).toBe(true);
  });
});
