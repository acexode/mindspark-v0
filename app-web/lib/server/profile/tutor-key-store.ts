import "server-only";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

/**
 * A student's own online-tutor API key. Kept in its own server-only file, never in the profile:
 * the profile is sent to the browser and returned by the profile API, a key must not be.
 *
 * Stored as plain text in app-web/.dev-data/tutor-keys.json (gitignored), keyed by the same session
 * cookie as the profile. Anyone who can read this machine's files can read it, so it suits a personal
 * laptop. Swap readAll/writeAll for an encrypted table when a real database is wired in.
 */
const DATA_DIR = path.join(process.cwd(), ".dev-data");
const KEY_FILE = path.join(DATA_DIR, "tutor-keys.json");
const SESSION_COOKIE = "mindspark-session";

type KeyStore = Record<string, string>;

function readAll(): KeyStore {
  if (!existsSync(KEY_FILE)) return {};
  try {
    return JSON.parse(readFileSync(KEY_FILE, "utf-8")) as KeyStore;
  } catch {
    return {};
  }
}

function writeAll(store: KeyStore): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(KEY_FILE, `${JSON.stringify(store, null, 2)}\n`);
  try {
    chmodSync(KEY_FILE, 0o600); // no effect on Windows; owner-only on macOS and Linux
  } catch {
    // Best effort.
  }
}

async function sessionId(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function getTutorKey(): Promise<string | null> {
  const id = await sessionId();
  return id ? (readAll()[id] ?? null) : null;
}

/** Only for the signed-in student's own session; returns false when there is no session yet. */
export async function setTutorKey(key: string): Promise<boolean> {
  const id = await sessionId();
  if (!id) return false;
  const store = readAll();
  store[id] = key;
  writeAll(store);
  return true;
}

export function clearTutorKeyFor(id: string): void {
  const store = readAll();
  if (!(id in store)) return;
  delete store[id];
  writeAll(store);
}

export async function clearTutorKey(): Promise<void> {
  const id = await sessionId();
  if (id) clearTutorKeyFor(id);
}
