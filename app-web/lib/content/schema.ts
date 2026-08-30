import { z } from "zod";

/**
 * Canonical content contracts. Frozen after Wave 0 — content and feature agents
 * code against these. Changes go through the lead agent, never a direct edit.
 *
 * ID grammar (see docs/mindspark-build-guide.md §4.2):
 *   subject   {level}.{subject}
 *   topic     {level}.{subject}.{topic}
 *   subtopic  {level}.{subject}.{topic}.{subtopic}
 *   objective {subtopicId}.o{n}
 *   lesson    {subtopicId}.lesson
 *   question  {subtopicId}.q{nnn}
 */

const SLUG = "[a-z0-9]+(?:-[a-z0-9]+)*";

export const ID_PATTERNS = {
  subject: new RegExp(`^(sec|ug)\\.${SLUG}$`),
  topic: new RegExp(`^(sec|ug)\\.${SLUG}\\.${SLUG}$`),
  subtopic: new RegExp(`^(sec|ug)\\.${SLUG}\\.${SLUG}\\.${SLUG}$`),
  objective: new RegExp(`^(sec|ug)\\.${SLUG}\\.${SLUG}\\.${SLUG}\\.o\\d+$`),
  lesson: new RegExp(`^(sec|ug)\\.${SLUG}\\.${SLUG}\\.${SLUG}\\.lesson$`),
  question: new RegExp(`^(sec|ug)\\.${SLUG}\\.${SLUG}\\.${SLUG}\\.q\\d{3,}$`),
} as const;

const subjectId = z.string().regex(ID_PATTERNS.subject, "Invalid subject id");
const topicId = z.string().regex(ID_PATTERNS.topic, "Invalid topic id");
const subtopicId = z.string().regex(ID_PATTERNS.subtopic, "Invalid subtopic id");
const objectiveId = z.string().regex(ID_PATTERNS.objective, "Invalid objective id");

export const educationLevelSchema = z.enum(["secondary", "undergraduate"]);
export const examBoardSchema = z.enum(["WAEC", "NECO", "JAMB", "NERDC", "internal"]);
export const classLevelSchema = z.enum([
  "JSS1",
  "JSS2",
  "JSS3",
  "SS1",
  "SS2",
  "SS3",
  "Year1",
  "Year2",
  "Year3",
  "Year4",
]);
export const reviewStatusSchema = z.enum(["draft", "review", "published"]);
export const difficultySchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export const provenanceSchema = z.object({
  sources: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        type: z.enum(["syllabus", "textbook", "exam-board", "institution", "past-paper", "authored"]),
        url: z.string().url().optional(),
      }),
    )
    .min(1, "At least one source is required"),
  reviewStatus: reviewStatusSchema,
  /** True only for content transcribed from a verified authoritative source. */
  verified: z.boolean().default(false),
  note: z.string().optional(),
});

/* ------------------------------------------------------------------ subject */

export const objectiveSchema = z.object({
  id: objectiveId,
  text: z.string().min(8),
});

export const subtopicSchema = z.object({
  id: subtopicId,
  name: z.string().min(2),
  order: z.number().int().nonnegative(),
  summary: z.string().min(10),
  prerequisites: z.array(subtopicId).default([]),
  objectives: z.array(objectiveSchema).min(1, "Each subtopic needs at least one objective"),
  /** Defaults to the parent topic's classLevels when omitted. */
  classLevels: z.array(classLevelSchema).optional(),
});

export const topicSchema = z.object({
  id: topicId,
  name: z.string().min(2),
  order: z.number().int().nonnegative(),
  summary: z.string().min(10),
  classLevels: z.array(classLevelSchema).min(1),
  subtopics: z.array(subtopicSchema).min(1, "Each topic needs at least one subtopic"),
});

export const subjectSchema = z.object({
  id: subjectId,
  level: educationLevelSchema,
  name: z.string().min(2),
  shortName: z.string().min(1),
  description: z.string().min(20),
  curricula: z.array(examBoardSchema).min(1),
  classLevels: z.array(classLevelSchema).min(1),
  /** Hex colour used as the subject accent across Library, Learn and Progress. */
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  /** Phosphor icon name. */
  icon: z.string().min(2),
  topics: z.array(topicSchema).min(1),
  provenance: provenanceSchema,
});

/* ------------------------------------------------------------- content block */

const inlineMediaSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(3, "Images must have descriptive alt text"),
  caption: z.string().optional(),
});

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("hook"), text: z.string().min(20) }),
  z.object({ type: z.literal("text"), markdown: z.string().min(20) }),
  z.object({ type: z.literal("math"), latex: z.string().min(1), caption: z.string().optional() }),
  z.object({ type: z.literal("image"), ...inlineMediaSchema.shape }),
  z.object({
    type: z.literal("video"),
    src: z.string().min(1),
    title: z.string().min(3),
    transcript: z.string().optional(),
  }),
  z.object({
    type: z.literal("table"),
    headers: z.array(z.string()).min(1),
    rows: z.array(z.array(z.string())).min(1),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("list"),
    style: z.enum(["bullet", "number"]).default("bullet"),
    items: z.array(z.string().min(1)).min(2),
  }),
  z.object({
    type: z.literal("callout"),
    variant: z.enum(["definition", "key-point", "warning", "example", "exam-tip"]),
    title: z.string().min(2),
    text: z.string().min(10),
  }),
  z.object({
    type: z.literal("worked_example"),
    title: z.string().min(3),
    prompt: z.string().min(5),
    steps: z
      .array(
        z.object({
          text: z.string().min(3),
          latex: z.string().optional(),
        }),
      )
      .min(2),
    answer: z.string().min(1),
  }),
  z.object({ type: z.literal("check"), questionId: z.string().min(5) }),
  z.object({
    type: z.literal("interactive"),
    component: z.string().min(2),
    props: z.record(z.unknown()).default({}),
    /** Text fallback shown when the component is unavailable. */
    fallbackText: z.string().min(10),
  }),
  z.object({ type: z.literal("summary"), points: z.array(z.string().min(5)).min(2) }),
]);

