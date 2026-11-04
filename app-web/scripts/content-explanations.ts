#!/usr/bin/env tsx
/**
 * Replaces placeholder explanations ("The correct answer is X.") with ones that teach, and
 * double-checks the answer key while it is there.
 *
 * Each call covers one subtopic's questions. The model is told to work the problem out itself
 * before explaining, and to flag a key it disagrees with. Disagreements are written to
 * reports/explanation-review.json for a person to judge and are never applied automatically: a
 * model asked only to explain a key tends to justify it, even a wrong one.
 *
 * Only the `explanation` field is ever changed. Resumable — questions that already have a real
 * explanation, or are already in the review report, are skipped.
 *
 *   npx tsx scripts/content-explanations.ts --dry-run
 *   npx tsx scripts/content-explanations.ts                  # undergraduate (default)
 *   npx tsx scripts/content-explanations.ts --level all --limit 5
 *   npx tsx scripts/content-explanations.ts --subject cve-autocad-drafting
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { explanationProblem, isPlaceholderExplanation } from "../lib/content/explanations";
import { buildContentIndex } from "../lib/content/loader";
import { questionFileSchema, type Subject, type Subtopic, type Topic } from "../lib/content/schema";
import { argValue, chatJson, hasFlag, loadEnvLocal, mapPool } from "./lib/openai";

const SUBJECTS_DIR = path.join(process.cwd(), "content/subjects");
const REPORT_FILE = path.join(process.cwd(), "reports", "explanation-review.json");
const GENERATED_SOURCE_ID = "openai-curriculum-pack";
const ATTEMPTS = 3;

interface RawQuestion {
  id: string;
  type: string;
  stem: string;
  options?: Array<{ id: string; text: string }>;
  correctOptionId?: string;
  correctOptionIds?: string[];
  correctValue?: string | number;
  tolerance?: number;
  explanation: string;
  provenance?: { sources?: Array<{ id?: string }> };
}

interface Job {
  file: string;
  subject: Subject;
  topic: Topic;
  subtopic: Subtopic;
  questions: RawQuestion[];
}

interface Flag {
  id: string;
  subject: string;
  stem: string;
  keyedAnswer: string;
  concern: string;
  proposedExplanation: string;
  /** The independent re-check, so a person reads a verdict and workings rather than a bare accusation. */
  secondOpinion: string;
}

interface ModelItem {
  n?: number;
  keyAgrees?: boolean;
  concern?: string;
  explanation?: string;
}

/** What a good explanation is, shared by the repair prompt and the second-opinion prompt. */
const EXPLANATION_RULES = `Rules for every explanation:
- Do not begin with "The correct answer is" and do not merely restate the answer. Teach the reasoning.
- Never refer to an option by its letter or position, because options are shuffled. Refer to its content.
- Write maths in LaTeX between $ signs and escape backslashes for JSON. Never use a dollar sign for money; write the word instead.
- Be accurate. If a command, setting or fact is something you are not sure exists, say less rather than invent it.`;

const SYSTEM = `You write answer explanations for a university and school study app, and you double-check answer keys.

You are given questions, each with a KEYED correct answer. For every question:
1. Work the problem out yourself FIRST, then compare your result with the keyed answer.
2. If the keyed answer is correct, write an explanation of 2 to 3 sentences that teaches WHY it is correct, using the specific facts or numbers in the question. For multiple choice, also say briefly why the most tempting wrong option is wrong. For true/false, explain why the statement is true or false.
3. If you believe the keyed answer is wrong, or the question is ambiguous or flawed, set "keyAgrees" to false, describe the problem in "concern", and write the explanation you would give for the answer YOU believe is right.

${EXPLANATION_RULES}

Return ONE JSON object: {"items":[{"n":1,"keyAgrees":true,"concern":"","explanation":"..."}]} with exactly one item per question, using the question numbers given.`;

function keyedAnswer(q: RawQuestion): string {
  if (q.type === "multi_select") {
    return (q.correctOptionIds ?? []).map((id) => q.options?.find((o) => o.id === id)?.text ?? id).join("; ");
  }
  if (q.options?.length) return q.options.find((o) => o.id === q.correctOptionId)?.text ?? "(unknown)";
  const tolerance = q.type === "numeric" && q.tolerance ? ` (accepted within ±${q.tolerance})` : "";
  return `${q.correctValue ?? "(unknown)"}${tolerance}`;
}

