import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildContentIndex } from "./loader";
import { openContentDb, upsertDoc } from "./db";

const SRC = path.join(process.cwd(), "content", "subjects", "cve-hydraulics");
const rename = (text: string) => text.replaceAll("hydraulics", "hydraulicsdb");

let tmp: string;
const original = process.env.CONTENT_DB_PATH;

beforeAll(() => {
  tmp = mkdtempSync(path.join(os.tmpdir(), "content-db-"));
  const file = path.join(tmp, "content.db");
  const db = openContentDb(file, { create: true })!;
  const subject = JSON.parse(rename(readFileSync(path.join(SRC, "subject.json"), "utf-8")));
  upsertDoc(db, { kind: "subject", id: subject.id, subjectId: subject.id, data: subject });
  const topicsDir = path.join(SRC, "topics");
  for (const t of readdirSync(topicsDir)) {
    for (const f of readdirSync(path.join(topicsDir, t))) {
      const doc = JSON.parse(rename(readFileSync(path.join(topicsDir, t, f), "utf-8")));
      if (f.endsWith(".lesson.json")) upsertDoc(db, { kind: "lesson", id: doc.subtopicId, subjectId: subject.id, data: doc });
      else if (f.endsWith(".questions.json")) upsertDoc(db, { kind: "questions", id: `${doc.subtopicId}#${f}`, subjectId: subject.id, data: doc });
    }
  }
  // A corrupt row must surface as an error, not crash the index.
  upsertDoc(db, { kind: "lesson", id: "bad.row", subjectId: subject.id, data: { nope: true } });
  db.close();
  process.env.CONTENT_DB_PATH = file;
});

afterAll(() => {
  if (original === undefined) delete process.env.CONTENT_DB_PATH;
  else process.env.CONTENT_DB_PATH = original;
  rmSync(tmp, { recursive: true, force: true });
});

describe("database-backed content", () => {
  it("merges database subjects, lessons and questions into the index", () => {
    const index = buildContentIndex();
    const subject = [...index.subjectById.values()].find((s) => s.id.endsWith("hydraulicsdb"));
    expect(subject).toBeDefined();
    const subtopic = subject!.topics[0].subtopics[0];
    expect(index.lessonBySubtopicId.has(subtopic.id)).toBe(true);
    expect((index.questionsBySubtopicId.get(subtopic.id) ?? []).length).toBeGreaterThan(0);
  }, 30_000);

  it("reports invalid rows as errors without throwing", () => {
    const index = buildContentIndex();
    expect(index.errors.some((e) => e.file === "db:lesson:bad.row")).toBe(true);
  }, 30_000);

  it("keeps repo content when the database is absent", () => {
    process.env.CONTENT_DB_PATH = path.join(tmp, "missing.db");
    const index = buildContentIndex();
    expect([...index.subjectById.keys()].some((id) => id.endsWith("hydraulicsdb"))).toBe(false);
    expect(index.subjects.length).toBeGreaterThan(0);
    process.env.CONTENT_DB_PATH = path.join(tmp, "content.db");
  }, 30_000);
});
