import { z } from "zod";

const settings = {
  units: z.enum(["mm", "m"]).default("mm"),
  scale: z.number().positive().max(5000).default(50),
};

const length = z.number().positive().max(1_000_000);
const opening = z.object({
  side: z.enum(["south", "north", "west", "east"]),
  at: z.number().min(0).max(1_000_000),
  width: length,
});

/** One endpoint, four ways in: describe it, fill a template, or re-run an edited script. */
export const draftingRequestSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("describe"), prompt: z.string().trim().min(3).max(1000), ...settings }),
  z.object({
    kind: z.literal("room"),
    width: length,
    height: length,
    wall: length.default(230),
    doors: z.array(opening).max(8).default([]),
    windows: z.array(opening).max(8).default([]),
    label: z.string().max(60).optional(),
    ...settings,
  }),
  z.object({
    kind: z.literal("traverse"),
    startX: z.number().default(0),
    startY: z.number().default(0),
    legs: z
      .array(z.object({ bearing: z.number().min(0).max(360), distance: length }))
      .min(2)
      .max(40),
    closed: z.boolean().default(true),
    ...settings,
  }),
  z.object({ kind: z.literal("script"), script: z.string().min(1).max(20_000), ...settings }),
]);

export type DraftingRequest = z.infer<typeof draftingRequestSchema>;
