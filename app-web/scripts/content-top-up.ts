#!/usr/bin/env tsx
/**
 * Append exam-pattern questions until each targeted subtopic has --min questions.
 * Does not rewrite lessons. Resumes by skipping banks that already meet the floor.
 *
 *   npx tsx scripts/content-top-up.ts --min 32 --subjects mathematics,english,physics,biology,chemistry,economics
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { questionFileSchema, questionSchema, type Question, type Subject, type Subtopic, type Topic } from "../lib/content/schema";
import { buildContentIndex, idSlug } from "../lib/content/loader";

const SUBJECTS_DIR = path.join(process.cwd(), "content/subjects");
const CORE = ["mathematics", "english", "physics", "biology", "chemistry", "economics"];

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
  return index === -1 ? undefined : process.argv[index + 1];
}

const PROVENANCE = {
  sources: [{ id: "openai-curriculum-pack", title: "Mindspark OpenAI curriculum pack", type: "authored" as const }],
  reviewStatus: "published" as const,
  verified: false,
  note: "Exam-pattern questions generated with OpenAI against the NERDC/WAEC/NECO/JAMB syllabus.",
};

async function chatJson(user: string): Promise<{ questions?: unknown[] }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  const model = process.env.OPENAI_CONTENT_MODEL ?? "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      max_tokens: 12000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write Nigerian secondary-school exam-pattern questions. Return JSON {\"questions\":[...]}. Each item: type (mcq), difficulty 1|2|3, stem, options [{id,text}] a-d, correctOptionId, explanation (≥2 sentences), distractorRationale {letter: reason}, board WAEC|NECO|JAMB. Options must be an array. No duplicate stems. No image. Stay on the given class level — do not write SS3 material for JSS, or JSS material for SS3. Ground every fact in the stated objectives. Do not invent syllabus topics.",
        },
        { role: "user", content: user },
      ],
    }),
  });
  if (response.status === 429 || response.status >= 500) {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return chatJson(user);
  }
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as { questions?: unknown[] };
}

function nextQuestionNumber(questions: Question[]): number {
  let max = 0;
  for (const question of questions) {
    const match = question.id.match(/\.q(\d+)$/);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return max + 1;
}

function asQuestion(raw: unknown, subtopic: Subtopic, id: string): Question | null {
  const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  let options = row.options;
  if (options && !Array.isArray(options) && typeof options === "object") {
    options = Object.entries(options as Record<string, unknown>).map(([key, text]) => ({
      id: key,
      text: typeof text === "string" ? text : String(text),
    }));
  }
  const parsed = questionSchema.safeParse({
    id,
    subtopicId: subtopic.id,
    objectiveIds: subtopic.objectives.map((objective) => objective.id).slice(0, 1),
    type: row.type ?? "mcq",
    difficulty: row.difficulty === 2 || row.difficulty === 3 ? row.difficulty : 1,
    stem: String(row.stem ?? ""),
    options,
    correctOptionId: row.correctOptionId,
    explanation: String(row.explanation ?? "This option matches the syllabus definition for the class; the others confuse related ideas that are taught at a different stage."),
    distractorRationale: Array.isArray(row.distractorRationale) ? undefined : row.distractorRationale,
    misconceptionTags: [],
    examMeta: { board: row.board === "NECO" || row.board === "JAMB" ? row.board : "WAEC", style: "exam-pattern" },
    provenance: PROVENANCE,
  });
  return parsed.success ? parsed.data : null;
}

async function topUp(subject: Subject, topic: Topic, subtopic: Subtopic, destDir: string, min: number): Promise<"ok" | "skip" | "fail"> {
  const file = path.join(destDir, "topics", idSlug(topic.id), `${idSlug(subtopic.id)}.questions.json`);
  if (!existsSync(file)) return "skip";
  const current = questionFileSchema.parse(JSON.parse(readFileSync(file, "utf8")));
  if (current.questions.length >= min) return "skip";

  const stems = new Set(current.questions.map((question) => question.stem.trim().toLowerCase()));
  let next = nextQuestionNumber(current.questions);

  for (let attempt = 1; attempt <= 4 && current.questions.length < min; attempt += 1) {
    const needed = min - current.questions.length;
    const batch = Math.min(needed + 2, 12);
    const existingStems = current.questions.map((question) => question.stem.slice(0, 100));
    const raw = await chatJson(
      `Subject ${subject.name}. Topic ${topic.name} for classes ${topic.classLevels.join(", ")}.
Subtopic ${subtopic.name}: ${subtopic.summary}
Objectives:\n${subtopic.objectives.map((objective) => `- ${objective.text}`).join("\n")}
Already used stems (do not repeat):\n${existingStems.map((stem) => `- ${stem}`).join("\n")}
Write ${batch} NEW mcq questions only, at the ${topic.classLevels.join("/")} level.`,
    );
    for (const entry of raw.questions ?? []) {
      const id = `${subtopic.id}.q${String(next).padStart(3, "0")}`;
      const question = asQuestion(entry, subtopic, id);
      if (!question) continue;
      const stem = question.stem.trim().toLowerCase();
      if (stems.has(stem)) continue;
      current.questions.push(question);
      stems.add(stem);
      next += 1;
      if (current.questions.length >= min) break;
    }
    writeFileSync(file, `${JSON.stringify(current, null, 2)}\n`);
  }

  return current.questions.length >= min ? "ok" : "fail";
}

async function mapPool<T>(items: T[], concurrency: number, worker: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (next < items.length) {
        const index = next;
        next += 1;
        await worker(items[index]);
      }
    }),
  );
}

async function main(): Promise<void> {
  loadEnvLocal();
  const min = Number(argValue("--min") ?? "32");
  const wanted = new Set((argValue("--subjects") ?? CORE.join(",")).split(",").map((value) => value.trim()));
  const index = buildContentIndex();
  const jobs: Array<{ subject: Subject; topic: Topic; subtopic: Subtopic; destDir: string }> = [];

  for (const dir of wanted) {
    const subjectFile = path.join(SUBJECTS_DIR, dir, "subject.json");
    if (!existsSync(subjectFile)) continue;
    const id = (JSON.parse(readFileSync(subjectFile, "utf8")) as { id: string }).id;
    const subject = index.subjectById.get(id);
    if (!subject) continue;
    for (const topic of subject.topics) {
      for (const subtopic of topic.subtopics) {
        jobs.push({ subject, topic, subtopic, destDir: path.join(SUBJECTS_DIR, dir) });
      }
    }
  }

  const pending = jobs.filter((job) => {
    const file = path.join(job.destDir, "topics", idSlug(job.topic.id), `${idSlug(job.subtopic.id)}.questions.json`);
    if (!existsSync(file)) return false;
    const count = (JSON.parse(readFileSync(file, "utf8")) as { questions?: unknown[] }).questions?.length ?? 0;
    return count < min;
  });

  console.log(`${jobs.length} subtopics, ${pending.length} below ${min} questions`);
  let ok = 0;
  let fail = 0;
  await mapPool(pending, Number(process.env.CONTENT_GENERATE_CONCURRENCY ?? "4"), async (job) => {
    try {
      const result = await topUp(job.subject, job.topic, job.subtopic, job.destDir, min);
      if (result === "ok") {
        ok += 1;
        console.log(`ok    ${job.subtopic.id}`);
      } else if (result === "fail") {
        fail += 1;
        console.log(`short ${job.subtopic.id}`);
      }
    } catch (error) {
      fail += 1;
      console.error(`FAIL  ${job.subtopic.id}: ${error instanceof Error ? error.message : error}`);
    }
  });
  console.log(`top-up done — filled ${ok}, still short or failed ${fail}`);
  if (fail > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
