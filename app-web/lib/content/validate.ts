import { buildContentIndex, type ContentIndex } from "./loader";
import { ID_PATTERNS } from "./schema";

export interface ValidationIssue {
  severity: "error" | "warning";
  scope: string;
  message: string;
}

export interface TierRequirement {
  subjectId: string;
  tier: "A" | "B" | "C";
  minTopics: number;
  minSubtopics: number;
  /** Lessons required per subtopic (A) or per topic (B/C). */
  lessonRule: "per-subtopic" | "per-topic";
  minQuestionsPerSubtopic: number;
}

/**
 * Tier targets from docs/mindspark-build-guide.md §6.2.
 * Tier A subjects must be fully learnable; Tier B must be fully navigable.
 */
export const TIER_REQUIREMENTS: TierRequirement[] = [
  { subjectId: "sec.mathematics", tier: "A", minTopics: 8, minSubtopics: 24, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 8 },
  { subjectId: "sec.english", tier: "A", minTopics: 8, minSubtopics: 24, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 8 },
  { subjectId: "sec.physics", tier: "A", minTopics: 8, minSubtopics: 24, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 8 },
  { subjectId: "sec.biology", tier: "A", minTopics: 8, minSubtopics: 24, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 8 },
  { subjectId: "sec.chemistry", tier: "B", minTopics: 8, minSubtopics: 20, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 5 },
  { subjectId: "sec.economics", tier: "B", minTopics: 6, minSubtopics: 18, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 5 },
  { subjectId: "sec.government", tier: "B", minTopics: 6, minSubtopics: 18, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 5 },
  { subjectId: "sec.accounting", tier: "B", minTopics: 6, minSubtopics: 18, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 5 },
  { subjectId: "sec.commerce", tier: "B", minTopics: 6, minSubtopics: 18, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 5 },
  { subjectId: "sec.marketing", tier: "B", minTopics: 6, minSubtopics: 18, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 5 },
  { subjectId: "ug.computer-science", tier: "C", minTopics: 4, minSubtopics: 12, lessonRule: "per-subtopic", minQuestionsPerSubtopic: 5 },
];

export interface ValidationResult {
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
  index: ContentIndex;
}

/**
 * Cross-file integrity checks. Schema validity is already enforced by the
 * loader; this catches broken references and unmet content targets.
 */
