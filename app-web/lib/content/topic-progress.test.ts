import { describe, expect, it } from "vitest";
import { getSubject } from "./loader";
import { subjectProgression, type ProgressionContext } from "./topic-progress";
import { TOPIC_PRACTICE_UNLOCK_PERCENT } from "@/lib/domain/mastery/progression";

const UG_SUBJECT = "ug.computer-science";
const SEC_SUBJECT = "sec.mathematics";

function ctx(over: Partial<ProgressionContext> = {}): ProgressionContext {
  return { classLevel: "Year1", mastery: {}, topicPracticeBest: {}, ...over };
}

describe("progression mode", () => {
  const subject = getSubject(UG_SUBJECT);

  it("has the undergraduate fixture available", () => {
    expect(subject).not.toBeNull();
  });

  it("sequential mode gates everything after the first topic", () => {
    const progression = subjectProgression(subject!, ctx({ classLevel: "Year2" }));
    const [first, second] = progression.items;
    expect(progression.isUnlocked(first!.id)).toBe(true);
    expect(progression.isUnlocked(second!.id)).toBe(false);
    expect(progression.lockReason(second!.id)).toMatch(/Finish/);
    expect(progression.blocker(second!.id)?.id).toBe(first!.id);
  });

  it("open mode unlocks every topic and never returns a lock reason", () => {
    const progression = subjectProgression(
      subject!,
      ctx({ classLevel: "Year2", mode: "open", educationLevel: "undergraduate" }),
    );

    for (const item of progression.items) {
      expect(progression.isUnlocked(item.id)).toBe(true);
      expect(progression.lockReason(item.id)).toBeNull();
      expect(progression.blocker(item.id)).toBeNull();
    }
    expect(progression.unlockedTopicIds.size).toBe(progression.items.length);
  });

  it("open mode still reports advisory readiness so the UI can suggest an order", () => {
    const progression = subjectProgression(
      subject!,
      ctx({ classLevel: "Year2", mode: "open", educationLevel: "undergraduate" }),
    );
    const later = progression.items[2]!;
    const readiness = progression.readiness(later.id);
    expect(readiness.ready).toBe(false);
    expect(readiness.suggestion).toMatch(/if you prefer/i);
  });

  it("open mode exposes every subtopic, so practice and quiz pools are complete", () => {
    const open = subjectProgression(
      subject!,
      ctx({ classLevel: "Year2", mode: "open", educationLevel: "undergraduate" }),
    );
    const sequential = subjectProgression(subject!, ctx({ classLevel: "Year2" }));

    const allSubtopics = open.items.flatMap((item) => item.subtopicIds);
    expect(open.unlockedSubtopicIds.size).toBe(allSubtopics.length);
    expect(sequential.unlockedSubtopicIds.size).toBeLessThan(allSubtopics.length);
  });

  it("does not invent practice-best scores in open mode", () => {
    // A student with evidence in a later topic would otherwise be back-filled
    // with synthetic 50s by effectivePracticeBest.
    const subtopicId = subject!.topics[2]!.subtopics[0]!.id;
    const mastery = {
      [subtopicId]: { subtopicId, score: 30, state: "exploring" as const, evidenceCount: 3, lastPractisedAt: null },
    };

    const open = subjectProgression(
      subject!,
      ctx({ classLevel: "Year2", mode: "open", educationLevel: "undergraduate", mastery }),
    );
    expect(open.practiceBest).toEqual({});

    const sequential = subjectProgression(subject!, ctx({ classLevel: "Year2", mastery }));
    expect(sequential.practiceBest[subject!.topics[0]!.id]).toBe(TOPIC_PRACTICE_UNLOCK_PERCENT);
  });
});

describe("year-band scoping", () => {
  it("hides later-year content from a secondary-style scoped undergraduate", () => {
    const subject = getSubject(UG_SUBJECT)!;
    const scoped = subjectProgression(subject, ctx({ classLevel: "Year1" }));
    expect(scoped.subject.topics.length).toBeLessThan(subject.topics.length);
  });

  it("shows an undergraduate every topic of a course regardless of year", () => {
    const subject = getSubject(UG_SUBJECT)!;
    const open = subjectProgression(
      subject,
      ctx({ classLevel: "Year1", mode: "open", educationLevel: "undergraduate" }),
    );
    expect(open.subject.topics.length).toBe(subject.topics.length);
  });

  it("leaves secondary class-band filtering untouched", () => {
    const subject = getSubject(SEC_SUBJECT)!;
    const jss1 = subjectProgression(subject, ctx({ classLevel: "JSS1" }));
    const ss3 = subjectProgression(subject, ctx({ classLevel: "SS3" }));
    expect(jss1.subject.topics.length).toBeGreaterThan(0);
    expect(jss1.subject.topics.length).toBeLessThan(ss3.subject.topics.length);
  });
});
