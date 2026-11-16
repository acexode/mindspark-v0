#!/usr/bin/env tsx
/**
 * Review workflow for database-resident courses.
 *
 *   npm run content:review -- status                       # review state of every DB course
 *   npm run content:review -- export <subject> [--out dir] # write one review packet per module
 *   npm run content:review -- apply <verdict.json>         # record a reviewer's verdict
 *
 * The reviewer itself is the `content-reviewer` agent (.claude/agents). It reads
 * packets, checks facts and answer keys, and writes a verdict file this script
 * validates and stores. "ai_reviewed" is never "human_verified".
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { buildContentIndex, idSlug } from "../lib/content/loader";
import { dbPath, openContentDb, setReviewStatus, type ReviewStatus } from "../lib/content/db";
import type { Question, Subject } from "../lib/content/schema";

const issueSchema = z.object({
  subtopicId: z.string().min(5),
  questionId: z.string().optional(),
  severity: z.enum(["critical", "major", "minor"]),
  category: z.enum(["factual", "answer-key", "explanation", "level", "safety", "clarity", "consistency"]),
  problem: z.string().min(10),
  suggestedFix: z.string().min(5),
});

export const verdictSchema = z.object({
  subjectId: z.string().regex(/^ug\.[a-z0-9-]+$/),
  reviewer: z.string().min(2),
  unitsReviewed: z.number().int().min(0),
  summary: z.string().min(10),
  issues: z.array(issueSchema),
});

const [command, ...rest] = process.argv.slice(2);

function dbSubjects(): Subject[] {
  const index = buildContentIndex();
  const db = openContentDb();
  if (!db) return [];
  const ids = new Set(
    (db.prepare("SELECT id FROM documents WHERE kind = 'subject'").all() as Array<{ id: string }>).map((r) => r.id),
  );
  db.close();
  return index.subjects.filter((s) => ids.has(s.id));
}

function resolve(arg: string): Subject {
  const subject = dbSubjects().find((s) => s.id === arg || idSlug(s.id) === arg || s.id === `ug.${arg}`);
  if (!subject) throw new Error(`No database course matches "${arg}"`);
  return subject;
}

function statusCommand(): void {
  const index = buildContentIndex();
  const db = openContentDb();
  if (!db) return console.log(`No database at ${dbPath()}`);
  const rows = db
    .prepare("SELECT id, review_status, review_notes FROM documents WHERE kind = 'subject' ORDER BY id")
    .all() as Array<{ id: string; review_status: string; review_notes: string | null }>;
  db.close();
  for (const row of rows) {
    const subject = index.subjectById.get(row.id);
    const units = subject?.topics.flatMap((t) => t.subtopics) ?? [];
    const withContent = units.filter((u) => index.lessonBySubtopicId.has(u.id)).length;
    let issues = "";
    if (row.review_notes) {
      try {
        issues = ` issues:${(JSON.parse(row.review_notes) as { issues: unknown[] }).issues.length}`;
      } catch {
        /* notes are free text */
      }
    }
    console.log(`${row.review_status.padEnd(14)} ${row.id.padEnd(52)} content ${withContent}/${units.length}${issues}`);
  }
}

function formatQuestion(q: Question): string {
  const lines = [`#### ${q.id} (${q.type}, difficulty ${q.difficulty})`, q.stem];
  if ("options" in q && Array.isArray(q.options)) {
    for (const o of q.options) lines.push(`- ${o.id}) ${o.text}${"correctOptionId" in q && q.correctOptionId === o.id ? "   <-- KEY" : ""}`);
  }
  const rec = q as unknown as Record<string, unknown>;
  if (rec.correctValue !== undefined) lines.push(`KEY: ${String(rec.correctValue)} (tolerance ${String(rec.tolerance)}) ${String(rec.unit ?? "")}`);
  if (rec.correctAnswer !== undefined) lines.push(`KEY: ${String(rec.correctAnswer)}`);
  if (Array.isArray(rec.markingGuide)) lines.push(`MARKING GUIDE: ${(rec.markingGuide as string[]).join(" | ")}`);
  lines.push(`EXPLANATION: ${String(rec.explanation ?? "")}`);
  return lines.join("\n");
}

function exportCommand(arg: string, outDir: string): void {
  const subject = resolve(arg);
  const index = buildContentIndex();
  const dir = path.join(outDir, idSlug(subject.id));
  mkdirSync(dir, { recursive: true });
  let packets = 0;
  for (const topic of subject.topics) {
    const parts = [
      `# Review packet: ${subject.name} / ${topic.name}`,
      `Subject: ${subject.id}   Year: ${topic.classLevels.join(", ")}`,
      `Module: ${topic.id}`,
      "",
    ];
    for (const unit of topic.subtopics) {
      parts.push(`## Unit ${unit.id}: ${unit.name}`, `Objectives:`);
      for (const o of unit.objectives) parts.push(`- ${o.text}`);
      const lesson = index.lessonBySubtopicId.get(unit.id);
      if (!lesson) {
        parts.push("(no lesson generated)", "");
        continue;
      }
      parts.push("", "### Lesson", "```json", JSON.stringify(lesson.blocks, null, 1), "```", "", "### Questions");
      for (const q of index.questionsBySubtopicId.get(unit.id) ?? []) parts.push(formatQuestion(q), "");
    }
    writeFileSync(path.join(dir, `${idSlug(topic.id)}.md`), parts.join("\n"));
    packets += 1;
  }
  console.log(`${packets} packets -> ${dir}`);
}

function applyCommand(file: string): void {
  const parsed = verdictSchema.safeParse(JSON.parse(readFileSync(file, "utf8")));
  if (!parsed.success) {
    console.error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n"));
    process.exit(1);
  }
  const verdict = parsed.data;
  const subject = resolve(verdict.subjectId);
  const known = new Set(subject.topics.flatMap((t) => t.subtopics.map((s) => s.id)));
  const unknown = verdict.issues.filter((i) => !known.has(i.subtopicId));
  if (unknown.length) {
    console.error(`Issues reference unknown units:\n${unknown.map((i) => i.subtopicId).join("\n")}`);
    process.exit(1);
  }
  const blocking = verdict.issues.some((i) => i.severity === "critical" || i.severity === "major");
  const status: ReviewStatus = blocking ? "needs_changes" : "ai_reviewed";
  const db = openContentDb();
  if (!db) throw new Error("No content database");
  setReviewStatus(db, subject.id, status, JSON.stringify({ ...verdict, reviewedAt: new Date().toISOString() }));
  db.close();
  console.log(`${subject.id}: ${status} (${verdict.issues.length} issues, ${verdict.unitsReviewed} units reviewed)`);
}

switch (command) {
  case "status":
    statusCommand();
    break;
  case "export": {
    if (!rest[0]) throw new Error("usage: export <subject> [--out dir]");
    const outFlag = rest.indexOf("--out");
    const out = outFlag >= 0 ? rest[outFlag + 1]! : path.join(process.cwd(), "data", "review");
    if (!existsSync(path.dirname(out))) mkdirSync(path.dirname(out), { recursive: true });
    exportCommand(rest[0], out);
    break;
  }
  case "apply":
    if (!rest[0]) throw new Error("usage: apply <verdict.json>");
    applyCommand(rest[0]);
    break;
  default:
    console.error("usage: content-review.ts status | export <subject> [--out dir] | apply <verdict.json>");
    process.exit(1);
}