export function validateContent(options: { enforceTiers?: boolean } = {}): ValidationResult {
  const index = buildContentIndex();
  const issues: ValidationIssue[] = [];

  for (const error of index.errors) {
    issues.push({ severity: "error", scope: error.file, message: error.message });
  }

  const seenIds = new Set<string>();
  const seenStems = new Map<string, Set<string>>();

  for (const subject of index.subjects) {
    assertUnique(subject.id, "subject", issues, seenIds);

    for (const programmeSlug of subject.programmes ?? []) {
      if (!index.programmeBySlug.has(programmeSlug)) {
        issues.push({ severity: "error", scope: subject.id, message: `Unknown programme: ${programmeSlug}` });
      }
    }

    if (subject.level === "undergraduate" && (!subject.courseCode || !subject.creditUnits || !subject.semester)) {
      issues.push({
        severity: "warning",
        scope: subject.id,
        message: "Undergraduate course should declare courseCode, creditUnits and semester",
      });
    }

    for (const topic of subject.topics) {
      assertUnique(topic.id, "topic", issues, seenIds);

      if (!topic.id.startsWith(`${subject.id}.`)) {
        issues.push({ severity: "error", scope: topic.id, message: `Topic id must be namespaced under ${subject.id}` });
      }

      for (const subtopic of topic.subtopics) {
        assertUnique(subtopic.id, "subtopic", issues, seenIds);

        if (!subtopic.id.startsWith(`${topic.id}.`)) {
          issues.push({ severity: "error", scope: subtopic.id, message: `Subtopic id must be namespaced under ${topic.id}` });
        }

        for (const prerequisite of subtopic.prerequisites) {
          if (!index.subtopicById.has(prerequisite)) {
            issues.push({ severity: "error", scope: subtopic.id, message: `Prerequisite not found: ${prerequisite}` });
          }
          if (prerequisite === subtopic.id) {
            issues.push({ severity: "error", scope: subtopic.id, message: "Subtopic cannot be its own prerequisite" });
          }
        }

        for (const objective of subtopic.objectives) {
          if (!objective.id.startsWith(`${subtopic.id}.o`)) {
            issues.push({ severity: "error", scope: objective.id, message: `Objective must be namespaced under ${subtopic.id}` });
          }
        }

        const objectiveIds = new Set(subtopic.objectives.map((o) => o.id));

        const lesson = index.lessonBySubtopicId.get(subtopic.id);
        if (lesson) {
          for (const objectiveId of lesson.objectiveIds) {
            if (!objectiveIds.has(objectiveId)) {
              issues.push({ severity: "error", scope: lesson.id, message: `Lesson references unknown objective: ${objectiveId}` });
            }
          }
          for (const block of lesson.blocks) {
            if (block.type === "check" && !index.questionById.has(block.questionId)) {
              issues.push({ severity: "error", scope: lesson.id, message: `check block references unknown question: ${block.questionId}` });
            }
          }
        }

        const questions = index.questionsBySubtopicId.get(subtopic.id) ?? [];
        const stems = seenStems.get(subtopic.id) ?? new Set<string>();
        for (const question of questions) {
          assertUnique(question.id, "question", issues, seenIds);

          for (const objectiveId of question.objectiveIds) {
            if (!objectiveIds.has(objectiveId)) {
              issues.push({ severity: "error", scope: question.id, message: `Question references unknown objective: ${objectiveId}` });
            }
          }

          const normalisedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
          if (stems.has(normalisedStem)) {
            issues.push({ severity: "error", scope: question.id, message: "Duplicate question stem within subtopic" });
          }
          stems.add(normalisedStem);
        }
        seenStems.set(subtopic.id, stems);
      }
    }
  }

  for (const [subtopicId] of index.lessonBySubtopicId) {
    if (!index.subtopicById.has(subtopicId)) {
      issues.push({ severity: "error", scope: subtopicId, message: "Lesson references a subtopic that does not exist in any subject.json" });
    }
  }

  for (const [subtopicId] of index.questionsBySubtopicId) {
    if (!index.subtopicById.has(subtopicId)) {
      issues.push({ severity: "error", scope: subtopicId, message: "Question file references a subtopic that does not exist in any subject.json" });
    }
  }

  if (options.enforceTiers) {
    for (const requirement of TIER_REQUIREMENTS) {
      const subject = index.subjectById.get(requirement.subjectId);
      if (!subject) {
        issues.push({ severity: "error", scope: requirement.subjectId, message: `Required Tier ${requirement.tier} subject is missing` });
        continue;
      }

      const stats = getSubjectStatsFromIndex(index, subject.id);
      const scope = requirement.subjectId;

      if (stats.topicCount < requirement.minTopics) {
        issues.push({ severity: "error", scope, message: `Needs ${requirement.minTopics} topics, has ${stats.topicCount}` });
      }
      if (stats.subtopicCount < requirement.minSubtopics) {
        issues.push({ severity: "error", scope, message: `Needs ${requirement.minSubtopics} subtopics, has ${stats.subtopicCount}` });
      }

      const requiredLessons = requirement.lessonRule === "per-subtopic" ? stats.subtopicCount : stats.topicCount;
      if (stats.lessonCount < requiredLessons) {
        issues.push({
          severity: "error",
          scope,
          message: `Needs ${requiredLessons} lessons (${requirement.lessonRule}), has ${stats.lessonCount}`,
        });
      }

      for (const topic of subject.topics) {
        for (const subtopic of topic.subtopics) {
          const count = (index.questionsBySubtopicId.get(subtopic.id) ?? []).length;
          if (count < requirement.minQuestionsPerSubtopic) {
            issues.push({
              severity: "error",
              scope: subtopic.id,
              message: `Needs ${requirement.minQuestionsPerSubtopic} questions, has ${count}`,
            });
          }
        }
      }
    }
  }

  return {
    issues,
    errorCount: issues.filter((i) => i.severity === "error").length,
    warningCount: issues.filter((i) => i.severity === "warning").length,
    index,
  };
}

function assertUnique(id: string, kind: string, issues: ValidationIssue[], seen: Set<string>): void {
  if (seen.has(id)) {
    issues.push({ severity: "error", scope: id, message: `Duplicate ${kind} id` });
  }
  seen.add(id);

  const pattern = ID_PATTERNS[kind as keyof typeof ID_PATTERNS];
  if (pattern && !pattern.test(id)) {
    issues.push({ severity: "error", scope: id, message: `Malformed ${kind} id` });
  }
}

export function getSubjectStatsFromIndex(index: ContentIndex, subjectId: string) {
  const subject = index.subjectById.get(subjectId);
  if (!subject) return { topicCount: 0, subtopicCount: 0, lessonCount: 0, questionCount: 0 };
  const subtopics = subject.topics.flatMap((t) => t.subtopics);
  return {
    topicCount: subject.topics.length,
    subtopicCount: subtopics.length,
    lessonCount: subtopics.filter((s) => index.lessonBySubtopicId.has(s.id)).length,
    questionCount: subtopics.reduce((sum, s) => sum + (index.questionsBySubtopicId.get(s.id) ?? []).length, 0),
  };
}
