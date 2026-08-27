import { describe, expect, it } from "vitest";
import { buildContentIndex, getLesson, getQuestions, idSlug } from "@/lib/content/loader";
import { emptyRecord, type MasteryMap } from "@/lib/domain/mastery/mastery";
import { recommendNext, type RecommendationCandidate } from "./recommend";

/** Candidates are built from real seeded content, never invented fixtures. */
function realCandidates(): RecommendationCandidate[] {
  const index = buildContentIndex();
  return index.subjects.flatMap((subject) =>
    subject.topics.flatMap((topic) =>
      topic.subtopics.map((subtopic) => ({
        subtopicId: subtopic.id,
        subtopicName: subtopic.name,
        topicId: topic.id,
        topicName: topic.name,
        subjectId: subject.id,
        subjectName: subject.name,
        subjectSlug: idSlug(subject.id),
        topicSlug: idSlug(topic.id),
        subtopicSlug: idSlug(subtopic.id),
        prerequisites: subtopic.prerequisites,
        hasLesson: Boolean(getLesson(subtopic.id)),
        questionCount: getQuestions(subtopic.id).length,
      })),
    ),
  );
}

const candidates = realCandidates();

describe("recommendNext", () => {
  it("has real candidates to work with", () => {
    expect(candidates.length).toBeGreaterThan(0);
  });

  it("tells a brand-new student to learn, never to take a quiz", () => {
    const result = recommendNext(candidates, {});
    expect(result).not.toBeNull();
    expect(result!.action).toBe("learn");
    expect(result!.href).toMatch(/^\/learn\//);
  });

  it("always explains its reasoning", () => {
    const result = recommendNext(candidates, {});
    expect(result!.reason.length).toBeGreaterThan(15);
  });

  it("prioritises repairing a weak subtopic", () => {
    const target = candidates.find((c) => c.questionCount > 0)!;
    const mastery: MasteryMap = {
      [target.subtopicId]: { ...emptyRecord(target.subtopicId), score: 18, evidenceCount: 3 },
    };
    const result = recommendNext(candidates, mastery);
    expect(result!.action).toBe("revise");
    expect(result!.subtopicId).toBe(target.subtopicId);
  });

  it("suggests practice once a subtopic is started but not yet proven", () => {
    const target = candidates.find((c) => c.questionCount > 0)!;
    const mastery: MasteryMap = {
      [target.subtopicId]: { ...emptyRecord(target.subtopicId), score: 55, evidenceCount: 4 },
    };
    const result = recommendNext(candidates, mastery);
    expect(result!.action).toBe("practise");
    expect(result!.href).toMatch(/^\/practice\//);
  });

  it("returns null when the student has no subjects", () => {
    expect(recommendNext([], {})).toBeNull();
  });

  it("does not strand the student when a prerequisite has no lesson yet", () => {
    const withoutLesson = candidates.map((c, i) => (i === 0 ? { ...c, hasLesson: false } : c));
    const result = recommendNext(withoutLesson, {});
    expect(result!.action).toBe("learn");
  });
});
