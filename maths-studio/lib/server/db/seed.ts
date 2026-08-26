import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import curriculum from "@/content/curricula/waec-neco-algebra-linear-equations.json";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not set — skipping seed.");
    return;
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  await db.insert(schema.curriculumPackages).values({
    id: curriculum.id,
    version: curriculum.version,
    educationLevel: curriculum.educationLevel as "secondary" | "university",
    educationSystem: curriculum.educationSystem,
    subject: curriculum.subject,
    reviewStatus: curriculum.reviewStatus as "published",
    content: curriculum,
    sources: curriculum.sources,
    publishedAt: new Date(curriculum.publishedAt ?? Date.now()),
  }).onConflictDoNothing();

  for (const concept of curriculum.concepts) {
    await db.insert(schema.concepts).values({
      id: concept.id,
      label: concept.label,
      subjectId: "algebra",
      prerequisites: concept.prerequisites,
      difficulty: concept.difficulty,
    }).onConflictDoNothing();
  }

  console.log("Seed complete.");
}

seed().catch(console.error);
