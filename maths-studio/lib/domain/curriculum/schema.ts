import { z } from "zod";

export const curriculumPackageSchema = z.object({
  id: z.string(),
  version: z.string(),
  educationLevel: z.enum(["secondary", "university"]),
  educationSystem: z.string(),
  subject: z.string(),
  reviewStatus: z.enum(["draft", "review", "published"]),
  publishedAt: z.string().optional(),
  sources: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string().optional(),
      type: z.enum(["syllabus", "textbook", "exam-board", "institution"]),
    }),
  ),
  concepts: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      prerequisites: z.array(z.string()),
      objectives: z.array(z.string()),
      difficulty: z.number().min(1).max(3),
    }),
  ),
  lessons: z.array(
    z.object({
      id: z.string(),
      conceptId: z.string(),
      title: z.string(),
      steps: z.array(
        z.object({
          id: z.string(),
          type: z.enum([
            "hook",
            "concept",
            "visual",
            "interaction",
            "worked_example",
            "attempt",
            "feedback",
            "challenge",
            "recap",
          ]),
          content: z.record(z.unknown()),
        }),
      ),
    }),
  ),
  questions: z.array(
    z.object({
      id: z.string(),
      conceptId: z.string(),
      difficulty: z.number().min(1).max(3),
      format: z.enum(["mcq", "numerical", "equation", "multi_select"]),
      prompt: z.string(),
      options: z.array(z.string()).optional(),
      correctAnswer: z.union([z.string(), z.number(), z.array(z.string())]),
      misconceptionTags: z.array(z.string()).optional(),
    }),
  ),
});

export type CurriculumPackage = z.infer<typeof curriculumPackageSchema>;