function describeQuestion(q: RawQuestion, n: number, rejected?: string): string {
  const lines = [`### Question ${n} (${q.type})`, `Stem: ${q.stem}`];
  if (q.options?.length) lines.push("Options:", ...q.options.map((o) => `- ${o.text}`));
  lines.push(`Keyed answer: ${keyedAnswer(q)}`);
  if (rejected) lines.push(`Your previous explanation was rejected: ${rejected}. Write a better one.`);
  return lines.join("\n");
}

function userPrompt(job: Job, items: Array<{ q: RawQuestion; n: number; rejected?: string }>): string {
  const { subject, topic, subtopic } = job;
  return [
    `Course: ${subject.courseCode ? `${subject.courseCode} ` : ""}${subject.name} (${subject.level})`,
    `Module: ${topic.name}`,
    `Unit: ${subtopic.name}`,
    `Objectives:\n${subtopic.objectives.map((o) => `- ${o.text}`).join("\n")}`,
    "",
    ...items.map(({ q, n, rejected }) => describeQuestion(q, n, rejected)),
  ].join("\n");
}


const ADJUDICATE_SYSTEM = `You are a careful examiner settling a dispute about an answer key for a study app.

You are given a question, its KEYED answer, and a reviewer's claim that the key is wrong. Either the key or the reviewer may be mistaken, so do not defer to either: work the problem out step by step yourself in "workings" BEFORE deciding.

Verdict, exactly one of:
- "key correct": the keyed answer is right and the reviewer is mistaken.
- "key incorrect": the keyed answer is wrong.
- "ambiguous": the question is flawed, or more than one answer is defensible.

If and only if the verdict is "key correct", also write "explanation": 2 to 3 sentences teaching why the keyed answer is correct.

${EXPLANATION_RULES}

Return ONE JSON object: {"workings":"...","verdict":"...","explanation":"..."}`;

async function secondOpinion(job: Job, q: RawQuestion, concern: string, model: string): Promise<{ verdict: string; workings: string; explanation?: string }> {
  const prompt = [
    `Course: ${job.subject.courseCode ? `${job.subject.courseCode} ` : ""}${job.subject.name}`,
    `Unit: ${job.subtopic.name}`,
    "",
    describeQuestion(q, 1),
    `Reviewer's claim: ${concern || "(no reason given)"}`,
  ].join("\n");
  const reply = await chatJson<{ workings?: string; verdict?: string; explanation?: string }>(model, ADJUDICATE_SYSTEM, prompt, 1, {
    temperature: 0,
    maxTokens: 900,
  });
  return { verdict: String(reply.verdict ?? "").toLowerCase().trim(), workings: String(reply.workings ?? "").slice(0, 700), explanation: reply.explanation };
}

/** One model round for a job. Returns accepted explanations, flagged disagreements and what still needs work. */
async function repair(job: Job, model: string): Promise<{ fixed: Map<string, string>; flags: Flag[]; failed: number }> {
  const fixed = new Map<string, string>();
  const flags = new Map<string, Flag>();
  let pending = job.questions.map((q, index) => ({ q, n: index + 1, rejected: undefined as string | undefined }));

  for (let attempt = 1; attempt <= ATTEMPTS && pending.length > 0; attempt += 1) {
    const reply = await chatJson<{ items?: ModelItem[] }>(model, SYSTEM, userPrompt(job, pending), attempt, {
      temperature: 0.2,
      maxTokens: Math.min(4000, 300 + 190 * pending.length),
    });
    const items = Array.isArray(reply.items) ? reply.items : [];
    const next: typeof pending = [];

    for (const entry of pending) {
      const item = items.find((candidate) => candidate.n === entry.n);
      const problem = explanationProblem(item?.explanation);
      if (!item || problem) {
        next.push({ ...entry, rejected: item ? problem! : "no item returned for this question" });
        continue;
      }
      if (item.keyAgrees === false) {
        const concern = String(item.concern ?? "").slice(0, 600);
        const second = await secondOpinion(job, entry.q, concern, model);
        // The reviewer pass was wrong (it contradicted its own explanation as often as not): keep the key.
        if (second.verdict === "key correct" && !explanationProblem(second.explanation)) {
          fixed.set(entry.q.id, String(second.explanation).trim());
          continue;
        }
        flags.set(entry.q.id, {
          id: entry.q.id,
          subject: job.subject.id,
          stem: entry.q.stem,
          keyedAnswer: keyedAnswer(entry.q),
          concern,
          proposedExplanation: String(item.explanation).trim(),
          secondOpinion: `${second.verdict || "no verdict"}: ${second.workings}`,
        });
        continue;
      }
      fixed.set(entry.q.id, String(item.explanation).trim());
    }
    pending = next;
  }
  return { fixed, flags: [...flags.values()], failed: pending.length };
}

