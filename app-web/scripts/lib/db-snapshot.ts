import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";

/**
 * Offline snapshot export/import for the undergraduate content SQLite DB.
 * Self-contained on purpose (own tiny opener) so it never mutates the
 * schema of a DB it is only reading. No network access, no credentials.
 */

export const SNAPSHOT_FORMAT = 1;
export const SNAPSHOT_DB_FILE = "content.db";
export const SNAPSHOT_MANIFEST_FILE = "manifest.json";

export interface Manifest {
  format: number;
  schemaVersion: number;
  createdAt: string;
  dbFile: string;
  sha256: string;
  courses: Record<string, { documents: number; reviewStatus: Record<string, number> }>;
}

export interface MergeReport {
  inserted: number;
  updated: number;
  skippedOlder: number;
  verifiedPreserved: number;
  verifiedUpgraded: number;
  assetsAdded: number;
}

const nodeRequire = createRequire(path.join(process.cwd(), "package.json"));

function open(file: string, readOnly = false): DatabaseSync {
  const { DatabaseSync: Db } = nodeRequire("node:sqlite") as typeof import("node:sqlite");
  return new Db(file, readOnly ? { readOnly: true } : {});
}

export function sha256File(file: string): string {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

const q = (s: string): string => `'${s.replace(/'/g, "''")}'`;
const stamp = (): string => new Date().toISOString().replace(/[:.]/g, "-");

function schemaVersion(db: DatabaseSync): number {
  const row = db.prepare("PRAGMA user_version").get() as { user_version: number };
  return row.user_version;
}

function summarise(db: DatabaseSync): Manifest["courses"] {
  const rows = db
    .prepare(
      `SELECT COALESCE(subject_id, CASE WHEN kind = 'subject' THEN id END, '(none)') AS course,
              review_status AS status, COUNT(*) AS n
       FROM documents GROUP BY course, status`,
    )
    .all() as unknown as Array<{ course: string; status: string; n: number }>;
  const out: Manifest["courses"] = {};
  for (const r of rows) {
    const c = (out[r.course] ??= { documents: 0, reviewStatus: {} });
    c.documents += r.n;
    c.reviewStatus[r.status] = r.n;
  }
  return out;
}

/** Writes <outDir>/mindspark-content-<time>/{content.db,manifest.json}; returns the bundle dir. */
export function exportSnapshot(opts: { dbFile: string; outDir: string; courses?: string[] }): { bundleDir: string; manifest: Manifest } {
  if (!existsSync(opts.dbFile)) throw new Error(`Database not found: ${opts.dbFile}`);
  const bundleDir = path.join(opts.outDir, `mindspark-content-${stamp()}`);
  mkdirSync(bundleDir, { recursive: true });
  const target = path.join(bundleDir, SNAPSHOT_DB_FILE);

  const src = open(opts.dbFile, true);
  const version = schemaVersion(src);
  src.exec(`VACUUM INTO ${q(target)}`);
  src.close();

  const courses = opts.courses ?? [];
  if (courses.length > 0) {
    const copy = open(target);
    const list = courses.map(q).join(",");
    copy.exec(`DELETE FROM documents WHERE NOT (COALESCE(subject_id, '') IN (${list}) OR (kind = 'subject' AND id IN (${list})))`);
    copy.exec("PRAGMA journal_mode = DELETE");
    copy.exec("VACUUM");
    copy.close();
  }

  const db = open(target, true);
  const manifest: Manifest = {
    format: SNAPSHOT_FORMAT,
    schemaVersion: version,
    createdAt: new Date().toISOString(),
    dbFile: SNAPSHOT_DB_FILE,
    sha256: "",
    courses: summarise(db),
  };
  db.close();
  manifest.sha256 = sha256File(target);
  writeFileSync(path.join(bundleDir, SNAPSHOT_MANIFEST_FILE), JSON.stringify(manifest, null, 2) + "\n");
  return { bundleDir, manifest };
}

export function verifyBundle(bundleDir: string): { manifest: Manifest; dbFile: string } {
  const manifestPath = path.join(bundleDir, SNAPSHOT_MANIFEST_FILE);
  if (!existsSync(manifestPath)) throw new Error(`manifest.json not found in ${bundleDir}`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  if (manifest.format !== SNAPSHOT_FORMAT) throw new Error(`Unsupported snapshot format ${String(manifest.format)}`);
  const dbFile = path.join(bundleDir, manifest.dbFile);
  if (!existsSync(dbFile)) throw new Error(`Bundle database missing: ${dbFile}`);
  const actual = sha256File(dbFile);
  if (actual !== manifest.sha256) throw new Error(`Hash mismatch: manifest ${manifest.sha256}, file ${actual}. Bundle is corrupt or incomplete.`);
  return { manifest, dbFile };
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS documents (
  kind TEXT NOT NULL, id TEXT NOT NULL, subject_id TEXT, json TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'unreviewed', review_notes TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY (kind, id));
CREATE INDEX IF NOT EXISTS idx_documents_subject ON documents(subject_id);
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY, mime TEXT NOT NULL, data BLOB NOT NULL,
  licence TEXT, attribution TEXT, source_url TEXT);`;

interface DocRecord {
  kind: string;
  id: string;
  subject_id: string | null;
  json: string;
  review_status: string;
  review_notes: string | null;
  updated_at: string;
}

/** Merge by (kind,id): newer updated_at wins; a local human_verified status is never downgraded. */
export function mergeSnapshot(bundleDir: string, targetFile: string): MergeReport {
  const { dbFile } = verifyBundle(bundleDir);
  mkdirSync(path.dirname(targetFile), { recursive: true });
  const incoming = open(dbFile, true);
  const local = open(targetFile);
  local.exec(SCHEMA);
  const report: MergeReport = { inserted: 0, updated: 0, skippedOlder: 0, verifiedPreserved: 0, verifiedUpgraded: 0, assetsAdded: 0 };
  const get = local.prepare("SELECT * FROM documents WHERE kind = ? AND id = ?");
  const put = local.prepare(
    "INSERT OR REPLACE INTO documents (kind, id, subject_id, json, review_status, review_notes, updated_at) VALUES (?,?,?,?,?,?,?)",
  );
  const setStatus = local.prepare("UPDATE documents SET review_status = ?, review_notes = ? WHERE kind = ? AND id = ?");
  local.exec("BEGIN");
  try {
    const docs = incoming.prepare("SELECT * FROM documents").all() as unknown as DocRecord[];
    for (const d of docs) {
      const cur = get.get(d.kind, d.id) as unknown as DocRecord | undefined;
      if (!cur) {
        put.run(d.kind, d.id, d.subject_id, d.json, d.review_status, d.review_notes, d.updated_at);
        report.inserted++;
      } else if (d.updated_at > cur.updated_at) {
        const keep = cur.review_status === "human_verified" && d.review_status !== "human_verified";
        put.run(d.kind, d.id, d.subject_id, d.json, keep ? cur.review_status : d.review_status, keep ? cur.review_notes : d.review_notes, d.updated_at);
        report.updated++;
        if (keep) report.verifiedPreserved++;
      } else {
        report.skippedOlder++;
        if (d.review_status === "human_verified" && cur.review_status !== "human_verified") {
          setStatus.run(d.review_status, d.review_notes, d.kind, d.id);
          report.verifiedUpgraded++;
        }
      }
    }
    const assets = incoming.prepare("SELECT * FROM assets").all() as unknown as Array<Record<string, string | Uint8Array | null>>;
    const ins = local.prepare("INSERT OR IGNORE INTO assets (id, mime, data, licence, attribution, source_url) VALUES (?,?,?,?,?,?)");
    for (const a of assets) {
      const r = ins.run(a.id as string, a.mime as string, a.data as Uint8Array, a.licence as string | null, a.attribution as string | null, a.source_url as string | null);
      report.assetsAdded += Number(r.changes);
    }
    local.exec("COMMIT");
  } catch (e) {
    local.exec("ROLLBACK");
    throw e;
  } finally {
    local.close();
    incoming.close();
  }
  return report;
}

/** Backs up the existing DB (consistent VACUUM INTO copy) then swaps in the bundle DB. */
export function replaceSnapshot(bundleDir: string, targetFile: string): { backup: string | null } {
  const { dbFile } = verifyBundle(bundleDir);
  mkdirSync(path.dirname(targetFile), { recursive: true });
  let backup: string | null = null;
  if (existsSync(targetFile)) {
    backup = `${targetFile}.bak-${stamp()}`;
    const db = open(targetFile, true);
    db.exec(`VACUUM INTO ${q(backup)}`);
    db.close();
  }
  const tmp = `${targetFile}.incoming`;
  copyFileSync(dbFile, tmp);
  for (const ext of ["-wal", "-shm"]) rmSync(targetFile + ext, { force: true });
  renameSync(tmp, targetFile);
  return { backup };
}
