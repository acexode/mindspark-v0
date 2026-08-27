#!/usr/bin/env tsx
import { writeFileSync } from "node:fs";
import path from "node:path";
import { CONTENT_ROOT, buildContentIndex, idSlug } from "../lib/content/loader";
import { getSubjectStatsFromIndex } from "../lib/content/validate";

const index = buildContentIndex();

const manifest = {
  generatedAt: new Date().toISOString(),
  subjects: index.subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    level: subject.level,
    slug: idSlug(subject.id),
    accentColor: subject.accentColor,
    icon: subject.icon,
    stats: getSubjectStatsFromIndex(index, subject.id),
    topics: subject.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      slug: idSlug(topic.id),
      subtopics: topic.subtopics.map((subtopic) => ({
        id: subtopic.id,
        name: subtopic.name,
        slug: idSlug(subtopic.id),
        hasLesson: index.lessonBySubtopicId.has(subtopic.id),
        questionCount: (index.questionsBySubtopicId.get(subtopic.id) ?? []).length,
      })),
    })),
  })),
  totals: {
    subjects: index.subjects.length,
    lessons: index.lessonBySubtopicId.size,
    questions: index.questionById.size,
  },
};

const outFile = path.join(CONTENT_ROOT, "index.generated.json");
writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `content:index wrote ${path.relative(process.cwd(), outFile)} — ${manifest.totals.subjects} subjects, ${manifest.totals.lessons} lessons, ${manifest.totals.questions} questions`,
);
