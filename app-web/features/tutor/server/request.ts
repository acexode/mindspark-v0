import { z } from "zod";

export const MAX_MESSAGE_CHARS = 1000;
export const MAX_HISTORY_TURNS = 6;

const id = z.string().min(1).max(200);

/** Everything the client may send. Learning outcomes and answer keys are never accepted here. */
export const tutorRequestSchema = z.object({
  subjectName: z.string().max(200).optional(),
  subtopicId: id.optional(),
  topicId: id.optional(),
  userMessage: z.string().trim().max(MAX_MESSAGE_CHARS).optional(),
  alternateExplanation: z.boolean().optional(),
  surface: z.enum(["general", "lesson", "practice", "quiz-review"]).optional(),
  mode: z.enum(["explain", "hint", "check-my-thinking"]).optional(),
  questionId: id.optional(),
  studentAnswer: z
    .object({
      optionId: id.optional(),
      optionIds: z.array(id).max(20).optional(),
      value: z.string().max(200).optional(),
    })
    .optional(),
  history: z
    .array(z.object({ role: z.enum(["student", "tutor"]), text: z.string().max(4000) }))
    .max(MAX_HISTORY_TURNS)
    .optional(),
});

export type TutorRequest = z.infer<typeof tutorRequestSchema>;
