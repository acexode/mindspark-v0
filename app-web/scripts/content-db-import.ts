#!/usr/bin/env tsx
/**
 * Imports undergraduate content from repo JSON into the local SQLite database.
 *
 *   npm run content:db:import                 # copy only (repo JSON untouched)
 *   npm run content:db:import -- --move       # copy, then delete the imported JSON
 *   npm run content:db:import -- --only=cve-hydraulics,undergrad-cs
 *
 * Every file is validated before insertion; invalid files are reported and skipped.
 */
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { CONTENT_ROOT } from "../lib/content/loader";
import { openContentDb, upsertDoc, dbPath } from "../lib/content/db";
import { lessonSchema, programmeSchema, questionFileSchema, subjectSchema } from "../lib/content/schema";

const move = process.argv.includes("--move");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice(7).split(",")) : null;

const SUBJECTS_DIR = path.join(CONTENT_ROOT, "subjects");
const PROGRAMMES_DIR = path.join(CONTENT_ROOT, "programmes");

const db = openContentDb(dbPath(), { create: true });
if (!db) throw new Error("Could not open content database");

const readJson = (file: string): unknown => JSON.parse(readFileSync(file, "utf-8"));
let imported = 0;
const failures: string[] = [];
const importedDirs: string[] = [];

db.exec("BEGIN");
try {
  for (const dirName of readdirSync(SUBJECTS_DIR)) {
    const dir = path.join(SUBJECTS_DIR, dirName);
    if (!statSync(dir).isDirectory()) continue;
    if (only && !only.has(dirName)) continue;
    const subjectFile = path.join(dir, "subject.json");
    if (!existsSync(subjectFile)) continue;

    const subject = subjectSchema.safeParse(readJson(subjectFile));
    if (!subject.success) {
      failures.push(`${dirName}/subject.json`);
      continue;
    }
    if (subject.data.level !== "undergraduate") continue;

    const subjectId = subject.data.id;
    const rows: Array<Parameters<typeof upsertDoc>[1]> = [{ kind: "subject", id: subjectId, subjectId, data: subject.data }];
    let ok = true;

    const topicsDir = path.join(dir, "topics");
    if (existsSync(topicsDir)) {
      for (const topicDir of readdirSync(topicsDir)) {
        const tDir = path.join(topicsDir, topicDir);
        if (!statSync(tDir).isDirectory()) continue;
        for (const f of readdirSync(tDir)) {
          const file = path.join(tDir, f);
          if (f.endsWith(".lesson.json")) {
            const p = lessonSchema.safeParse(readJson(file));
            if (!p.success) { failures.push(path.relative(CONTENT_ROOT, file)); ok = false; continue; }
            rows.push({ kind: "lesson", id: p.data.subtopicId, subjectId, data: p.data });
          } else if (f.endsWith(".questions.json")) {
            const p = questionFileSchema.safeParse(readJson(file));
            if (!p.success) { failures.push(path.relative(CONTENT_ROOT, file)); ok = false; continue; }
            rows.push({ kind: "questions", id: `${p.data.subtopicId}#${f}`, subjectId, data: p.data });
          }
        }
      }
    }
    if (!ok) continue; // never import (or delete) a partially valid course
    for (const row of rows) upsertDoc(db, row);
    imported += rows.length;
    importedDirs.push(dir);
    console.log(`imported ${dirName}: ${rows.length} documents`);
  }

  // Programmes referenced by undergrad subjects.
  if (existsSync(PROGRAMMES_DIR) && !only) {
    for (const f of readdirSync(PROGRAMMES_DIR).filter((x) => x.endsWith(".json"))) {
      const p = programmeSchema.safeParse(readJson(path.join(PROGRAMMES_DIR, f)));
      if (p.success) upsertDoc(db, { kind: "programme", id: p.data.slug, data: p.data });
    }
  }
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
} finally {
  db.close();
}

if (failures.length) {
  console.error(`\nSkipped ${failures.length} invalid file(s):\n  ${failures.join("\n  ")}`);
}
if (move) {
  for (const dir of importedDirs) rmSync(dir, { recursive: true, force: true });
  console.log(`Removed ${importedDirs.length} imported subject directories from the repo.`);
}
console.log(`\n${imported} documents -> ${dbPath()}`);
process.exitCode = failures.length ? 1 : 0;
