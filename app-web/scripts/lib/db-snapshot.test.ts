// @vitest-environment node
import { appendFileSync, existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { exportSnapshot, mergeSnapshot, replaceSnapshot, verifyBundle } from "./db-snapshot";

const req = createRequire(path.join(process.cwd(), "package.json"));
const SCHEMA = `CREATE TABLE documents (kind TEXT NOT NULL, id TEXT NOT NULL, subject_id TEXT, json TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'unreviewed', review_notes TEXT, updated_at TEXT NOT NULL, PRIMARY KEY (kind, id));
  CREATE TABLE assets (id TEXT PRIMARY KEY, mime TEXT NOT NULL, data BLOB NOT NULL, licence TEXT, attribution TEXT, source_url TEXT);`;

type Row = [id: string, subject: string, json: string, status: string, updatedAt: string];

function mk(file: string, rows: Row[]): void {
  const { DatabaseSync: Db } = req("node:sqlite") as typeof import("node:sqlite");
  const db: DatabaseSync = new Db(file);
  db.exec(SCHEMA);
  const ins = db.prepare("INSERT INTO documents (kind,id,subject_id,json,review_status,updated_at) VALUES (?,?,?,?,?,?)");
  for (const [id, subj, json, status, at] of rows) ins.run("lesson", id, subj, json, status, at);
  db.close();
}

function read(file: string, id: string): { json: string; review_status: string } | undefined {
  const { DatabaseSync: Db } = req("node:sqlite") as typeof import("node:sqlite");
  const db = new Db(file, { readOnly: true });
  const r = db.prepare("SELECT json, review_status FROM documents WHERE id = ?").get(id) as unknown as
    | { json: string; review_status: string }
    | undefined;
  db.close();
  return r && { json: r.json, review_status: r.review_status };
}

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), "snap-"));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("db snapshot", () => {
  it("round-trips export then replace, with backup and course counts", () => {
    const src = path.join(dir, "src.db");
    mk(src, [
      ["a", "ug.c1", '{"v":1}', "human_verified", "2026-01-01 00:00:00"],
      ["b", "ug.c2", "{}", "unreviewed", "2026-01-01 00:00:00"],
    ]);
    const { bundleDir, manifest } = exportSnapshot({ dbFile: src, outDir: path.join(dir, "out"), courses: ["ug.c1"] });
    expect(manifest.courses).toEqual({ "ug.c1": { documents: 1, reviewStatus: { human_verified: 1 } } });
    const target = path.join(dir, "t.db");
    mk(target, [["z", "ug.c9", "{}", "unreviewed", "2026-01-01 00:00:00"]]);
    const { backup } = replaceSnapshot(bundleDir, target);
    expect(backup !== null && existsSync(backup)).toBe(true);
    expect(read(target, "a")?.json).toBe('{"v":1}');
    expect(read(target, "z")).toBeUndefined();
    expect(readdirSync(dir).some((f) => f.includes(".bak-"))).toBe(true);
  });

  it("rejects a bundle whose hash does not match", () => {
    const src = path.join(dir, "src.db");
    mk(src, [["a", "ug.c1", "{}", "unreviewed", "2026-01-01 00:00:00"]]);
    const { bundleDir } = exportSnapshot({ dbFile: src, outDir: dir });
    appendFileSync(path.join(bundleDir, "content.db"), "x");
    expect(() => verifyBundle(bundleDir)).toThrow(/Hash mismatch/);
    expect(() => mergeSnapshot(bundleDir, path.join(dir, "t.db"))).toThrow(/Hash mismatch/);
    expect(existsSync(path.join(dir, "t.db"))).toBe(false);
  });

  it("merge keeps newer updated_at and never downgrades human_verified", () => {
    const src = path.join(dir, "src.db");
    mk(src, [
      ["newer", "ug.c1", '{"s":"incoming"}', "ai_reviewed", "2026-03-01 00:00:00"],
      ["older", "ug.c1", '{"s":"incoming"}', "ai_reviewed", "2026-01-01 00:00:00"],
      ["fresh", "ug.c1", "{}", "unreviewed", "2026-01-01 00:00:00"],
    ]);
    const target = path.join(dir, "t.db");
    mk(target, [
      ["newer", "ug.c1", '{"s":"local"}', "human_verified", "2026-02-01 00:00:00"],
      ["older", "ug.c1", '{"s":"local"}', "unreviewed", "2026-02-01 00:00:00"],
    ]);
    const { bundleDir } = exportSnapshot({ dbFile: src, outDir: dir });
    const rep = mergeSnapshot(bundleDir, target);
    expect(rep).toMatchObject({ inserted: 1, updated: 1, skippedOlder: 1, verifiedPreserved: 1 });
    expect(read(target, "newer")).toEqual({ json: '{"s":"incoming"}', review_status: "human_verified" });
    expect(read(target, "older")?.json).toBe('{"s":"local"}');
    expect(read(target, "fresh")).toBeDefined();
  });
});