function loadReport(): Flag[] {
  try {
    return existsSync(REPORT_FILE) ? (JSON.parse(readFileSync(REPORT_FILE, "utf8")) as Flag[]) : [];
  } catch {
    return [];
  }
}

function collectJobs(level: string, only: string | undefined, skip: Set<string>): Job[] {
  const index = buildContentIndex();
  const dirs = readdirSync(SUBJECTS_DIR).filter((entry) => existsSync(path.join(SUBJECTS_DIR, entry, "subject.json")));
  const jobs: Job[] = [];

  for (const dir of dirs) {
    const id = (JSON.parse(readFileSync(path.join(SUBJECTS_DIR, dir, "subject.json"), "utf8")) as { id: string }).id;
    const subject = index.subjectById.get(id);
    if (!subject) continue;
    if (level !== "all" && subject.level !== level) continue;
    if (only && only !== dir && only !== subject.id) continue;

    for (const topic of subject.topics) {
      for (const subtopic of topic.subtopics) {
        const file = path.join(SUBJECTS_DIR, dir, "topics", topic.id.split(".").pop()!, `${subtopic.id.split(".").pop()}.questions.json`);
        if (!existsSync(file)) continue;
        const data = JSON.parse(readFileSync(file, "utf8")) as { questions: RawQuestion[] };
        const questions = data.questions.filter(
          (q) =>
            isPlaceholderExplanation(q.explanation) &&
            !skip.has(q.id) &&
            // Never touch hand-authored content.
            q.provenance?.sources?.some((source) => source.id === GENERATED_SOURCE_ID),
        );
        if (questions.length > 0) jobs.push({ file, subject, topic, subtopic, questions });
      }
    }
  }
  return jobs;
}

async function main(): Promise<void> {
  loadEnvLocal();
  const level = argValue("--level") ?? "undergraduate";
  const only = argValue("--subject");
  const limit = Number(argValue("--limit") ?? "0");
  const dryRun = hasFlag("--dry-run");
  const concurrency = Number(process.env.CONTENT_GENERATE_CONCURRENCY ?? "3");
  const model = process.env.OPENAI_CONTENT_MODEL_STRICT ?? "gpt-4o";

  const previous = loadReport();
  const allJobs = collectJobs(level, only, hasFlag("--retry-flagged") ? new Set() : new Set(previous.map((flag) => flag.id)));
  const jobs = limit > 0 ? allJobs.slice(0, limit) : allJobs;
  const total = allJobs.reduce((sum, job) => sum + job.questions.length, 0);

  console.log(`${total} placeholder explanations in ${allJobs.length} files (${level}); processing ${jobs.length} with ${model}, concurrency ${concurrency}`);
  if (dryRun || jobs.length === 0) return;

  let fixedCount = 0;
  let failedCount = 0;
  const retrying = hasFlag("--retry-flagged");
  const flags: Flag[] = retrying ? [] : [...previous];

  await mapPool(jobs, concurrency, async (job, position) => {
    const label = `${position + 1}/${jobs.length} ${job.subtopic.id}`;
    try {
      const result = await repair(job, model);
      if (result.fixed.size > 0) {
        const data = JSON.parse(readFileSync(job.file, "utf8")) as { questions: RawQuestion[] };
        for (const question of data.questions) {
          const text = result.fixed.get(question.id);
          if (text) question.explanation = text;
        }
        const parsed = questionFileSchema.safeParse(data);
        if (!parsed.success) throw new Error(`schema check failed after repair: ${parsed.error.issues[0]?.message}`);
        writeFileSync(job.file, `${JSON.stringify(data, null, 2)}\n`);
      }
      fixedCount += result.fixed.size;
      failedCount += result.failed;
      flags.push(...result.flags);
      console.log(`done   ${label} — fixed ${result.fixed.size}, flagged ${result.flags.length}, unresolved ${result.failed}`);
    } catch (error) {
      failedCount += job.questions.length;
      console.error(`FAIL   ${label}\n       ${error instanceof Error ? error.message : error}`);
    }
  });

  mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  writeFileSync(REPORT_FILE, `${JSON.stringify(flags, null, 2)}\n`);
  console.log(`\nfixed ${fixedCount}, flagged for review ${flags.length} (report: ${path.relative(process.cwd(), REPORT_FILE)}), unresolved ${failedCount}`);
  if (failedCount > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
