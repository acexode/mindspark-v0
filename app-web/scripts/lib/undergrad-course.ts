import type { ClassLevel, Subject } from "../../lib/content/schema";
import { makeTopic, type SubtopicDraft } from "./topic-builder";

/**
 * A course IS a subject (see the undergraduate plan). This turns a compact
 * declarative spec into a full subject package so 48 courses can be authored
 * as data rather than 48 hand-written JSON trees.
 *
 * Vocabulary: a course's topics are "modules" and its subtopics are "units",
 * matching the undergraduate copy in lib/domain/student/experience.ts.
 */
export interface ModuleDraft {
  slug: string;
  name: string;
  summary: string;
  units: SubtopicDraft[];
}

export interface CourseSpec {
  /** Last ID segment and directory name, e.g. "cs-programming-fundamentals". */
  slug: string;
  code: string;
  name: string;
  shortName: string;
  description: string;
  year: ClassLevel;
  semester: 1 | 2;
  creditUnits: number;
  programme: string;
  accentColor: string;
  icon: string;
  modules: ModuleDraft[];
}

export function toSubject(spec: CourseSpec): Subject {
  const id = `ug.${spec.slug}`;
  return {
    id,
    level: "undergraduate",
    name: spec.name,
    shortName: spec.shortName,
    description: spec.description,
    // "internal" is the only non-Nigerian-board value in examBoardSchema, and
    // is the correct label for university coursework.
    curricula: ["internal"],
    classLevels: [spec.year],
    accentColor: spec.accentColor,
    icon: spec.icon,
    courseCode: spec.code,
    creditUnits: spec.creditUnits,
    semester: spec.semester,
    programmes: [spec.programme],
    topics: spec.modules.map((module, index) =>
      makeTopic(id, module.slug, module.name, index + 1, module.summary, [spec.year], module.units),
    ),
    provenance: {
      sources: [
        {
          id: "international-consensus-core",
          title: "International undergraduate consensus core (MIT, Cambridge, Imperial, Berkeley)",
          type: "syllabus",
        },
      ],
      reviewStatus: "published",
      verified: false,
      note: "Course structure synthesised from the core curricula common to leading university programmes. Not transcribed from any single institution.",
    },
  };
}

/** Rotated so adjacent rows in the course table are visually distinct. */
export const CS_PALETTE = ["#1f6f8b", "#0c4dcc", "#5b3fa8", "#147a52", "#8a4c1f", "#9d2f6b"];
export const CVE_PALETTE = ["#8a5a1f", "#2f6b3f", "#1f5f8b", "#7a3320", "#4a4f7a", "#6b6320"];

export function paletteColor(palette: string[], index: number): string {
  return palette[index % palette.length]!;
}
