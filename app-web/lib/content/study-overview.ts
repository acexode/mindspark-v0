import { filterQuestionsByClass } from "./class-visibility";
import { getLesson, getQuestionsForTopic, idSlug } from "./loader";
import { learnHref, practiceHref, topicHref } from "./navigation";
import type { Subject } from "./schema";
import { progressionContextFor, subjectProgression } from "./topic-progress";
import { aggregateMastery, getRecord, type MasteryState } from "@/lib/domain/mastery/mastery";
import { isTopicCleared } from "@/lib/domain/mastery/progression";
import { coveredSubtopicIds } from "@/lib/domain/student/coverage";
import type { StudentProfile } from "@/lib/domain/student/types";

/**
 * cleared: passed its checkpoint. current: the one topic a sequential student is working on.
 * open: unlocked but not cleared (open-mode modules, or cleared-order gaps). locked: not reachable yet.
 */
export type TopicStatus = "cleared" | "current" | "open" | "locked";

export interface TopicOverview {
  id: string;
  name: string;
  status: TopicStatus;
  mastery: number;
  masteryState: MasteryState;
  /** Best whole-topic practice score, or null if never attempted. */
  practiceBest: number | null;
  questionCount: number;
  answeredCount: number;
  subtopicCount: number;
  practisedSubtopicCount: number;
  /** Subtopics the student has reached; whole-topic practice only draws on these (see coveredSubtopicIds). */
  coveredSubtopicCount: number;
  practiceHref: string;
  /** The topic page in the library, where its lessons start. */
  libraryHref: string;
}

export interface ContinueUnit {
  name: string;
  topicName: string;
  href: string;
}

export interface SubjectOverview {
  id: string;
  slug: string;
  /** Course code for undergraduates, subject name otherwise. */
  label: string;
  name: string;
  accent: string;
  topics: TopicOverview[];
  current: TopicOverview | null;
  clearedCount: number;
  lockedCount: number;
  mastery: { score: number; state: MasteryState };
  /** How many in-scope subtopics sit in each mastery band. */
  distribution: Record<MasteryState, number>;
  subtopicCount: number;
  practisedSubtopicCount: number;
  questionCount: number;
  answeredCount: number;
  /** The last lesson opened in this subject, if any. */
  continueUnit: ContinueUnit | null;
  practiceHref: string;
  started: boolean;
}

const EMPTY_DISTRIBUTION: Record<MasteryState, number> = {
  not_started: 0,
  exploring: 0,
  developing: 0,
  proficient: 0,
  mastered: 0,
};

/**
 * One read of where a student stands in a subject, shared by Today, Practice and Progress so
 * the three pages can never disagree about what is current, cleared or locked. Everything is
 * derived from the profile on read; nothing here is stored.
 */
export function buildSubjectOverview(subject: Subject, profile: StudentProfile): SubjectOverview {
  const progression = subjectProgression(subject, progressionContextFor(profile));
  const scoped = progression.subject;
  const sequential = profile.educationLevel !== "undergraduate";
  const answered = (subtopicId: string) => new Set(profile.answeredQuestionIds[subtopicId] ?? []);

  let currentAssigned = false;
  const topics: TopicOverview[] = scoped.topics.map((topic) => {
    const item = progression.items.find((i) => i.id === topic.id);
    const subtopicIds = topic.subtopics.map((s) => s.id);
    const questions = filterQuestionsByClass(getQuestionsForTopic(topic.id), subject, profile.classLevel);
    const answeredCount = questions.filter((q) => answered(q.subtopicId).has(q.id)).length;
    const agg = aggregateMastery(profile.mastery, subtopicIds);
    const best = progression.practiceBest[topic.id];

    let status: TopicStatus;
    if (!progression.isUnlocked(topic.id)) status = "locked";
    else if (item && questions.length > 0 && isTopicCleared(item, progression.practiceBest)) status = "cleared";
    else if (sequential && !currentAssigned && questions.length > 0) status = "current";
    else status = "open";
    if (status === "current") currentAssigned = true;

    return {
      id: topic.id,
      name: topic.name,
      status,
      mastery: agg.score,
      masteryState: agg.state,
      practiceBest: typeof best === "number" && best > 0 ? best : null,
      questionCount: questions.length,
      answeredCount,
      subtopicCount: subtopicIds.length,
      practisedSubtopicCount: subtopicIds.filter((id) => getRecord(profile.mastery, id).evidenceCount > 0).length,
      coveredSubtopicCount: coveredSubtopicIds(profile, subtopicIds).length,
      practiceHref: practiceHref(subject, topic),
      libraryHref: topicHref(subject, topic),
    };
  });

  const subtopicIds = scoped.topics.flatMap((t) => t.subtopics.map((s) => s.id));
  const distribution = { ...EMPTY_DISTRIBUTION };
  for (const id of subtopicIds) distribution[getRecord(profile.mastery, id).state] += 1;

  const practisedSubtopicCount = topics.reduce((sum, t) => sum + t.practisedSubtopicCount, 0);
  const answeredCount = topics.reduce((sum, t) => sum + t.answeredCount, 0);

  return {
    id: subject.id,
    slug: idSlug(subject.id),
    label: subject.courseCode ?? subject.name,
    name: subject.name,
    accent: subject.accentColor,
    topics,
    current: topics.find((t) => t.status === "current") ?? topics.find((t) => t.status === "open") ?? null,
    clearedCount: topics.filter((t) => t.status === "cleared").length,
    lockedCount: topics.filter((t) => t.status === "locked").length,
    mastery: aggregateMastery(profile.mastery, subtopicIds),
    distribution,
    subtopicCount: subtopicIds.length,
    practisedSubtopicCount,
    questionCount: topics.reduce((sum, t) => sum + t.questionCount, 0),
    answeredCount,
    continueUnit: continueUnitFor(scoped, profile.lastVisited[subject.id]),
    practiceHref: practiceHref(subject),
    started: practisedSubtopicCount > 0 || Boolean(profile.lastVisited[subject.id]),
  };
}

function continueUnitFor(subject: Subject, subtopicId: string | undefined): ContinueUnit | null {
  if (!subtopicId || !getLesson(subtopicId)) return null;
  for (const topic of subject.topics) {
    const subtopic = topic.subtopics.find((s) => s.id === subtopicId);
    if (subtopic) return { name: subtopic.name, topicName: topic.name, href: learnHref(subject, topic, subtopic) };
  }
  return null;
}
