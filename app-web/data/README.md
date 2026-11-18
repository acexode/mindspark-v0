# app-web/data

Working data for the undergraduate content pipeline (MBBS and Mechanical Engineering). The content
itself is served from `content.db` (SQLite). That file is not committed: distribute it with
`npx tsx scripts/content-db-snapshot.ts export --out <folder>` and restore it with `... import <bundle>`.

What is tracked here (the rest of this folder is git-ignored):

- `review/<course>/verdict.json` is the latest AI review of a course; `verdict.round1.json`,
  `verdict.round2.json` hold earlier rounds. These are AI reviews only. No course is human-verified.
- `author/<course>/<unit>.json` are the authored lesson and question payloads that were imported with
  `content-generate.ts --from-dir`. `author/<course>-fix*/` folders hold the corrected versions of units
  that were rewritten after review; where a unit exists in both, the fix folder is the later one.
  `content.db` is the source of truth for what students see.
- `author/ASSIGNMENT.md` records which source (OpenAI or Claude agents) authored which course.
- `author/post-import-*.cjs` are cleanup passes to re-run after any forced re-import (float noise,
  e-notation and bare powers of ten in math, stray control characters).

Regenerable and therefore not tracked: `author/**/*.prompt.md` (`content-generate.ts --emit-prompts`)
and `review/**/*.md` review packets (`content-review.ts export <course>`).
