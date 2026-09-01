import type { Question, Subject, Topic } from "./schema";
import { getQuestions } from "./loader";
import { filterSubjectForClass } from "./class-visibility";
import {
  blockingTopic,
  effectivePracticeBest,
  isTopicUnlocked,
  lockCopy,
  sortTopicsForProgression,
  unlockedSubtopicIds,
  unlockedTopicIds,
  type TopicProgressItem,
} from "@/lib/domain/mastery/progression";
import type { MasteryMap } from "@/lib/domain/mastery/mastery";

export function topicProgressItems(topics: readonly Topic[]): TopicProgressItem[] {
  return sortTopicsForProgression(topics).map((topic) => ({
    id: topic.id,
    name: topic.name,
    subtopicIds: topic.subtopics.map((subtopic) => subtopic.id),
    questionCount: topic.subtopics.reduce((total, subtopic) => total + getQuestions(subtopic.id).length, 0),
  }));
}

export function subjectProgression(
  subject: Subject,
  classLevel: string,
  mastery: MasteryMap,
  topicPracticeBest: Record<string, number>,
) {
  const scoped = filterSubjectForClass(subject, classLevel);
  const ordered = { ...scoped, topics: sortTopicsForProgression(scoped.topics) };
  const items = topicProgressItems(ordered.topics);
  const practiceBest = effectivePracticeBest(items, mastery, topicPracticeBest);
  const unlockedIds = unlockedTopicIds(items, practiceBest);
  const unlockedSubs = unlockedSubtopicIds(items, practiceBest);

  return {
    subject: ordered,
    items,
    practiceBest,
    unlockedTopicIds: unlockedIds,
    unlockedSubtopicIds: unlockedSubs,
    isUnlocked: (topicId: string) => isTopicUnlocked(items, topicId, practiceBest),
    blocker: (topicId: string) => blockingTopic(items, topicId, practiceBest),
    lockReason: (topicId: string) => {
      const blocker = blockingTopic(items, topicId, practiceBest);
      return blocker ? lockCopy(blocker, practiceBest) : null;
    },
  };
}

export function filterQuestionsByUnlockedTopics<T extends Question>(questions: T[], unlockedSubtopicIds: Set<string>): T[] {
  return questions.filter((question) => unlockedSubtopicIds.has(question.subtopicId));
}
