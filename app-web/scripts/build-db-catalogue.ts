#!/usr/bin/env tsx
/**
 * Writes DB-resident undergraduate course trees (MBBS, Mechanical Engineering)
 * from the declarative specs in scripts/lib/catalogue/ into the local content
 * database. Only subject trees and programmes are written; lessons and
 * questions are generated separately and never touched here.
 *
 *   npx tsx scripts/build-db-catalogue.ts [--dry-run]
 */
import { openContentDb, upsertDoc, dbPath } from "../lib/content/db";
import { programmeSchema, subjectSchema } from "../lib/content/schema";
import { toSubject, type CourseSpec } from "./lib/undergrad-course";
import { DB_PROGRAMMES } from "./lib/catalogue/db-programmes";
import { MBBS_COURSES } from "./lib/catalogue/mbbs";
import { MCE_COURSES } from "./lib/catalogue/mce";

const CATALOGUE: CourseSpec[] = [...MBBS_COURSES, ...MCE_COURSES];
const dryRun = process.argv.includes("--dry-run");

const seenSlugs = new Set<string>();
const seenCodes = new Set<string>();
let failed = 0;
const subjects = [];

for (const spec of CATALOGUE) {
  if (seenSlugs.has(spec.slug) || seenCodes.has(spec.code)) {
    console.error(`FAIL  duplicate slug/code: ${spec.slug} ${spec.code}`);
    failed += 1;
    continue;
  }
  seenSlugs.add(spec.slug);
  seenCodes.add(spec.code);
  const parsed = subjectSchema.safeParse(toSubject(spec));
  if (!parsed.success) {
    failed += 1;
    console.error(`FAIL  ${spec.code} ${spec.slug}`);
    for (const issue of parsed.error.issues.slice(0, 5)) console.error(`      ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    continue;
  }
  subjects.push(parsed.data);
  const units = parsed.data.topics.reduce((n, t) => n + t.subtopics.length, 0);
  console.log(`ok    ${spec.code} ${spec.name} — ${parsed.data.topics.length} modules, ${units} units`);
}

for (const p of DB_PROGRAMMES) {
  if (!programmeSchema.safeParse(p).success) { console.error(`FAIL  programme ${p.slug}`); failed += 1; }
}

if (failed) process.exit(1);
if (!dryRun) {
  const db = openContentDb(dbPath(), { create: true })!;
  db.exec("BEGIN");
  try {
    for (const p of DB_PROGRAMMES) upsertDoc(db, { kind: "programme", id: p.slug, data: p });
    for (const s of subjects) upsertDoc(db, { kind: "subject", id: s.id, subjectId: s.id, data: s });
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  } finally {
    db.close();
  }
}
console.log(`\n${subjects.length} courses ${dryRun ? "validated" : `written to ${dbPath()}`}`);
