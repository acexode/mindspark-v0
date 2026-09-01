import { getRecord, type MasteryMap } from "./mastery";

/** Minimum topic-practice accuracy required to unlock the next topic. */
export const TOPIC_PRACTICE_UNLOCK_PERCENT = 50;

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
