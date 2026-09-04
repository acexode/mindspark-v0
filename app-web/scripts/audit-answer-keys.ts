#!/usr/bin/env tsx
/**
 * Cross-checks answer keys against the question's own explanation.
 *
 * A generated multiple-choice question frequently computes the right value in
 * its explanation and then keys the wrong option letter. That marks a correct
 * student answer wrong, and neither the schema nor content:validate can see it,
 * because both the key and the explanation are individually well-formed.
 *
 *   npx tsx scripts/audit-answer-keys.ts
 *   npx tsx scripts/audit-answer-keys.ts --subject cve-structural-mechanics-1
 */
import { buildContentIndex } from "../lib/content/loader";
import type { Question } from "../lib/content/schema";

function numbersIn(text: string): Set<string> {
  return new Set(text.replace(/,/g, "").match(/\d+(?:\.\d+)?/g) ?? []);
}

/**
 * Numbers the explanation presents as a *computed result* — those following an
 * "=" or "≈". Matching against every number in the prose produces false
 * positives, because an explanation legitimately mentions figures it is not
 * concluding with ("Day 1 is the first day", "the other 90% is lost as heat").
 */
function resultNumbersIn(text: string): Set<string> {
  const results = new Set<string>();
  const cleaned = text.replace(/,/g, "");
  for (const match of cleaned.matchAll(/[=≈]\s*[^\d\n]{0,12}?(\d+(?:\.\d+)?)/g)) {
    results.add(match[1]!);
  }
  return results;
}

interface Finding {
  id: string;
  kind: "mcq-key-contradicts-explanation" | "numeric-unreachable" | "theory-no-marking-guide";
  detail: string;
}

function auditQuestion(question: Question): Finding | null {
  if (question.type === "theory" && !(question.markingGuide?.length ?? 0)) {
    return { id: question.id, kind: "theory-no-marking-guide", detail: "theory question has no markingGuide" };
  }

  if (question.type === "numeric" && !((question.tolerance ?? 0) > 0)) {
    const value = Number(question.correctValue);
    const decimals = (String(value).split(".")[1] ?? "").length;
    if (Number.isFinite(value) && decimals > 2) {
      return {
        id: question.id,
        kind: "numeric-unreachable",
        detail: `correctValue ${value} needs a tolerance — it cannot be typed exactly`,
      };
    }
  }

  if (question.type !== "mcq" || !question.options) return null;
  const keyed = question.options.find((option) => option.id === question.correctOptionId);
  if (!keyed) {
    return { id: question.id, kind: "mcq-key-contradicts-explanation", detail: "correctOptionId matches no option" };
  }

  const keyNumbers = numbersIn(keyed.text);
  const results = resultNumbersIn(question.explanation);
  if (keyNumbers.size === 0 || results.size === 0) return null;
  if ([...keyNumbers].some((n) => results.has(n))) return null;

  const supported = question.options.filter(
    (option) => option.id !== question.correctOptionId && [...numbersIn(option.text)].some((n) => results.has(n)),
  );
  if (supported.length === 0) return null;

  return {
    id: question.id,
    kind: "mcq-key-contradicts-explanation",
    detail: `keyed "${keyed.text}" but the explanation supports ${supported.map((o) => `"${o.text}"`).join(" / ")}`,
  };
}

function main(): void {
  const only = process.argv.includes("--subject") ? process.argv[process.argv.indexOf("--subject") + 1] : undefined;
  const index = buildContentIndex();

  const findings: Finding[] = [];
  let checked = 0;
  let checkableMcq = 0;

  for (const question of index.questionById.values()) {
    const subject = index.subtopicById.get(question.subtopicId)?.subject;
    if (only && subject && !subject.id.includes(only)) continue;
    checked += 1;
    if (question.type === "mcq" && numbersIn(question.explanation).size > 0) checkableMcq += 1;
    const finding = auditQuestion(question);
    if (finding) findings.push(finding);
  }

  const byKind = new Map<string, Finding[]>();
  for (const finding of findings) {
    byKind.set(finding.kind, [...(byKind.get(finding.kind) ?? []), finding]);
  }

  for (const [kind, list] of byKind) {
    console.log(`\n${kind} — ${list.length}`);
    for (const finding of list.slice(0, 15)) console.log(`  ${finding.id}\n    ${finding.detail}`);
    if (list.length > 15) console.log(`  … and ${list.length - 15} more`);
  }

  console.log(
    `\naudit: ${checked} questions checked (${checkableMcq} numeric-explanation MCQs verifiable) — ${findings.length} findings`,
  );
  process.exit(findings.length > 0 ? 1 : 0);
}

main();
