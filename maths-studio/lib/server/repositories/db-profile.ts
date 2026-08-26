import "server-only";
import { eq } from "drizzle-orm";
import type { StudentProfile } from "@/lib/domain/student/types";
import { DEFAULT_STUDENT_PROFILE } from "@/lib/domain/student/types";
import { getDb } from "../db/client";
import { masteryEstimates, studentProfiles } from "../db/schema";
import type { MasteryRepository, StudentProfileRepository } from "./types";

function rowToProfile(row: typeof studentProfiles.$inferSelect): StudentProfile {
  return {
    id: row.id,
    userId: row.userId,
    preferredName: row.preferredName,
    ageBand: row.ageBand as StudentProfile["ageBand"],
    educationLevel: row.educationLevel,
    classLevel: row.classLevel,
    curriculum: row.curriculum as StudentProfile["curriculum"],
    institution: row.institution ?? undefined,
    programme: row.programme ?? undefined,
    goal: row.goal as StudentProfile["goal"],
    onboarded: row.onboarded,
    diagnosticScore: row.diagnosticScore,
    xp: row.xp,
    streak: row.streak,
    linearEquationsMastery: 0,
    lessonComplete: row.lessonComplete,
    practiceCorrect: row.practiceCorrect,
    accessibilityPreferences: row.accessibilityPreferences as unknown as StudentProfile["accessibilityPreferences"],
  };
}

export function createDbProfileRepository(userId: string, studentId: string): StudentProfileRepository {
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  return {
    async get() {
      const [row] = await db.select().from(studentProfiles).where(eq(studentProfiles.id, studentId)).limit(1);
      if (!row) return null;
      const profile = rowToProfile(row);
      const [mastery] = await db
        .select()
        .from(masteryEstimates)
        .where(eq(masteryEstimates.conceptId, "linear-equations"))
        .limit(1);
      profile.linearEquationsMastery = Math.round(mastery?.score ?? 34);
      return profile;
    },
    async save(profile) {
      await db
        .update(studentProfiles)
        .set({
          preferredName: profile.preferredName,
          ageBand: profile.ageBand,
          educationLevel: profile.educationLevel,
          classLevel: profile.classLevel,
          curriculum: profile.curriculum,
          institution: profile.institution,
          programme: profile.programme,
          goal: profile.goal,
          onboarded: profile.onboarded,
          diagnosticScore: profile.diagnosticScore,
          xp: profile.xp,
          streak: profile.streak,
          lessonComplete: profile.lessonComplete,
          practiceCorrect: profile.practiceCorrect,
          updatedAt: new Date(),
        })
        .where(eq(studentProfiles.id, studentId));
      return profile;
    },
    async update(updater) {
      const current = (await this.get()) ?? { ...DEFAULT_STUDENT_PROFILE, userId };
      const next = updater(current);
      return this.save(next);
    },
    async reset() {
      await db.delete(studentProfiles).where(eq(studentProfiles.id, studentId));
    },
  };
}

export function createDbMasteryRepository(studentId: string): MasteryRepository {
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  return {
    async recordEvidence(record) {
      const { masteryEvidence: evidenceTable } = await import("../db/schema");
      await db.insert(evidenceTable).values({
        studentId,
        conceptId: record.conceptId,
        correct: record.correct,
        attempts: record.attempts,
        hintsUsed: record.hintsUsed,
        difficulty: record.difficulty,
        scoreDelta: record.scoreDelta,
        scoreAfter: record.scoreAfter,
        source: record.source,
      });

      const existing = await db
        .select()
        .from(masteryEstimates)
        .where(eq(masteryEstimates.conceptId, record.conceptId))
        .limit(1);

      if (existing[0]) {
        await db
          .update(masteryEstimates)
          .set({ score: record.scoreAfter, updatedAt: new Date() })
          .where(eq(masteryEstimates.id, existing[0].id));
      } else {
        await db.insert(masteryEstimates).values({
          studentId,
          conceptId: record.conceptId,
          score: record.scoreAfter,
        });
      }

      return record.scoreAfter;
    },
    async getScore(conceptId) {
      const [row] = await db
        .select()
        .from(masteryEstimates)
        .where(eq(masteryEstimates.conceptId, conceptId))
        .limit(1);
      return row?.score ?? 0;
    },
    async getAllScores() {
      const rows = await db.select().from(masteryEstimates).where(eq(masteryEstimates.studentId, studentId));
      return Object.fromEntries(rows.map((r) => [r.conceptId, r.score]));
    },
  };
}
