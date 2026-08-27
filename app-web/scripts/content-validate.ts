#!/usr/bin/env tsx
import { validateContent } from "../lib/content/validate";

const enforceTiers = process.argv.includes("--tiers");
const result = validateContent({ enforceTiers });

if (result.issues.length === 0) {
  const subjects = result.index.subjects.length;
  const questions = result.index.questionById.size;
  const lessons = result.index.lessonBySubtopicId.size;
  console.log(`content:validate PASS — ${subjects} subjects, ${lessons} lessons, ${questions} questions`);
  process.exit(0);
}

const grouped = new Map<string, string[]>();
for (const issue of result.issues) {
  const key = `${issue.severity.toUpperCase()} ${issue.scope}`;
  grouped.set(key, [...(grouped.get(key) ?? []), issue.message]);
}

for (const [scope, messages] of grouped) {
  console.log(`\n${scope}`);
  for (const message of messages) console.log(`  - ${message}`);
}

console.log(`\ncontent:validate ${result.errorCount > 0 ? "FAIL" : "PASS with warnings"} — ${result.errorCount} errors, ${result.warningCount} warnings`);
process.exit(result.errorCount > 0 ? 1 : 0);
