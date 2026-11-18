import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import {
  lessonSchema,
  programmeSchema,
  questionFileSchema,
  subjectSchema,
  type EducationLevel,
  type Lesson,
  type Programme,
  type Question,
  type Subject,
  type Subtopic,
  type Topic,
} from "./schema";
import { listDocs, openContentDb, type DocRow } from "./db";

export const CONTENT_ROOT = path.join(process.cwd(), "content");
const SUBJECTS_DIR = path.join(CONTENT_ROOT, "subjects");
const PROGRAMMES_DIR = path.join(CONTENT_ROOT, "programmes");

export interface ContentIndex {
  subjects: Subject[];
  subjectById: Map<string, Subject>;
  topicById: Map<string, { topic: Topic; subject: Subject }>;
  subtopicById: Map<string, { subtopic: Subtopic; topic: Topic; subject: Subject }>;
  lessonBySubtopicId: Map<string, Lesson>;
  questionsBySubtopicId: Map<string, Question[]>;
  questionById: Map<string, Question>;
  programmes: Programme[];
  programmeBySlug: Map<string, Programme>;
  errors: ContentError[];
}

export interface ContentError {
  file: string;
  message: string;
}

let cached: ContentIndex | null = null;
let cachedAt = 0;
/** In development, reuse the index briefly so a page load does not re-parse every JSON file on each lookup. */
const DEV_CACHE_MS = 2_000;

function listDirs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((entry) => statSync(path.join(dir, entry)).isDirectory());
}

function listFiles(dir: string, suffix: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((entry) => entry.endsWith(suffix))
    .map((entry) => path.join(dir, entry));
}

function relative(file: string): string {
  return path.relative(CONTENT_ROOT, file);
}

/**
 * Reads every subject package from disk and builds the lookup index.
 * Invalid files are collected as errors rather than thrown so that one bad
 * file from a content agent cannot take the whole app down in development.
 */
export function buildContentIndex(): ContentIndex {
  const index: ContentIndex = {
    subjects: [],
    subjectById: new Map(),
    topicById: new Map(),
    subtopicById: new Map(),
    lessonBySubtopicId: new Map(),
    questionsBySubtopicId: new Map(),
    questionById: new Map(),
    programmes: [],
    programmeBySlug: new Map(),
    errors: [],
  };

  for (const file of listFiles(PROGRAMMES_DIR, ".json")) {
    const parsed = programmeSchema.safeParse(readJson(file, index));
    if (!parsed.success) {
      index.errors.push({ file: relative(file), message: formatZod(parsed.error) });
      continue;
    }
    index.programmes.push(parsed.data);
    index.programmeBySlug.set(parsed.data.slug, parsed.data);
  }

  for (const subjectDir of listDirs(SUBJECTS_DIR)) {
    const dir = path.join(SUBJECTS_DIR, subjectDir);
    const subjectFile = path.join(dir, "subject.json");

    if (!existsSync(subjectFile)) {
      index.errors.push({ file: relative(dir), message: "Missing subject.json" });
      continue;
    }

    const parsedSubject = subjectSchema.safeParse(readJson(subjectFile, index));
    if (!parsedSubject.success) {
      index.errors.push({ file: relative(subjectFile), message: formatZod(parsedSubject.error) });
      continue;
    }

    const subject = parsedSubject.data;
    registerSubject(index, subject);

    const topicsDir = path.join(dir, "topics");
    for (const topicDir of listDirs(topicsDir)) {
      const tDir = path.join(topicsDir, topicDir);

      for (const file of listFiles(tDir, ".lesson.json")) {
        const parsed = lessonSchema.safeParse(readJson(file, index));
        if (!parsed.success) {
          index.errors.push({ file: relative(file), message: formatZod(parsed.error) });
          continue;
        }
        index.lessonBySubtopicId.set(parsed.data.subtopicId, parsed.data);
      }

      for (const file of listFiles(tDir, ".questions.json")) {
        const parsed = questionFileSchema.safeParse(readJson(file, index));
        if (!parsed.success) {
          index.errors.push({ file: relative(file), message: formatZod(parsed.error) });
          continue;
        }
        const existing = index.questionsBySubtopicId.get(parsed.data.subtopicId) ?? [];
        const merged = [...existing, ...parsed.data.questions];
        index.questionsBySubtopicId.set(parsed.data.subtopicId, merged);
        for (const question of parsed.data.questions) {
          index.questionById.set(question.id, question);
        }
      }
    }
  }

  loadFromDatabase(index);

  index.subjects.sort((a, b) => a.name.localeCompare(b.name));
  return index;
}

