import type { Question, Subject, Topic } from "./schema";
import { getQuestions } from "./loader";
import { scopeSubjectForStudent } from "./courses";
import {
  advisoryCopy,
  blockingTopic,
  effectivePracticeBest,
  isTopicUnlocked,
  lockCopy,
  sortTopicsForProgression,
  topicReadiness,
  unlockedSubtopicIds,
  unlockedTopicIds,
  type ProgressionMode,
  type TopicProgressItem,
  type TopicReadiness,
} from "@/lib/domain/mastery/progression";
import type { MasteryMap } from "@/lib/domain/mastery/mastery";
import { experienceFor } from "@/lib/domain/student/experience";
import type { StudentProfile } from "@/lib/domain/student/types";

export function topicProgressItems(topics: readonly Topic[]): TopicProgressItem[] {
  return sortTopicsForProgression(topics).map((topic) => ({
    id: topic.id,
    name: topic.name,
    subtopicIds: topic.subtopics.map((subtopic) => subtopic.id),
    questionCount: topic.subtopics.reduce((total, subtopic) => total + getQuestions(subtopic.id).length, 0),
  }));
}

export interface ProgressionContext {
  classLevel: string;
  mastery: MasteryMap;
  topicPracticeBest: Record<string, number>;
  /** Defaults to "sequential" so existing secondary behaviour is unchanged. */
  mode?: ProgressionMode;
  /** Defaults to "secondary", which keeps the JSS/SS year-band filtering. */
  educationLevel?: StudentProfile["educationLevel"];
}

/** The one place a profile becomes a progression policy. */
export function progressionContextFor(profile: StudentProfile): ProgressionContext {
  return {
    classLevel: profile.classLevel,
    mastery: profile.mastery,
    topicPracticeBest: profile.topicPracticeBest,
    mode: experienceFor(profile).progressionMode,
    educationLevel: profile.educationLevel,
  };
}

export function subjectProgression(subject: Subject, ctx: ProgressionContext) {
  const scoped = scopeSubjectForStudent(subject, ctx.classLevel, ctx.educationLevel ?? "secondary");
  const ordered = { ...scoped, topics: sortTopicsForProgression(scoped.topics) };
  const items = topicProgressItems(ordered.topics);
  const open = ctx.mode === "open";

  /**
   * effectivePracticeBest back-fills synthetic passing scores so learners who
   * practised before sequencing existed are not locked out. Nothing sequences
   * in open mode, so running it would surface invented "best practice" numbers.
   */
  const practiceBest = open
    ? ctx.topicPracticeBest
    : effectivePracticeBest(items, ctx.mastery, ctx.topicPracticeBest);

  return {
    subject: ordered,
    items,
    practiceBest,
    unlockedTopicIds: open ? new Set(items.map((item) => item.id)) : unlockedTopicIds(items, practiceBest),
    unlockedSubtopicIds: open
      ? new Set(items.flatMap((item) => item.subtopicIds))
      : unlockedSubtopicIds(items, practiceBest),
    isUnlocked: (topicId: string) => open || isTopicUnlocked(items, topicId, practiceBest),
    blocker: (topicId: string) => (open ? null : blockingTopic(items, topicId, practiceBest)),
    lockReason: (topicId: string) => {
      if (open) return null;
      const blocker = blockingTopic(items, topicId, practiceBest);
      return blocker ? lockCopy(blocker, practiceBest) : null;
    },
    /** Advisory ordering, computed in both modes. Only open-mode UI renders it. */
    readiness: (topicId: string): TopicReadiness => topicReadiness(items, topicId, practiceBest),
  };
}

export function filterQuestionsByUnlockedTopics<T extends Question>(questions: T[], unlockedSubtopicIds: Set<string>): T[] {
  return questions.filter((question) => unlockedSubtopicIds.has(question.subtopicId));
}

export { advisoryCopy };
