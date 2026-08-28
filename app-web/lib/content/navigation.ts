import {
  getSubject,
  getSubjects,
  getLesson,
  getQuestions,
  idSlug,
  resolveSubjectSlug,
  resolveSubtopicSlug,
  resolveTopicSlug,
} from "./loader";
import type { EducationLevel, Subject, Subtopic, Topic } from "./schema";
import type { RecommendationCandidate } from "@/lib/domain/recommendations/recommend";

export interface ResolvedPath {
  subject: Subject;
  topic: Topic;
  subtopic: Subtopic;
}

export function resolvePath(
  subjectSlug: string,
  topicSlug?: string,
  subtopicSlug?: string,
): { subject: Subject | null; topic?: Topic; subtopic?: Subtopic } {
  const subject = resolveSubjectSlug(subjectSlug);
  if (!subject) return { subject: null };
  if (!topicSlug) return { subject };

  const topic = resolveTopicSlug(subject, topicSlug);
  if (!topic || !subtopicSlug) return { subject, topic: topic ?? undefined };

  const subtopic = resolveSubtopicSlug(topic, subtopicSlug);
  return { subject, topic, subtopic: subtopic ?? undefined };
}

export function subjectHref(subject: Subject): string {
  return `/library/${idSlug(subject.id)}`;
}

export function topicHref(subject: Subject, topic: Topic): string {
  return `/library/${idSlug(subject.id)}/${idSlug(topic.id)}`;
}

export function learnHref(subject: Subject, topic: Topic, subtopic: Subtopic): string {
  return `/learn/${idSlug(subject.id)}/${idSlug(topic.id)}/${idSlug(subtopic.id)}`;
}

export function practiceHref(subject: Subject, topic?: Topic): string {
  return topic ? `/practice/${idSlug(subject.id)}/${idSlug(topic.id)}` : `/practice/${idSlug(subject.id)}`;
}

export function quizHref(subject: Subject, mode: "topic" | "subject" | "exam" = "subject"): string {
  return `/quiz/${idSlug(subject.id)}/${mode}`;
}

/** Flattens every subtopic across the given subjects into recommendation candidates. */
export function buildCandidates(subjectIds: string[]): RecommendationCandidate[] {
  const subjects = subjectIds.length > 0
    ? subjectIds.map((id) => getSubject(id)).filter((s): s is Subject => Boolean(s))
    : getSubjects();

  return subjects.flatMap((subject) =>
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

export function subjectsForLevel(level: EducationLevel): Subject[] {
  return getSubjects(level);
}

export function allSubtopicIds(subject: Subject): string[] {
  return subject.topics.flatMap((t) => t.subtopics.map((s) => s.id));
}

export function subtopicIdsForTopic(topic: Topic): string[] {
  return topic.subtopics.map((s) => s.id);
}