export const lessonSchema = z.object({
  id: z.string().regex(ID_PATTERNS.lesson, "Invalid lesson id"),
  subtopicId,
  title: z.string().min(3),
  estimatedMinutes: z.number().int().positive().max(60),
  objectiveIds: z.array(objectiveId).min(1),
  blocks: z.array(contentBlockSchema).min(4, "A lesson needs at least 4 blocks to be useful"),
  provenance: provenanceSchema,
});

/* ----------------------------------------------------------------- question */

export const questionTypeSchema = z.enum([
  "mcq",
  "multi_select",
  "true_false",
  "numeric",
  "short_answer",
  "theory",
  "matching",
  "ordering",
]);

export const optionSchema = z.object({
  id: z.string().regex(/^[a-h]$/),
  text: z.string().min(1),
});

export const examMetaSchema = z.object({
  board: examBoardSchema,
  year: z.number().int().min(1990).max(2030).optional(),
  paper: z.number().int().positive().optional(),
  number: z.number().int().positive().optional(),
  /**
   * "past-paper"  transcribed verbatim from a real paper
   * "exam-pattern" authored to match the board's syllabus, style and difficulty
   */
  style: z.enum(["past-paper", "exam-pattern"]),
});

export const questionSchema = z
  .object({
    id: z.string().regex(ID_PATTERNS.question, "Invalid question id"),
    subtopicId,
    objectiveIds: z.array(objectiveId).min(1),
    type: questionTypeSchema,
    difficulty: difficultySchema,
    stem: z.string().min(5),
    media: inlineMediaSchema.optional(),
    options: z.array(optionSchema).optional(),
    correctOptionId: z.string().optional(),
    correctOptionIds: z.array(z.string()).optional(),
    correctValue: z.union([z.string(), z.number()]).optional(),
    tolerance: z.number().nonnegative().optional(),
    markingGuide: z.array(z.string().min(3)).optional(),
    explanation: z.string().min(20, "Every question must explain why the answer is correct"),
    distractorRationale: z.record(z.string()).optional(),
    misconceptionTags: z.array(z.string()).default([]),
    examMeta: examMetaSchema,
    provenance: provenanceSchema,
  })
  .superRefine((q, ctx) => {
    const needsOptions = q.type === "mcq" || q.type === "multi_select" || q.type === "true_false";

    if (needsOptions) {
      if (!q.options || q.options.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${q.type} requires at least 2 options`, path: ["options"] });
        return;
      }
      if (q.type === "mcq" && q.options.length < 3) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "mcq requires at least 3 options", path: ["options"] });
      }
      const ids = q.options.map((o) => o.id);
      if (new Set(ids).size !== ids.length) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Duplicate option ids", path: ["options"] });
      }
      if (q.type === "multi_select") {
        if (!q.correctOptionIds?.length) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "multi_select requires correctOptionIds", path: ["correctOptionIds"] });
        } else if (q.correctOptionIds.some((id) => !ids.includes(id))) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "correctOptionIds must reference existing options", path: ["correctOptionIds"] });
        }
      } else if (!q.correctOptionId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${q.type} requires correctOptionId`, path: ["correctOptionId"] });
      } else if (!ids.includes(q.correctOptionId)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "correctOptionId must reference an existing option", path: ["correctOptionId"] });
      }
    }

    if ((q.type === "numeric" || q.type === "short_answer") && q.correctValue === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${q.type} requires correctValue`, path: ["correctValue"] });
    }

    if (q.type === "theory" && !q.markingGuide?.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "theory requires a markingGuide", path: ["markingGuide"] });
    }

    if (q.id.startsWith(`${q.subtopicId}.q`) === false) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Question id must be namespaced under its subtopicId", path: ["id"] });
    }
  });

export const questionFileSchema = z.object({
  subtopicId,
  questions: z.array(questionSchema).min(1),
});

/* -------------------------------------------------------------------- types */

export type EducationLevel = z.infer<typeof educationLevelSchema>;
export type ExamBoard = z.infer<typeof examBoardSchema>;
export type ClassLevel = z.infer<typeof classLevelSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type Provenance = z.infer<typeof provenanceSchema>;
export type Objective = z.infer<typeof objectiveSchema>;
export type Subtopic = z.infer<typeof subtopicSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type QuestionType = z.infer<typeof questionTypeSchema>;
export type QuestionOption = z.infer<typeof optionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type QuestionFile = z.infer<typeof questionFileSchema>;

/** Question with the answer key stripped — the only shape sent to clients. */
export type PublicQuestion = Omit<
  Question,
  "correctOptionId" | "correctOptionIds" | "correctValue" | "explanation" | "distractorRationale" | "markingGuide"
>;

const ANSWER_KEY_FIELDS = [
  "correctOptionId",
  "correctOptionIds",
  "correctValue",
  "explanation",
  "distractorRationale",
  "markingGuide",
] as const;

export function toPublicQuestion(question: Question): PublicQuestion {
  const copy = { ...question } as Record<string, unknown>;
  for (const field of ANSWER_KEY_FIELDS) delete copy[field];
  return copy as PublicQuestion;
}