/** The database review_status is authoritative: human_verified rows are shown as verified (no draft label). */
function applyHumanVerified(doc: unknown): void {
  const mark = (node: unknown) => {
    const provenance = (node as { provenance?: { verified: boolean } } | null)?.provenance;
    if (provenance) provenance.verified = true;
  };
  mark(doc);
  const questions = (doc as { questions?: unknown[] } | null)?.questions;
  if (Array.isArray(questions)) questions.forEach(mark);
}

function registerSubject(index: ContentIndex, subject: Subject): void {
  index.subjects.push(subject);
  index.subjectById.set(subject.id, subject);
  for (const topic of subject.topics) {
    index.topicById.set(topic.id, { topic, subject });
    for (const subtopic of topic.subtopics) {
      index.subtopicById.set(subtopic.id, { subtopic, topic, subject });
    }
  }
}

/**
 * Merges undergraduate content from the local SQLite database, if one exists.
 * Repo JSON wins on ID collisions so secondary content can never be shadowed.
 * Every row is re-validated against the same Zod schemas as disk content.
 */
function loadFromDatabase(index: ContentIndex): void {
  let db;
  try {
    db = openContentDb();
  } catch (error) {
    index.errors.push({ file: "content.db", message: `Cannot open content database: ${(error as Error).message}` });
    return;
  }
  if (!db) return;

  try {
    const parse = <T>(row: DocRow, schema: { safeParse(v: unknown): { success: true; data: T } | { success: false; error: { issues: Array<{ path: (string | number)[]; message: string }> } } }): T | null => {
      let raw: unknown;
      try {
        raw = JSON.parse(row.json);
      } catch (error) {
        index.errors.push({ file: `db:${row.kind}:${row.id}`, message: `Invalid JSON: ${(error as Error).message}` });
        return null;
      }
      const result = schema.safeParse(raw);
      if (!result.success) {
        index.errors.push({ file: `db:${row.kind}:${row.id}`, message: formatZod(result.error) });
        return null;
      }
      if (row.reviewStatus === "human_verified") applyHumanVerified(result.data);
      return result.data;
    };

    for (const row of listDocs(db, "programme")) {
      const programme = parse<Programme>(row, programmeSchema);
      if (programme && !index.programmeBySlug.has(programme.slug)) {
        index.programmes.push(programme);
        index.programmeBySlug.set(programme.slug, programme);
      }
    }
    for (const row of listDocs(db, "subject")) {
      const subject = parse<Subject>(row, subjectSchema);
      if (subject && !index.subjectById.has(subject.id)) registerSubject(index, subject);
    }
    for (const row of listDocs(db, "lesson")) {
      const lesson = parse<Lesson>(row, lessonSchema);
      if (lesson && !index.lessonBySubtopicId.has(lesson.subtopicId)) index.lessonBySubtopicId.set(lesson.subtopicId, lesson);
    }
    for (const row of listDocs(db, "questions")) {
      const file = parse<{ subtopicId: string; questions: Question[] }>(row, questionFileSchema);
      if (!file) continue;
      const existing = index.questionsBySubtopicId.get(file.subtopicId) ?? [];
      index.questionsBySubtopicId.set(file.subtopicId, [...existing, ...file.questions]);
      for (const q of file.questions) index.questionById.set(q.id, q);
    }
  } finally {
    db.close();
  }
}

function readJson(file: string, index: ContentIndex): unknown {
  try {
    return JSON.parse(readFileSync(file, "utf-8"));
  } catch (error) {
    index.errors.push({ file: relative(file), message: `Invalid JSON: ${(error as Error).message}` });
    return null;
  }
}

