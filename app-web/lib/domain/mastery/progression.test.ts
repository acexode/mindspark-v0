import { describe, expect, it } from "vitest";
import { emptyRecord, type MasteryMap } from "./mastery";
import {
  blockingTopic,
  currentTopic,
  effectivePracticeBest,
  isTopicCleared,
  isTopicUnlocked,
  lockCopy,
  topicReadiness,
  TOPIC_PRACTICE_UNLOCK_PERCENT,
  unlockedSubtopicIds,
  unlockedTopicIds,
  type TopicProgressItem,
} from "./progression";

const topics: TopicProgressItem[] = [
  { id: "t1", name: "Number", subtopicIds: ["s1a", "s1b"], questionCount: 10 },
  { id: "t2", name: "Algebra", subtopicIds: ["s2a"], questionCount: 8 },
  { id: "t3", name: "Geometry", subtopicIds: ["s3a"], questionCount: 6 },
];

describe("isTopicCleared", () => {
  it("treats a topic with no questions as already cleared", () => {
    expect(isTopicCleared({ ...topics[0]!, questionCount: 0 }, {})).toBe(true);
  });

  it("requires a 50% practice checkpoint", () => {
    expect(isTopicCleared(topics[0]!, { t1: 49 })).toBe(false);
    expect(isTopicCleared(topics[0]!, { t1: 50 })).toBe(true);
  });
});

describe("topic sequence", () => {
  it("always unlocks the first topic", () => {
    expect(isTopicUnlocked(topics, "t1", {})).toBe(true);
    expect(isTopicUnlocked(topics, "t2", {})).toBe(false);
    expect([...unlockedTopicIds(topics, {})]).toEqual(["t1"]);
  });

  it("unlocks the next topic after a passing practice score", () => {
    const best = { t1: TOPIC_PRACTICE_UNLOCK_PERCENT };
    expect(isTopicUnlocked(topics, "t2", best)).toBe(true);
    expect(isTopicUnlocked(topics, "t3", best)).toBe(false);
    expect([...unlockedTopicIds(topics, best)]).toEqual(["t1", "t2"]);
  });

  it("keeps later topics locked until every previous checkpoint is passed", () => {
    expect(isTopicUnlocked(topics, "t3", { t1: 80, t2: 40 })).toBe(false);
    expect(isTopicUnlocked(topics, "t3", { t1: 80, t2: 50 })).toBe(true);
  });

  it("exposes the blocking topic and a reason", () => {
    const blocker = blockingTopic(topics, "t3", { t1: 80 });
    expect(blocker?.id).toBe("t2");
    expect(lockCopy(blocker!, { t2: 20 })).toMatch(/Algebra/);
    expect(lockCopy(blocker!, { t2: 20 })).toMatch(/20%/);
  });

  it("reports the current unfinished topic", () => {
    expect(currentTopic(topics, {})?.id).toBe("t1");
    expect(currentTopic(topics, { t1: 50 })?.id).toBe("t2");
    expect(currentTopic(topics, { t1: 50, t2: 70, t3: 90 })).toBeNull();
  });

  it("limits unlocked subtopics to the open prefix", () => {
    expect([...unlockedSubtopicIds(topics, { t1: 50 })]).toEqual(["s1a", "s1b", "s2a"]);
  });
});

describe("topicReadiness", () => {
  it("marks the first unstarted topic as recommended with no suggestion", () => {
    const readiness = topicReadiness(topics, "t1", {});
    expect(readiness.ready).toBe(true);
    expect(readiness.position).toBe("recommended");
    expect(readiness.suggestion).toBeNull();
  });

  it("marks a cleared topic as done", () => {
    expect(topicReadiness(topics, "t1", { t1: 60 }).position).toBe("done");
  });

  it("reports a later topic as ahead, with an advisory suggestion and never a lock", () => {
    const readiness = topicReadiness(topics, "t3", { t1: 80, t2: 20 });
    expect(readiness.ready).toBe(false);
    expect(readiness.position).toBe("ahead");
    expect(readiness.suggestedFirst?.id).toBe("t2");
    expect(readiness.suggestion).toMatch(/Algebra/);
    expect(readiness.suggestion).toMatch(/20%/);
    // Advisory, not a barrier — the copy must offer the choice.
    expect(readiness.suggestion).toMatch(/if you prefer/i);
    expect(readiness.suggestion).not.toMatch(/locked/i);
  });

  it("treats a topic as in-progress once it has a non-passing best score", () => {
    expect(topicReadiness(topics, "t1", { t1: 30 }).position).toBe("in-progress");
  });
});

describe("effectivePracticeBest", () => {
  it("grandfathers earlier topics when a later one was already started", () => {
    const mastery: MasteryMap = {
      s3a: { ...emptyRecord("s3a"), evidenceCount: 2, score: 30 },
    };
    const effective = effectivePracticeBest(topics, mastery, {});
    expect(effective.t1).toBe(50);
    expect(effective.t2).toBe(50);
    expect(effective.t3).toBeUndefined();
  });

  it("does not invent a passing score for a new student", () => {
    expect(effectivePracticeBest(topics, {}, {})).toEqual({});
  });
});
