import { getRecord, type MasteryMap } from "./mastery";

/** Minimum topic-practice accuracy required to unlock the next topic. */
export const TOPIC_PRACTICE_UNLOCK_PERCENT = 50;

/**
 * How a learner moves through a subject's topics.
 *
 * "sequential" — secondary school. Topics unlock in order behind a practice
 *   checkpoint, because a JSS/SS syllabus is taught in a fixed sequence.
 * "open" — undergraduate. Every topic is reachable immediately; ordering is
 *   advisory only. Adult learners revise one course before an exam and their
 *   syllabuses are not strictly linear, so a hard gate is the wrong model.
 */
export type ProgressionMode = "sequential" | "open";

export interface TopicProgressItem {
  id: string;
  name: string;
  subtopicIds: string[];
  questionCount: number;
}

export function sortTopicsForProgression<T extends { order: number }>(topics: readonly T[]): T[] {
  return [...topics].sort((a, b) => a.order - b.order);
}

/**
 * A topic is cleared — and the next one unlocks — when the student scores
 * at least 50% on that topic's practice checkpoint. Topics with no questions
 * cannot block the sequence.
 */
export function isTopicCleared(topic: TopicProgressItem, practiceBest: Record<string, number>): boolean {
  if (topic.questionCount === 0) return true;
  return (practiceBest[topic.id] ?? 0) >= TOPIC_PRACTICE_UNLOCK_PERCENT;
}

/**
 * Students who already practised a later topic before sequencing existed
 * should not be locked out of that work. Earlier topics are treated as
 * cleared so they can finish the furthest topic they have started.
 */
export function effectivePracticeBest(
  topics: readonly TopicProgressItem[],
  mastery: MasteryMap,
  stored: Record<string, number>,
): Record<string, number> {
  const best = { ...stored };
  let furthestStarted = -1;

  topics.forEach((topic, index) => {
    const started = topic.subtopicIds.some((id) => getRecord(mastery, id).evidenceCount > 0);
    if (started) furthestStarted = index;
  });

  for (let index = 0; index < furthestStarted; index += 1) {
    const topic = topics[index];
    if (!topic) continue;
    if ((best[topic.id] ?? 0) < TOPIC_PRACTICE_UNLOCK_PERCENT) {
      best[topic.id] = TOPIC_PRACTICE_UNLOCK_PERCENT;
    }
  }

  return best;
}

export function isTopicUnlocked(
  topics: readonly TopicProgressItem[],
  topicId: string,
  practiceBest: Record<string, number>,
): boolean {
  const index = topics.findIndex((topic) => topic.id === topicId);
  if (index < 0) return false;
  if (index === 0) return true;
  return topics.slice(0, index).every((topic) => isTopicCleared(topic, practiceBest));
}

export function unlockedTopicIds(
  topics: readonly TopicProgressItem[],
  practiceBest: Record<string, number>,
): Set<string> {
  const ids = new Set<string>();
  for (const topic of topics) {
    if (!isTopicUnlocked(topics, topic.id, practiceBest)) break;
    ids.add(topic.id);
  }
  return ids;
}

export function unlockedSubtopicIds(
  topics: readonly TopicProgressItem[],
  practiceBest: Record<string, number>,
): Set<string> {
  const unlocked = unlockedTopicIds(topics, practiceBest);
  return new Set(topics.filter((topic) => unlocked.has(topic.id)).flatMap((topic) => topic.subtopicIds));
}

export function blockingTopic(
  topics: readonly TopicProgressItem[],
  topicId: string,
  practiceBest: Record<string, number>,
): TopicProgressItem | null {
  const index = topics.findIndex((topic) => topic.id === topicId);
  if (index <= 0) return null;
  return topics.slice(0, index).find((topic) => !isTopicCleared(topic, practiceBest)) ?? null;
}

export function currentTopic(
  topics: readonly TopicProgressItem[],
  practiceBest: Record<string, number>,
): TopicProgressItem | null {
  return topics.find((topic) => !isTopicCleared(topic, practiceBest)) ?? null;
}

export function lockCopy(blocker: TopicProgressItem, practiceBest: Record<string, number>): string {
  const best = practiceBest[blocker.id] ?? 0;
  if (best > 0) {
    return `Finish ${blocker.name} first. Score at least ${TOPIC_PRACTICE_UNLOCK_PERCENT}% in that topic’s practice — your best so far is ${best}%.`;
  }
  return `Finish ${blocker.name} first. Score at least ${TOPIC_PRACTICE_UNLOCK_PERCENT}% in its practice to unlock this topic.`;
}

/* --------------------------------------------------------------- readiness */

export type ReadinessPosition = "recommended" | "ahead" | "in-progress" | "done";

export interface TopicReadiness {
  /** True when every earlier topic in the outline is already cleared. */
  ready: boolean;
  position: ReadinessPosition;
  /** Advisory sentence, or null when there is nothing to suggest. */
  suggestion: string | null;
  suggestedFirst: TopicProgressItem | null;
}

/**
 * The open-mode counterpart to lockCopy: it reports where a topic sits in the
 * suggested order without ever withholding it. Callers render this as a note,
 * never as a barrier.
 */
export function advisoryCopy(blocker: TopicProgressItem, practiceBest: Record<string, number>): string {
  const best = practiceBest[blocker.id] ?? 0;
  if (best > 0) {
    return `The outline places ${blocker.name} before this — your best there is ${best}%. You can study this now if you prefer.`;
  }
  return `The outline places ${blocker.name} before this one. You can study this now if you prefer.`;
}

export function topicReadiness(
  topics: readonly TopicProgressItem[],
  topicId: string,
  practiceBest: Record<string, number>,
): TopicReadiness {
  const topic = topics.find((t) => t.id === topicId);
  if (!topic) {
    return { ready: false, position: "ahead", suggestion: null, suggestedFirst: null };
  }

  if (isTopicCleared(topic, practiceBest)) {
    return { ready: true, position: "done", suggestion: null, suggestedFirst: null };
  }

  const suggestedFirst = blockingTopic(topics, topicId, practiceBest);
  if (!suggestedFirst) {
    const started = (practiceBest[topic.id] ?? 0) > 0;
    return {
      ready: true,
      position: started ? "in-progress" : "recommended",
      suggestion: null,
      suggestedFirst: null,
    };
  }

  return {
    ready: false,
    position: "ahead",
    suggestion: advisoryCopy(suggestedFirst, practiceBest),
    suggestedFirst,
  };
}
