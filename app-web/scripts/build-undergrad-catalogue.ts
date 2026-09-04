#!/usr/bin/env tsx
/**
 * Writes the undergraduate course catalogue — one subject.json per course —
 * from the declarative specs in scripts/lib/catalogue/.
 *
 * Safe to re-run: it only ever writes subject.json, never lessons or questions,
 * so regenerating the tree cannot destroy authored content.
 *
 *   npx tsx scripts/build-undergrad-catalogue.ts
 *   npx tsx scripts/build-undergrad-catalogue.ts --dry-run
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { subjectSchema } from "../lib/content/schema";
import { toSubject, type CourseSpec } from "./lib/undergrad-course";
import { CS_YEAR_1 } from "./lib/catalogue/cs-year1";
import { CS_YEAR_2 } from "./lib/catalogue/cs-year2";
import { CVE_YEAR_1 } from "./lib/catalogue/cve-year1";
import { CVE_YEAR_2 } from "./lib/catalogue/cve-year2";

const SUBJECTS_DIR = path.join(process.cwd(), "content/subjects");

const CATALOGUE: CourseSpec[] = [...CS_YEAR_1, ...CS_YEAR_2, ...CVE_YEAR_1, ...CVE_YEAR_2];

function main(): void {
  const dryRun = process.argv.includes("--dry-run");
  const seenSlugs = new Set<string>();
  const seenCodes = new Set<string>();
  let wrote = 0;
  let unchanged = 0;
  let failed = 0;

  for (const spec of CATALOGUE) {
    if (seenSlugs.has(spec.slug)) {
      console.error(`FAIL  duplicate course slug: ${spec.slug}`);
      failed += 1;
      continue;
    }
    if (seenCodes.has(spec.code)) {
      console.error(`FAIL  duplicate course code: ${spec.code}`);
      failed += 1;
      continue;
    }
    seenSlugs.add(spec.slug);
    seenCodes.add(spec.code);

    const parsed = subjectSchema.safeParse(toSubject(spec));
    if (!parsed.success) {
      failed += 1;
      console.error(`FAIL  ${spec.code} ${spec.slug}`);
      for (const issue of parsed.error.issues.slice(0, 5)) {
        console.error(`      ${issue.path.join(".") || "(root)"}: ${issue.message}`);
      }
      continue;
    }

    const units = parsed.data.topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
    const dir = path.join(SUBJECTS_DIR, spec.slug);
    const file = path.join(dir, "subject.json");
    const next = `${JSON.stringify(parsed.data, null, 2)}\n`;

    if (existsSync(file) && readFileSync(file, "utf8") === next) {
      unchanged += 1;
      console.log(`same  ${spec.code} ${spec.name} — ${parsed.data.topics.length} modules, ${units} units`);
      continue;
    }

    if (!dryRun) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(file, next);
    }
    wrote += 1;
    console.log(`${dryRun ? "would" : "wrote"} ${spec.code} ${spec.name} — ${parsed.data.topics.length} modules, ${units} units`);
  }

  const totalUnits = CATALOGUE.reduce(
    (sum, spec) => sum + spec.modules.reduce((inner, module) => inner + module.units.length, 0),
    0,
  );
  console.log(
    `\n${CATALOGUE.length} courses, ${totalUnits} units — wrote ${wrote}, unchanged ${unchanged}, failed ${failed}`,
  );
  if (failed > 0) process.exit(1);
}

main();
