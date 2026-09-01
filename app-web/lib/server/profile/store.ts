import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { DEFAULT_STUDENT_PROFILE, type StudentProfile } from "@/lib/domain/student/types";

/**
 * Development persistence. File-backed so a profile survives dev-server
 * restarts, and keyed by a session cookie so the shape already matches the
 * per-user model the database adapter will use later.
 *
 * Swapping to PostgreSQL means replacing readAll/writeAll only.
 */
const DATA_DIR = path.join(process.cwd(), ".dev-data");
const DATA_FILE = path.join(DATA_DIR, "profiles.json");
const SESSION_COOKIE = "mindspark-session";

type ProfileStore = Record<string, StudentProfile>;

function readAll(): ProfileStore {
  if (!existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf-8")) as ProfileStore;
  } catch {
    return {};
  }
}

function writeAll(store: ProfileStore): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, `${JSON.stringify(store, null, 2)}\n`);
}

async function getSessionId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

/** Server Components cannot set cookies, so reads never create a session. */
export async function readProfile(): Promise<StudentProfile | null> {
  const sessionId = await getSessionId();
  if (!sessionId) return null;
  const profile = readAll()[sessionId];
  return profile
    ? { ...DEFAULT_STUDENT_PROFILE, ...profile, topicPracticeBest: profile.topicPracticeBest ?? {} }
    : null;
}

export async function readProfileOrDefault(): Promise<StudentProfile> {
  return (await readProfile()) ?? { ...DEFAULT_STUDENT_PROFILE };
}

/** Only callable from Server Actions and Route Handlers, which may set cookies. */
export async function writeProfile(profile: StudentProfile): Promise<StudentProfile> {
  const jar = await cookies();
  let sessionId = jar.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    jar.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const store = readAll();
  store[sessionId] = profile;
  writeAll(store);
  return profile;
}

export async function updateProfile(
  updater: (current: StudentProfile) => StudentProfile,
): Promise<StudentProfile> {
  const current = (await readProfile()) ?? { ...DEFAULT_STUDENT_PROFILE };
  return writeProfile(updater(current));
}

export async function resetProfile(): Promise<void> {
  const jar = await cookies();
  const sessionId = jar.get(SESSION_COOKIE)?.value;
  if (!sessionId) return;
  const store = readAll();
  delete store[sessionId];
  writeAll(store);
  jar.delete(SESSION_COOKIE);
}
