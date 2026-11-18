#!/usr/bin/env tsx
import path from "node:path";
import { exportSnapshot, mergeSnapshot, replaceSnapshot, verifyBundle } from "./lib/db-snapshot";

const USAGE = `Usage:
  npx tsx scripts/content-db-snapshot.ts export [--out <dir>] [--course <id>...] [--db <file>]
  npx tsx scripts/content-db-snapshot.ts import <bundle-dir> [--merge|--replace] [--db <file>]
Default --out is ./snapshots, default db is CONTENT_DB_PATH or data/content.db.`;

function main(argv: string[]): void {
  const [cmd, ...rest] = argv;
  const positional: string[] = [];
  const courses: string[] = [];
  let out = path.join(process.cwd(), "snapshots");
  let db = process.env.CONTENT_DB_PATH ?? path.join(process.cwd(), "data", "content.db");
  let mode: "merge" | "replace" = "merge";
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--out") out = path.resolve(rest[++i] ?? "");
    else if (a === "--db") db = path.resolve(rest[++i] ?? "");
    else if (a === "--course") courses.push(rest[++i] ?? "");
    else if (a === "--merge") mode = "merge";
    else if (a === "--replace") mode = "replace";
    else if (a.startsWith("--")) throw new Error(`Unknown flag ${a}\n${USAGE}`);
    else positional.push(a);
  }
  if (cmd === "export") {
    const { bundleDir, manifest } = exportSnapshot({ dbFile: db, outDir: out, courses });
    console.log(`Snapshot written: ${bundleDir}`);
    for (const [c, v] of Object.entries(manifest.courses)) console.log(`  ${c}: ${v.documents} docs ${JSON.stringify(v.reviewStatus)}`);
    console.log(`sha256 ${manifest.sha256}\nCopy this folder to your Drive-synced folder (no upload is done here).`);
  } else if (cmd === "import" && positional[0]) {
    const bundle = path.resolve(positional[0]);
    verifyBundle(bundle);
    console.log("Manifest hash verified.");
    if (mode === "replace") console.log(`Replaced ${db}; backup: ${replaceSnapshot(bundle, db).backup ?? "(none, no previous db)"}`);
    else console.log("Merged:", mergeSnapshot(bundle, db));
  } else {
    console.error(USAGE);
    process.exitCode = 1;
  }
}

try {
  main(process.argv.slice(2));
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
}
