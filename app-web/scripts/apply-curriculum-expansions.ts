#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { subjectSchema, type Subject } from "../lib/content/schema";
import { EXISTING_SUBJECT_EXPANSIONS, NEW_SUBJECTS } from "./curriculum-expansions";
import { SYLLABUS_GAPS } from "./syllabus-gaps";

const SUBJECTS_DIR = path.join(process.cwd(), "content/subjects");

function writeJson(file: string, value: unknown): void {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function applyExisting(): number {
  let added = 0;
  const merged: Record<string, { description?: string; topics: import("../lib/content/schema").Topic[] }> = {
    ...EXISTING_SUBJECT_EXPANSIONS,
  };
  for (const [dir, gap] of Object.entries(SYLLABUS_GAPS)) {
    merged[dir] = { ...merged[dir], topics: [...(merged[dir]?.topics ?? []), ...gap.topics] };
  }

  for (const [dir, expansion] of Object.entries(merged)) {
    const file = path.join(SUBJECTS_DIR, dir, "subject.json");
    if (!existsSync(file)) {
      throw new Error(`Missing existing subject: ${file}`);
    }
    const subject = subjectSchema.parse(JSON.parse(readFileSync(file, "utf8"))) as Subject;
    const existingIds = new Set(subject.topics.map((topic) => topic.id));
    const maxOrder = subject.topics.reduce((max, topic) => Math.max(max, topic.order), 0);
    const fresh = expansion.topics.filter((topic) => !existingIds.has(topic.id));
    if (fresh.length === 0 && !expansion.description) continue;

    fresh.forEach((topic, index) => {
      topic.order = maxOrder + index + 1;
    });
    subject.topics.push(...fresh);
    if (expansion.description) subject.description = expansion.description;

    const parsed = subjectSchema.parse(subject);
    writeJson(file, parsed);
    added += fresh.length;
    console.log(`updated ${dir}: +${fresh.length} topics (now ${parsed.topics.length})`);
  }
  return added;
}

function applyNew(): number {
  let created = 0;
  for (const draft of NEW_SUBJECTS) {
    const dir = path.join(SUBJECTS_DIR, draft.dir);
    mkdirSync(dir, { recursive: true });
    mkdirSync(path.join(dir, "topics"), { recursive: true });
    const file = path.join(dir, "subject.json");
    const parsed = subjectSchema.parse(draft.subject);
    writeJson(file, parsed);
    created += 1;
    console.log(`wrote ${draft.dir}: ${parsed.topics.length} topics, ${parsed.topics.reduce((n, t) => n + t.subtopics.length, 0)} subtopics`);
  }
  return created;
}

const addedTopics = applyExisting();
const createdSubjects = applyNew();
console.log(`apply-curriculum-expansions done — ${createdSubjects} new subjects, ${addedTopics} topics appended`);
