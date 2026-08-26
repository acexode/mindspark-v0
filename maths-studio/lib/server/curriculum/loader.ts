import "server-only";
import { readFileSync } from "fs";
import path from "path";
import { curriculumPackageSchema, type CurriculumPackage } from "@/lib/domain/curriculum/schema";

export function loadCurriculumPackage(id: string): CurriculumPackage {
  const filePath = path.join(process.cwd(), "content/curricula", `${id}.json`);
  const raw = JSON.parse(readFileSync(filePath, "utf-8"));
  return curriculumPackageSchema.parse(raw);
}

export function listPublishedPackages(): CurriculumPackage[] {
  return [loadCurriculumPackage("waec-neco-algebra-linear-equations")].filter(
    (p) => p.reviewStatus === "published",
  );
}
