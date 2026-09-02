import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildContentIndex } from "@/lib/content/loader";
import { validateContent } from "@/lib/content/validate";

const ROOT = process.cwd();

function sourceFiles(): string[] {
  const output = execSync(
    `find app components features lib scripts -type f \\( -name "*.ts" -o -name "*.tsx" \\)`,
    { cwd: ROOT, encoding: "utf-8" },
  );
  return output.split("\n").filter(Boolean);
}

/**
 * These guards encode the project rule that no feature ships with content
 * defined in code. They are intentionally strict — if one fails, the fix is to
 * move the data into content/, not to relax the test.
 */
describe("content lives in content/, never in code", () => {
  const files = sourceFiles();

  it("finds source files to scan", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it("declares no question banks in TypeScript", () => {
    const offenders = files.filter((file) => {
      if (file.startsWith("lib/content/") || file.startsWith("scripts/")) return false;
      const source = readFileSync(path.join(ROOT, file), "utf-8");
      return /(PRACTICE_BANK|QUESTION_BANK|DIAGNOSTIC_QUESTIONS)\s*[:=]/.test(source);
    });
    expect(offenders).toEqual([]);
  });

  it("hardcodes no answer keys in TypeScript", () => {
    const offenders = files.filter((file) => {
      if (file.startsWith("lib/content/") || file.includes(".test.")) return false;
      const source = readFileSync(path.join(ROOT, file), "utf-8");
      return /correctIndex\s*:\s*\d/.test(source);
    });
    expect(offenders).toEqual([]);
  });

  it("has no route path with a hardcoded subject or topic slug", () => {
    const offenders = files.filter((file) => {
      if (file.includes(".test.")) return false;
      const source = readFileSync(path.join(ROOT, file), "utf-8");
      return /["'`]\/(learn|practice|quiz)\/(?!\[)[a-z]/.test(source);
    });
    expect(offenders).toEqual([]);
  });

  it("keeps subject-specific naming out of the student profile model", () => {
    const source = readFileSync(path.join(ROOT, "lib/domain/student/types.ts"), "utf-8");
    expect(source).not.toMatch(/linearEquations|mathsMastery|algebraScore/i);
  });
});

describe("seeded content is valid and usable", () => {
  const index = buildContentIndex();
  const result = validateContent();

  it("loads without schema or reference errors", () => {
    const messages = result.issues.filter((i) => i.severity === "error").map((i) => `${i.scope}: ${i.message}`);
    expect(messages).toEqual([]);
  });

  it("publishes at least one subject", () => {
    expect(index.subjects.length).toBeGreaterThanOrEqual(1);
  });

  it("gives every published lesson a resolvable subtopic", () => {
    for (const [subtopicId] of index.lessonBySubtopicId) {
      expect(index.subtopicById.has(subtopicId)).toBe(true);
    }
  });

  it("gives every question a non-trivial explanation", () => {
    for (const question of index.questionById.values()) {
      expect(question.explanation.trim().length).toBeGreaterThan(20);
    }
  });

  it("gives every multiple-choice question a valid answer key", () => {
    for (const question of index.questionById.values()) {
      if (question.type !== "mcq" && question.type !== "true_false") continue;
      const ids = question.options?.map((o) => o.id) ?? [];
      expect(ids).toContain(question.correctOptionId);
    }
  });

  /**
   * gradeAnswer defaults a numeric tolerance to 0, so a question whose answer
   * cannot be typed exactly is unanswerable without one. Integers and short
   * decimals are fine; anything a student would have to round is not.
   */
  it("makes every numeric answer reachable — exact or within a tolerance", () => {
    for (const question of index.questionById.values()) {
      if (question.type !== "numeric") continue;
      if ((question.tolerance ?? 0) > 0) continue;

      const value = Number(question.correctValue);
      expect(Number.isFinite(value), `${question.id} has a non-numeric correctValue`).toBe(true);
      const decimals = (String(value).split(".")[1] ?? "").length;
      expect(decimals, `${question.id} needs a tolerance: ${value} cannot be typed exactly`).toBeLessThanOrEqual(2);
    }
  });

  it("ensures every subject has at least one topic with at least one subtopic", () => {
    for (const subject of index.subjects) {
      expect(subject.topics.length).toBeGreaterThan(0);
      for (const topic of subject.topics) {
        expect(topic.subtopics.length).toBeGreaterThan(0);
      }
    }
  });
});
