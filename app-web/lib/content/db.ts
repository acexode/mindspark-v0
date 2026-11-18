import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import type { DatabaseSync as DatabaseSyncType } from "node:sqlite";

/**
 * Local, offline content database (SQLite, one file). Holds undergraduate
 * content; secondary-school content stays in repo JSON. Rows store the
 * Zod-validated JSON document plus indexed columns, so the schema in
 * schema.ts remains the single contract.
 */

export type DocKind = "programme" | "subject" | "lesson" | "questions";
export type ReviewStatus = "unreviewed" | "ai_reviewed" | "needs_changes" | "human_verified";

export interface DocRow {
  kind: DocKind;
  id: string;
  subjectId: string | null;
  json: string;
  reviewStatus: ReviewStatus;
}

export const DEFAULT_DB_PATH = path.join(process.cwd(), "data", "content.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS documents (
  kind          TEXT NOT NULL,
  id            TEXT NOT NULL,
  subject_id    TEXT,
  json          TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'unreviewed',
  review_notes  TEXT,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (kind, id)
);
CREATE INDEX IF NOT EXISTS idx_documents_subject ON documents(subject_id);
CREATE TABLE IF NOT EXISTS assets (
  id         TEXT PRIMARY KEY,
  mime       TEXT NOT NULL,
  data       BLOB NOT NULL,
  licence    TEXT,
  attribution TEXT,
  source_url TEXT
);
-- Durable queue of "a student enrolled in a course with ungenerated units".
-- The operator drains it offline: scripts/content-generate.ts --pending.
CREATE TABLE IF NOT EXISTS generation_requests (
  subject_id   TEXT PRIMARY KEY,
  requested_at TEXT NOT NULL DEFAULT (datetime('now')),
  status       TEXT NOT NULL DEFAULT 'pending'
);
`;

// Loaded through createRequire so the bundler does not try to resolve the
// experimental built-in module.
const nodeRequire = createRequire(path.join(process.cwd(), "package.json"));

export function dbPath(): string {
  return process.env.CONTENT_DB_PATH ?? DEFAULT_DB_PATH;
}

export function openContentDb(file: string = dbPath(), opts: { create?: boolean } = {}): DatabaseSyncType | null {
  if (!existsSync(file)) {
    if (!opts.create) return null;
    mkdirSync(path.dirname(file), { recursive: true });
  }
  const { DatabaseSync } = nodeRequire("node:sqlite") as typeof import("node:sqlite");
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(SCHEMA);
  return db;
}

export function listDocs(db: DatabaseSyncType, kind: DocKind): DocRow[] {
  const rows = db
    .prepare("SELECT kind, id, subject_id, json, review_status FROM documents WHERE kind = ? ORDER BY id")
    .all(kind) as Array<Record<string, string | null>>;
  return rows.map((r) => ({
    kind: r.kind as DocKind,
    id: r.id as string,
    subjectId: r.subject_id,
    json: r.json as string,
    reviewStatus: r.review_status as ReviewStatus,
  }));
}

export function upsertDoc(
  db: DatabaseSyncType,
  doc: { kind: DocKind; id: string; subjectId?: string | null; data: unknown; reviewStatus?: ReviewStatus; preserveReview?: boolean },
): void {
  db.prepare(
    `INSERT INTO documents (kind, id, subject_id, json, review_status, updated_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(kind, id) DO UPDATE SET
       subject_id = excluded.subject_id,
       json = excluded.json,
       review_status = CASE WHEN ? THEN documents.review_status WHEN ? IS NULL THEN 'unreviewed' ELSE excluded.review_status END,
       updated_at = datetime('now')`,
  ).run(
    doc.kind,
    doc.id,
    doc.subjectId ?? null,
    JSON.stringify(doc.data),
    doc.reviewStatus ?? "unreviewed",
    doc.preserveReview ? 1 : 0,
    doc.reviewStatus ?? null,
  );
}

export function setReviewStatus(db: DatabaseSyncType, subjectId: string, status: ReviewStatus, notes?: string): void {
  db.prepare("UPDATE documents SET review_status = ?, review_notes = ? WHERE subject_id = ? OR (kind = 'subject' AND id = ?)").run(
    status,
    notes ?? null,
    subjectId,
    subjectId,
  );
}

export function getAsset(db: DatabaseSyncType, id: string): { mime: string; data: Uint8Array } | null {
  const row = db.prepare("SELECT mime, data FROM assets WHERE id = ?").get(id) as
    | { mime: string; data: Uint8Array }
    | undefined;
  return row ?? null;
}

export function putAsset(
  db: DatabaseSyncType,
  asset: { id: string; mime: string; data: Uint8Array; licence?: string; attribution?: string; sourceUrl?: string },
): void {
  db.prepare(
    `INSERT OR REPLACE INTO assets (id, mime, data, licence, attribution, source_url) VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(asset.id, asset.mime, asset.data, asset.licence ?? null, asset.attribution ?? null, asset.sourceUrl ?? null);
}
