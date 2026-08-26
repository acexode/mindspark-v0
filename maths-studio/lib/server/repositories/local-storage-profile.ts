import type { StudentProfile } from "@/lib/domain/student/types";
import { DEFAULT_STUDENT_PROFILE } from "@/lib/domain/student/types";
import type { StudentProfileRepository } from "./types";

const STORAGE_KEY = "mindspark-profile-v1";

function readProfile(): StudentProfile {
  if (typeof window === "undefined") return { ...DEFAULT_STUDENT_PROFILE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STUDENT_PROFILE };
    return { ...DEFAULT_STUDENT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STUDENT_PROFILE };
  }
}

function writeProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export const localStorageProfileRepository: StudentProfileRepository = {
  async get() {
    return readProfile();
  },
  async save(profile) {
    writeProfile(profile);
    return profile;
  },
  async update(updater) {
    const current = readProfile();
    const next = updater(current);
    writeProfile(next);
    return next;
  },
  async reset() {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  },
};
