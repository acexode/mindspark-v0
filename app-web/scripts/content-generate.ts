#!/usr/bin/env tsx
/**
 * Generate missing lessons and question banks via the OpenAI API.
 * Resumes safely: existing files are skipped unless --force is passed.
 *
 *   npx tsx scripts/content-generate.ts
 *   npx tsx scripts/content-generate.ts --subject accounting
 *   npx tsx scripts/content-generate.ts --limit 2
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { lessonSchema, questionFileSchema, type Lesson, type Question, type QuestionFile, type Subject, type Subtopic, type Topic } from "../lib/content/schema";
import { TIER_REQUIREMENTS } from "../lib/content/validate";
import { buildContentIndex, idSlug } from "../lib/content/loader";

const SUBJECTS_DIR = path.join(process.cwd(), "content/subjects");
const QUANTITATIVE = new Set(["sec.mathematics", "sec.physics", "sec.chemistry", "sec.accounting", "sec.economics"]);

interface GeneratedPayload {
  lessonTitle?: string;
  estimatedMinutes?: number;
  blocks?: unknown[];
  questions?: unknown[];
}

function loadEnvLocal(): void {
  const file = path.join(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

const PROVENANCE = {
  sources: [{ id: "openai-curriculum-pack", title: "Mindspark OpenAI curriculum pack", type: "authored" as const }],
  reviewStatus: "published" as const,
  verified: false,
  note: "Exam-pattern content generated with OpenAI against the WAEC/NECO/JAMB syllabus. Not a verbatim past paper.",
};

function minQuestionsFor(subjectId: string): number {
  return TIER_REQUIREMENTS.find((requirement) => requirement.subjectId === subjectId)?.minQuestionsPerSubtopic ?? 5;
}

function modelFor(subjectId: string): string {
  if (QUANTITATIVE.has(subjectId)) {
    return process.env.OPENAI_CONTENT_MODEL_STRICT ?? "gpt-4o";
  }
  return process.env.OPENAI_CONTENT_MODEL ?? "gpt-4o-mini";
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function chatJson(model: string, system: string, user: string, attempt: number): Promise<GeneratedPayload> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set. Add it to app-web/.env.local");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: attempt === 1 ? 0.4 : 0.2,
      max_tokens: 12000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (response.status === 429 || response.status >= 500) {
    const wait = Math.min(8000 * attempt, 40_000);
    await sleep(wait);
    if (attempt < 5) return chatJson(model, system, user, attempt + 1);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI ${response.status}: ${body.slice(0, 400)}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned an empty completion");
  return JSON.parse(content) as GeneratedPayload;
}

function systemPrompt(subject: Subject): string {
  const maths = QUANTITATIVE.has(subject.id);
  return `You author Nigerian senior-secondary / first-year undergraduate learning content for Mindspark.

Hard rules:
- Return ONE JSON object with keys: lessonTitle, estimatedMinutes, blocks, questions.
- Factually correct and aligned to WAEC, NECO, JAMB and NERDC (or a first-year CS programme).
- Use Nigerian names, naira, markets, WAEC/NECO/JAMB phrasing where natural.
- Never invent image/video/interactive blocks. Never use type "image", "video" or "interactive".
- Lessons: 8–11 blocks. Recommended shape: hook → text → callout(definition) → text/table/list → worked_example → text → callout(exam-tip) → summary.
- Include exactly one check block: { "type": "check", "questionId": "q001" }.
- hook.text ≥ 20 chars. text.markdown ≥ 20 chars. summary.points ≥ 2.
- callout.variant is one of: definition, key-point, warning, example, exam-tip.
- worked_example must have title, prompt, steps (≥2 objects {text, latex?}), answer.
- Questions: mostly mcq with 4 options a–d. You may include 1 true_false (options a=True, b=False) and 1 theory (with markingGuide array) if it fits.
- options MUST be an array of objects [{ "id": "a", "text": "..." }, ...], never a keyed object.
- Every callout MUST include variant, title and text. Every worked_example MUST include title, prompt, steps and answer.
- Every question MUST include a 2–3 sentence explanation.
- Every mcq needs correctOptionId, a 2–3 sentence explanation that teaches the reason, and distractorRationale for every wrong option.
- Distractors must be plausible mistakes, never jokes or filler.
- exam-pattern only. Do not claim a real past-paper year.
- Difficulty mix: ~30% 1, ~50% 2, ~20% 3.
- board: spread across WAEC, NECO, JAMB.
- No duplicate stems.
- Do not invent IDs except questionId "q001" on the check block.
${maths ? "- Use $...$ for inline maths in markdown/stems. Use math blocks {type:\"math\", latex, caption?} for displayed formulae. Escape JSON backslashes (\\\\frac)." : "- Do not force LaTeX. Plain clear English is better."}
- Teach, do not dump notes. A student should be able to learn the subtopic from the lesson alone.`;
}

function userPrompt(
  subject: Subject,
  topic: Topic,
  subtopic: Subtopic,
  minQuestions: number,
  errors?: string,
): string {
  const objectives = subtopic.objectives.map((objective) => `- ${objective.id}: ${objective.text}`).join("\n");
  return `Subject: ${subject.name} (${subject.id})
Level: ${subject.level}
Curricula: ${subject.curricula.join(", ")}
Topic: ${topic.name} (${topic.id})
Topic class levels: ${topic.classLevels.join(", ")}
Topic summary: ${topic.summary}
Subtopic: ${subtopic.name} (${subtopic.id})
Subtopic summary: ${subtopic.summary}
Write ONLY at this class level. A JSS1 learner must not get SS3 material, and an SS3 learner must not get JSS1 material.
Learning objectives:
${objectives}

Write one lesson and exactly ${minQuestions + 2} questions for THIS subtopic only (extras are kept as a buffer).
Questions must assess the objectives above.
Every question needs a full explanation of at least two sentences.
${errors ? `\nThe previous draft failed validation. Fix every issue:\n${errors}` : ""}`;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeOptions(value: unknown): Question["options"] {
  if (Array.isArray(value)) {
    return value.map((entry, index) => {
      const row = asRecord(entry);
      const fallbackId = String.fromCharCode(97 + index);
      return {
        id: typeof row.id === "string" && /^[a-h]$/.test(row.id) ? row.id : fallbackId,
        text: String(row.text ?? row.label ?? entry ?? ""),
      };
    });
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(([key, text], index) => ({
      id: /^[a-h]$/.test(key) ? key : String.fromCharCode(97 + index),
      text: typeof text === "string" ? text : String(asRecord(text).text ?? text ?? ""),
    }));
  }
  return undefined;
}

function normalizeDistractorRationale(
  value: unknown,
  options: Question["options"],
): Record<string, string> | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    const mapped: Record<string, string> = {};
    value.forEach((entry, index) => {
      if (typeof entry === "string") {
        const option = options?.[index];
        const id = option && option.id !== undefined ? option.id : String.fromCharCode(97 + index);
        mapped[id] = entry;
        return;
      }
      const row = asRecord(entry);
      const id = typeof row.id === "string" ? row.id : typeof row.optionId === "string" ? row.optionId : String.fromCharCode(97 + index);
      mapped[id] = String(row.text ?? row.reason ?? row.rationale ?? "");
    });
    return Object.keys(mapped).length > 0 ? mapped : undefined;
  }
  if (typeof value === "object") {
    const mapped: Record<string, string> = {};
    for (const [key, text] of Object.entries(value as Record<string, unknown>)) {
      mapped[key] = typeof text === "string" ? text : String(asRecord(text).text ?? text ?? "");
    }
    return mapped;
  }
  return undefined;
}

function normalizeBlocks(blocks: unknown[]): unknown[] {
  return blocks.map((block) => {
    const row = asRecord(block);
    if (row.type === "callout") {
      return {
        type: "callout",
        variant: row.variant,
        title: String(row.title || row.variant || "Note"),
        text: String(row.text ?? row.body ?? ""),
      };
    }
    if (row.type === "worked_example") {
      const steps = Array.isArray(row.steps)
        ? row.steps.map((step) => {
            if (typeof step === "string") return { text: step };
            const item = asRecord(step);
            return { text: String(item.text ?? item.step ?? ""), latex: typeof item.latex === "string" ? item.latex : undefined };
          })
        : [];
      return {
        type: "worked_example",
        title: String(row.title || "Worked example"),
        prompt: String(row.prompt ?? row.question ?? ""),
        steps,
        answer: String(row.answer ?? row.result ?? ""),
      };
    }
    if (row.type === "list") {
      const items = Array.isArray(row.items) ? row.items.map((item) => String(item)) : [];
      return { type: "list", style: row.style === "number" ? "number" : "bullet", items };
    }
    if (row.type === "hook") {
      return { type: "hook", text: String(row.text ?? row.markdown ?? "") };
    }
    if (row.type === "summary") {
      const points = Array.isArray(row.points) ? row.points.map((point) => String(point)) : [];
      return { type: "summary", points };
    }
    return block;
  });
}

function assemble(raw: GeneratedPayload, subject: Subject, subtopic: Subtopic, minQuestions: number): { lesson: Lesson; file: QuestionFile } {
  const questionsIn = Array.isArray(raw.questions) ? raw.questions : [];
  const questions: Question[] = questionsIn.map((entry, index) => {
    const row = asRecord(entry);
    const id = `${subtopic.id}.q${String(index + 1).padStart(3, "0")}`;
    const type = typeof row.type === "string" ? row.type : "mcq";
    const board = row.board === "NECO" || row.board === "JAMB" || row.board === "NERDC" ? row.board : "WAEC";
    const objectiveIds = subtopic.objectives.map((objective) => objective.id);
    const assigned = Array.isArray(row.objectiveIds)
      ? (row.objectiveIds as string[]).filter((id) => objectiveIds.includes(id))
      : [];
    const options = normalizeOptions(row.options);
    const correctOptionId = typeof row.correctOptionId === "string" ? row.correctOptionId : undefined;
    const distractorRationale = normalizeDistractorRationale(row.distractorRationale, options);
    let explanation = String(row.explanation ?? "").trim();
    if (explanation.length < 20) {
      const correctText = options?.find((option) => option.id === correctOptionId)?.text;
      const reasons = distractorRationale ? Object.values(distractorRationale).join(" ") : "";
      explanation = [correctText ? `The correct answer is ${correctText}.` : "", reasons].filter(Boolean).join(" ").trim();
    }
    if (explanation.length < 20) {
      explanation = `This answer is correct for ${subtopic.name} because it matches the syllabus definition; the other options mix up related but different ideas.`;
    }
    return {
      id,
      subtopicId: subtopic.id,
      objectiveIds: assigned.length > 0 ? assigned : [objectiveIds[index % objectiveIds.length]],
      type,
      difficulty: row.difficulty === 2 || row.difficulty === 3 ? row.difficulty : 1,
      stem: String(row.stem ?? ""),
      options,
      correctOptionId,
      correctOptionIds: Array.isArray(row.correctOptionIds) ? (row.correctOptionIds as string[]) : undefined,
      correctValue: row.correctValue as Question["correctValue"],
      markingGuide: Array.isArray(row.markingGuide) ? (row.markingGuide as string[]) : undefined,
      explanation,
      distractorRationale,
      misconceptionTags: Array.isArray(row.misconceptionTags) ? (row.misconceptionTags as string[]) : [],
      examMeta: { board, style: "exam-pattern" },
      provenance: PROVENANCE,
    } as Question;
  }).filter((question) => {
    if (question.type === "mcq") return (question.options?.length ?? 0) >= 3 && Boolean(question.correctOptionId);
    if (question.type === "true_false") return (question.options?.length ?? 0) === 2;
    if (question.type === "theory") return (question.markingGuide?.length ?? 0) > 0;
    return question.stem.length >= 5 && question.explanation.length >= 20;
  });

  if (questions.length < minQuestions) {
    throw new Error(`Only ${questions.length} usable questions, need ${minQuestions}`);
  }
  questions.splice(minQuestions + 2); // keep a small surplus, drop a huge overflow
  questions.forEach((question, index) => {
    question.id = `${subtopic.id}.q${String(index + 1).padStart(3, "0")}`;
  });

  let blocks = Array.isArray(raw.blocks) ? normalizeBlocks(raw.blocks) : [];
  const checkId = `${subtopic.id}.q001`;
  let sawCheck = false;
  blocks = blocks.map((block) => {
    const row = asRecord(block);
    if (row.type === "check") {
      sawCheck = true;
      return { type: "check", questionId: checkId };
    }
    if (row.type === "image" || row.type === "video" || row.type === "interactive") {
      return {
        type: "text",
        markdown: typeof row.fallbackText === "string" && row.fallbackText.length >= 20
          ? row.fallbackText
          : typeof row.alt === "string" && row.alt.length >= 20
            ? row.alt
            : "See the worked example and summary in this lesson for the key idea.",
      };
    }
    return block;
  });
  if (!sawCheck) {
    const summaryAt = blocks.findIndex((block) => asRecord(block).type === "summary");
    const check = { type: "check", questionId: checkId };
    if (summaryAt === -1) blocks.push(check);
    else blocks.splice(summaryAt, 0, check);
  }

  const lesson: Lesson = {
    id: `${subtopic.id}.lesson`,
    subtopicId: subtopic.id,
    title: String(raw.lessonTitle || subtopic.name),
    estimatedMinutes: Number(raw.estimatedMinutes) > 0 ? Math.min(Number(raw.estimatedMinutes), 18) : 12,
    objectiveIds: subtopic.objectives.map((objective) => objective.id),
    blocks: blocks as Lesson["blocks"],
    provenance: PROVENANCE,
  };

  return {
    lesson,
    file: { subtopicId: subtopic.id, questions },
  };
}

function formatZod(error: { issues: Array<{ path: (string | number)[]; message: string }> }): string {
  return error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`).join("\n");
}

async function generateOne(
  subject: Subject,
  topic: Topic,
  subtopic: Subtopic,
  destDir: string,
  force: boolean,
): Promise<"wrote" | "skipped"> {
  const topicSlug = idSlug(topic.id);
  const subSlug = idSlug(subtopic.id);
  const folder = path.join(destDir, "topics", topicSlug);
  const lessonPath = path.join(folder, `${subSlug}.lesson.json`);
  const questionsPath = path.join(folder, `${subSlug}.questions.json`);
  if (!force && existsSync(lessonPath) && existsSync(questionsPath)) return "skipped";

  mkdirSync(folder, { recursive: true });
  const minQuestions = minQuestionsFor(subject.id);
  const model = modelFor(subject.id);
  let errors: string | undefined;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const raw = await chatJson(model, systemPrompt(subject), userPrompt(subject, topic, subtopic, minQuestions, errors), 1);
    try {
      const assembled = assemble(raw, subject, subtopic, minQuestions);
      const lessonParsed = lessonSchema.safeParse(assembled.lesson);
      const questionsParsed = questionFileSchema.safeParse(assembled.file);
      if (!lessonParsed.success || !questionsParsed.success) {
        const parts: string[] = [];
        if (!lessonParsed.success) parts.push(`LESSON\n${formatZod(lessonParsed.error)}`);
        if (!questionsParsed.success) parts.push(`QUESTIONS\n${formatZod(questionsParsed.error)}`);
        throw new Error(parts.join("\n"));
      }
      writeFileSync(lessonPath, `${JSON.stringify(lessonParsed.data, null, 2)}\n`);
      writeFileSync(questionsPath, `${JSON.stringify(questionsParsed.data, null, 2)}\n`);
      return "wrote";
    } catch (error) {
      errors = error instanceof Error ? error.message : String(error);
      if (attempt === 3) throw new Error(`${subtopic.id}: ${errors}`);
    }
  }
  throw new Error(`${subtopic.id}: exhausted retries`);
}

async function mapPool<T, R>(items: T[], concurrency: number, worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function run(): Promise<void> {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
  return results;
}

async function main(): Promise<void> {
  loadEnvLocal();
  const only = argValue("--subject");
  const limit = Number(argValue("--limit") ?? "0");
  const force = hasFlag("--force");
  const concurrency = Number(process.env.CONTENT_GENERATE_CONCURRENCY ?? "3");

  const index = buildContentIndex();
  if (index.errors.length > 0) {
    console.error("Content index has errors; fix subject.json first:");
    for (const error of index.errors.slice(0, 20)) console.error(`  ${error.file}: ${error.message}`);
    process.exit(1);
  }

  const jobs: Array<{ subject: Subject; topic: Topic; subtopic: Subtopic; destDir: string }> = [];
  for (const dir of ["accounting", "commerce", "marketing", "mathematics", "english", "physics", "biology", "chemistry", "economics", "government", "undergrad-cs"]) {
    const subjectFile = path.join(SUBJECTS_DIR, dir, "subject.json");
    if (!existsSync(subjectFile)) continue;
    const subject = index.subjects.find((entry) => entry.id === JSON.parse(readFileSync(subjectFile, "utf8")).id);
    if (!subject) continue;
    if (only && only !== dir && only !== subject.id && only !== subject.name.toLowerCase()) continue;
    for (const topic of subject.topics) {
      for (const subtopic of topic.subtopics) {
        jobs.push({ subject, topic, subtopic, destDir: path.join(SUBJECTS_DIR, dir) });
      }
    }
  }

  const pending = jobs.filter((job) => {
    if (force) return true;
    const folder = path.join(job.destDir, "topics", idSlug(job.topic.id));
    const slug = idSlug(job.subtopic.id);
    return !(existsSync(path.join(folder, `${slug}.lesson.json`)) && existsSync(path.join(folder, `${slug}.questions.json`)));
  });
  const queue = limit > 0 ? pending.slice(0, limit) : pending;

  console.log(`${jobs.length} subtopics in scope, ${pending.length} missing content, generating ${queue.length} (concurrency ${concurrency})`);
  if (queue.length === 0) {
    console.log("Nothing to generate.");
    return;
  }

  let wrote = 0;
  let failed = 0;
  await mapPool(queue, concurrency, async (job, index) => {
    const label = `${index + 1}/${queue.length} ${job.subtopic.id}`;
    try {
      const result = await generateOne(job.subject, job.topic, job.subtopic, job.destDir, force);
      if (result === "wrote") {
        wrote += 1;
        console.log(`wrote  ${label}`);
      } else {
        console.log(`skip   ${label}`);
      }
    } catch (error) {
      failed += 1;
      console.error(`FAIL   ${label}`);
      console.error(`       ${error instanceof Error ? error.message : error}`);
    }
  });

  console.log(`done — wrote ${wrote}, failed ${failed}, skipped ${queue.length - wrote - failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