function formatZod(error: { issues: Array<{ path: (string | number)[]; message: string }> }): string {
  return error.issues.map((i) => `${i.path.join(".") || "root"}: ${i.message}`).join("; ");
}

export function getContentIndex(): ContentIndex {
  if (cached) {
    if (process.env.NODE_ENV !== "development") return cached;
    if (Date.now() - cachedAt < DEV_CACHE_MS) return cached;
  }
  cached = buildContentIndex();
  cachedAt = Date.now();
  return cached;
}

export function clearContentCache(): void {
  cached = null;
  cachedAt = 0;
}

/* ------------------------------------------------------------------ queries */

export function getSubjects(level?: EducationLevel): Subject[] {
  const { subjects } = getContentIndex();
  return level ? subjects.filter((s) => s.level === level) : subjects;
}

export function getSubject(id: string): Subject | null {
  return getContentIndex().subjectById.get(id) ?? null;
}

export function getTopic(id: string): { topic: Topic; subject: Subject } | null {
  return getContentIndex().topicById.get(id) ?? null;
}

export function getSubtopic(id: string): { subtopic: Subtopic; topic: Topic; subject: Subject } | null {
  return getContentIndex().subtopicById.get(id) ?? null;
}

export function getLesson(subtopicId: string): Lesson | null {
  return getContentIndex().lessonBySubtopicId.get(subtopicId) ?? null;
}

export function getQuestions(subtopicId: string): Question[] {
  return getContentIndex().questionsBySubtopicId.get(subtopicId) ?? [];
}

export function getQuestionsForTopic(topicId: string): Question[] {
  const entry = getTopic(topicId);
  if (!entry) return [];
  return entry.topic.subtopics.flatMap((s) => getQuestions(s.id));
}

export function getQuestionsForSubject(subjectId: string): Question[] {
  const subject = getSubject(subjectId);
  if (!subject) return [];
  return subject.topics.flatMap((t) => t.subtopics.flatMap((s) => getQuestions(s.id)));
}

export function getQuestionById(id: string): Question | null {
  return getContentIndex().questionById.get(id) ?? null;
}

/** Resolves a URL slug (last ID segment) to a full entity within its parent scope. */
export function resolveSubjectSlug(slug: string, level?: EducationLevel): Subject | null {
  return getSubjects(level).find((s) => idSlug(s.id) === slug) ?? null;
}

export function resolveTopicSlug(subject: Subject, slug: string): Topic | null {
  return subject.topics.find((t) => idSlug(t.id) === slug) ?? null;
}

export function resolveSubtopicSlug(topic: Topic, slug: string): Subtopic | null {
  return topic.subtopics.find((s) => idSlug(s.id) === slug) ?? null;
}

export function idSlug(id: string): string {
  return id.split(".").pop() ?? id;
}

export function getProgrammes(): Programme[] {
  return getContentIndex().programmes;
}

export function getProgramme(slug: string): Programme | null {
  return getContentIndex().programmeBySlug.get(slug) ?? null;
}

/** Undergraduate courses (subjects) belonging to a programme, optionally narrowed to a year and/or semester. */
export function getCoursesForProgramme(
  slug: string,
  opts: { classLevel?: string; semester?: 1 | 2 } = {},
): Subject[] {
  return getSubjects("undergraduate").filter((subject) => {
    if (!subject.programmes?.includes(slug)) return false;
    if (opts.classLevel && !subject.classLevels.includes(opts.classLevel as Subject["classLevels"][number])) return false;
    if (opts.semester && subject.semester !== opts.semester) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ summary */

export interface SubjectStats {
  topicCount: number;
  subtopicCount: number;
  lessonCount: number;
  questionCount: number;
}

export function getSubjectStats(subject: Subject): SubjectStats {
  const subtopics = subject.topics.flatMap((t) => t.subtopics);
  return {
    topicCount: subject.topics.length,
    subtopicCount: subtopics.length,
    lessonCount: subtopics.filter((s) => getLesson(s.id)).length,
    questionCount: subtopics.reduce((sum, s) => sum + getQuestions(s.id).length, 0),
  };
}
