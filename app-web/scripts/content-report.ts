#!/usr/bin/env tsx
import { buildContentIndex } from "../lib/content/loader";
import { TIER_REQUIREMENTS, getSubjectStatsFromIndex } from "../lib/content/validate";

const index = buildContentIndex();
const tierBySubject = new Map(TIER_REQUIREMENTS.map((r) => [r.subjectId, r]));

const rows = index.subjects.map((subject) => {
  const stats = getSubjectStatsFromIndex(index, subject.id);
  const requirement = tierBySubject.get(subject.id);
  const requiredLessons = requirement
    ? requirement.lessonRule === "per-subtopic"
      ? stats.subtopicCount
      : stats.topicCount
    : 0;

  const meets =
    !requirement ||
    (stats.topicCount >= requirement.minTopics &&
      stats.subtopicCount >= requirement.minSubtopics &&
      stats.lessonCount >= requiredLessons &&
      subject.topics
        .flatMap((t) => t.subtopics)
        .every((s) => (index.questionsBySubtopicId.get(s.id) ?? []).length >= requirement.minQuestionsPerSubtopic));

  return {
    Subject: subject.name,
    Id: subject.id,
    Tier: requirement?.tier ?? "-",
    Topics: stats.topicCount,
    Subtopics: stats.subtopicCount,
    Lessons: `${stats.lessonCount}/${requiredLessons || stats.subtopicCount}`,
    Questions: stats.questionCount,
    Status: meets ? "MEETS" : "BELOW",
  };
});

console.log("\nMindspark content coverage\n");
console.table(rows);

const missing = TIER_REQUIREMENTS.filter((r) => !index.subjectById.has(r.subjectId));
if (missing.length > 0) {
  console.log("Missing required subjects:");
  for (const requirement of missing) {
    console.log(`  - ${requirement.subjectId} (Tier ${requirement.tier})`);
  }
}

const gaps: string[] = [];
for (const subject of index.subjects) {
  for (const topic of subject.topics) {
    for (const subtopic of topic.subtopics) {
      const hasLesson = index.lessonBySubtopicId.has(subtopic.id);
      const questionCount = (index.questionsBySubtopicId.get(subtopic.id) ?? []).length;
      if (!hasLesson || questionCount === 0) {
        gaps.push(`${subtopic.id} — ${hasLesson ? "lesson ok" : "NO LESSON"}, ${questionCount} questions`);
      }
    }
  }
}

if (gaps.length > 0) {
  console.log(`\nSubtopics with gaps (${gaps.length}):`);
  for (const gap of gaps.slice(0, 60)) console.log(`  - ${gap}`);
  if (gaps.length > 60) console.log(`  … and ${gaps.length - 60} more`);
} else if (index.subjects.length > 0) {
  console.log("\nNo gaps: every subtopic has a lesson and at least one question.");
}

if (index.errors.length > 0) {
  console.log(`\nLoad errors (${index.errors.length}) — run content:validate for detail`);
}
