import type { ClassLevel, Subject, Topic } from "../../lib/content/schema";

export interface SubtopicDraft {
  slug: string;
  name: string;
  summary: string;
  objectives: string[];
  /** Full subtopic IDs that already exist or are being added. */
  prerequisites?: string[];
}

export function makeTopic(
  subjectId: string,
  slug: string,
  name: string,
  order: number,
  summary: string,
  classLevels: ClassLevel[],
  subs: SubtopicDraft[],
): Topic {
  return {
    id: `${subjectId}.${slug}`,
    name,
    order,
    summary,
    classLevels,
    subtopics: subs.map((sub, index) => ({
      id: `${subjectId}.${slug}.${sub.slug}`,
      name: sub.name,
      order: index + 1,
      summary: sub.summary,
      prerequisites: sub.prerequisites ?? [],
      objectives: sub.objectives.map((text, objectiveIndex) => ({
        id: `${subjectId}.${slug}.${sub.slug}.o${objectiveIndex + 1}`,
        text,
      })),
    })),
  };
}

export interface NewSubjectDraft {
  dir: string;
  subject: Omit<Subject, "topics"> & { topics: Topic[] };
}

export const STANDARD_SEC_CURRICULA = ["WAEC", "NECO", "JAMB", "NERDC"] as const;
export const SS_LEVELS: ClassLevel[] = ["SS1", "SS2", "SS3"];
