import "server-only";
import { cookies } from "next/headers";
import type { StudentProfile } from "@/lib/domain/student/types";
import { DEFAULT_STUDENT_PROFILE } from "@/lib/domain/student/types";
import { isDatabaseConfigured } from "../db/client";
import { createDbProfileRepository } from "./db-profile";
import type { StudentProfileRepository } from "./types";

const DEV_PROFILE_COOKIE = "mindspark-dev-profile";

function parseDevProfile(raw: string | undefined): StudentProfile | null {
  if (!raw) return null;
  try {
    return { ...DEFAULT_STUDENT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function createServerProfileRepository(): StudentProfileRepository {
  if (isDatabaseConfigured()) {
    // In production with auth, resolve userId/studentId from session
    // For now use dev cookie fallback
  }

  return {
    async get() {
      const cookieStore = await cookies();
      return parseDevProfile(cookieStore.get(DEV_PROFILE_COOKIE)?.value);
    },
    async save(profile) {
      const cookieStore = await cookies();
      cookieStore.set(DEV_PROFILE_COOKIE, JSON.stringify(profile), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      return profile;
    },
    async update(updater) {
      const current = (await this.get()) ?? { ...DEFAULT_STUDENT_PROFILE };
      return this.save(updater(current));
    },
    async reset() {
      const cookieStore = await cookies();
      cookieStore.delete(DEV_PROFILE_COOKIE);
    },
  };
}

export { createDbProfileRepository };
