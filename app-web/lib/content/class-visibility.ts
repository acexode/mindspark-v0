import type { ClassLevel, Question, Subject, Subtopic, Topic } from "./schema";

export function visibleSubtopicIds(subject: Subject, studentClass: string): Set<string> {
  return new Set(
    filterSubjectForClass(subject, studentClass).topics.flatMap((topic) => topic.subtopics.map((subtopic) => subtopic.id)),
  );
}

export function filterQuestionsByClass(questions: Question[], subject: Subject, studentClass: string): Question[] {
  const visible = visibleSubtopicIds(subject, studentClass);
  return questions.filter((question) => visible.has(question.subtopicId));
}

const JSS: ClassLevel[] = ["JSS1", "JSS2", "JSS3"];
const SS: ClassLevel[] = ["SS1", "SS2", "SS3"];
const SECONDARY: ClassLevel[] = [...JSS, ...SS];

export function isSecondaryClass(value: string): value is ClassLevel {
  return SECONDARY.includes(value as ClassLevel);
}

function band(level: ClassLevel): "jss" | "ss" | "other" {
  if (JSS.includes(level)) return "jss";
  if (SS.includes(level)) return "ss";
  return "other";
}

function indexInBand(level: ClassLevel): number {
  const list = band(level) === "jss" ? JSS : band(level) === "ss" ? SS : SECONDARY;
  return list.indexOf(level);
}

/**
 * A JSS student never sees SS-only topics, and an SS student never sees
 * JSS-only topics. Within the same band, a student sees their class and
 * earlier classes (so SS3 can revise SS1, but JSS1 cannot jump to JSS3).
 */
export function isClassVisible(studentClass: string, contentClasses: readonly string[]): boolean {
  if (!isSecondaryClass(studentClass)) return true;
  if (contentClasses.length === 0) return true;

  const studentBand = band(studentClass);
  const inBand = contentClasses.filter((level): level is ClassLevel => isSecondaryClass(level) && band(level) === studentBand);
  if (inBand.length === 0) return false;

  const studentIndex = indexInBand(studentClass);
  return inBand.some((level) => indexInBand(level) <= studentIndex);
}

export function classLevelsForSubtopic(topic: Topic, subtopic: Subtopic): string[] {
  return subtopic.classLevels && subtopic.classLevels.length > 0 ? subtopic.classLevels : topic.classLevels;
}

export function isTopicVisibleToClass(studentClass: string, topic: Topic): boolean {
  const visibleSubs = topic.subtopics.filter((subtopic) => isClassVisible(studentClass, classLevelsForSubtopic(topic, subtopic)));
  return visibleSubs.length > 0 && isClassVisible(studentClass, topic.classLevels);
}

export function filterTopicsForClass(topics: Topic[], studentClass: string): Topic[] {
  return topics
    .filter((topic) => isTopicVisibleToClass(studentClass, topic))
    .map((topic) => ({
      ...topic,
      subtopics: topic.subtopics.filter((subtopic) => isClassVisible(studentClass, classLevelsForSubtopic(topic, subtopic))),
    }))
    .filter((topic) => topic.subtopics.length > 0);
}

export function filterSubjectForClass(subject: Subject, studentClass: string): Subject {
  return { ...subject, topics: filterTopicsForClass(subject.topics, studentClass) };
}

export function filterSubjectsForClass(subjects: Subject[], studentClass: string): Subject[] {
  return subjects
    .map((subject) => filterSubjectForClass(subject, studentClass))
    .filter((subject) => subject.topics.length > 0);
}
