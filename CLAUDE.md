# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo contains two Next.js apps at the top level:

- **`app-web/`** — the active application. All real work happens here.
- **`maths-studio/`** — a stale pre-rename artifact (untracked in git, almost empty). The app was renamed `maths-studio` → `app-web`; ignore this directory unless the user explicitly points you at it.

All commands below run from `app-web/`.

```bash
cd app-web
npm install
npm run dev
```

No database or auth setup is required for local development — the student profile is stored in `app-web/.dev-data/` (file-backed, session-cookie keyed).

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit/guard tests (run once) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | Playwright end-to-end journeys |
| `npm run content:validate` | Schema and reference integrity across all content |
| `npm run content:validate:tiers` | As above, plus per-subject coverage targets |
| `npm run content:report` | Coverage table and gap list |
| `npm run content:index` | Write the generated content manifest |

Run a single Vitest file with `npx vitest run path/to/file.test.ts`; a single Playwright spec with `npx playwright test tests/e2e/student-journey.spec.ts`.

## Architecture

### Content-driven, not code-driven

The defining constraint of this codebase: **all educational content lives in `app-web/content/subjects/`, never in `.ts`/`.tsx` files.** Lessons, questions, and answer keys are JSON, validated against Zod schemas in [lib/content/schema.ts](app-web/lib/content/schema.ts). Guard tests in [tests/guards/content-guards.test.ts](app-web/tests/guards/content-guards.test.ts) fail the build if a question bank, answer key, or hardcoded route slug appears in source. Read [docs/content-authoring-guide.md](docs/content-authoring-guide.md) before touching anything under `content/` — it is the complete contract, including ID grammar and file layout.

Content hierarchy: `Subject → Topic → Subtopic → Objective`, with a `Lesson` (content blocks) and `Questions` hanging off each subtopic. Every entity has a stable dotted ID (e.g. `sec.mathematics.algebra.linear-equations`), enforced by regex in `schema.ts`. Mastery is tracked **per subtopic only** and aggregated upward on read (`lib/domain/mastery/mastery.ts::aggregateMastery`) — topic/subject scores are always derived, never stored, so they cannot drift.

Content is loaded from disk and validated at runtime by [lib/content/loader.ts](app-web/lib/content/loader.ts) (`buildContentIndex`/`getContentIndex`), which builds an in-memory index (subjects, topics, subtopics, lessons, questions) cached briefly in dev. Invalid content files are collected as errors rather than thrown, so one bad JSON file doesn't take down the whole app locally — but `content:validate` and the guard tests must be clean before shipping.

`toPublicQuestion()` in `schema.ts` strips answer-key fields (`correctOptionId`, `explanation`, `markingGuide`, etc.) — this is the only question shape that may reach the client before grading.

### Subject-agnostic routing

Nothing is scoped to a single subject. Routes are parameterized (`/learn/[subject]/[topic]/[subtopic]`, `/practice/[subject]/[topic]`, `/quiz/[subject]/[mode]`); practice and quizzes always start from an explicit subject picker. No subject slug is ever hardcoded in a route string — a guard test enforces this too.

### Directory structure

```
app/              Next.js routes — thin, compose features, no business logic
  (student)/      home, library, learn, practice, quiz, progress, profile, tutor
  api/v1/         JSON API contracts (lessons, questions, mastery, recommendation, tutor turns)
components/
  ui/             reusable, product-agnostic primitives
  layout/         app shell, sidebar
features/
  <feature>/
    components/   feature-specific UI
    server/       server actions (learning, quiz, tutor)
lib/
  content/        schema, loader, validation, navigation, class-visibility
  domain/         pure, framework-independent logic: mastery, grading, shuffle,
                   recommendations, tutor fallback — no browser/network/DB access
  server/         profile store (file-backed dev persistence), AI tutor integration
content/
  subjects/       ALL educational content (JSON), one directory per subject
scripts/          content tooling (validate, index, report, generate, top-up)
tests/
  guards/         enforce the two rules above
  e2e/            Playwright student-journey tests
```

### Domain logic rules

- `lib/domain/*` functions are pure: typed in, typed out, no framework/browser/DB state. Equation logic, mastery updates, grading, and recommendations all live here and are unit-tested independently of routes.
- Authoritative learning state (mastery, XP, completion, unlocks) is server-only. Clients may request an action but never assign these values themselves.
- Prerequisites (`isUnlocked`/`lockReason` in `mastery.ts`) are advisory, not hard gates — a student can always jump ahead; the UI just suggests a prerequisite first.
- Mastery/recommendation decisions must be explainable: results carry a `reason` string, not just a number.

### Auth and persistence — intentionally deferred

Clerk auth, PostgreSQL (Drizzle + Neon), and deployment wiring are **not yet active**. [middleware.ts](app-web/middleware.ts) is a no-op placeholder. The profile store ([lib/server/profile/store.ts](app-web/lib/server/profile/store.ts)) sits behind a narrow read/write interface (`readProfile`/`writeProfile`/`updateProfile`) specifically so swapping the dev file store for a database touches no page or feature code — preserve that boundary when working here. Don't wire up Clerk or a DB unless explicitly asked.

## Content authoring — quick reference

Full contract: [docs/content-authoring-guide.md](docs/content-authoring-guide.md). Reference implementation to copy: `content/subjects/mathematics/topics/algebra/`.

- ID grammar is strict and regex-enforced: `{level}.{subject}.{topic}.{subtopic}` etc., where `level` is `sec` or `ug`. See `docs/content-authoring-guide.md` §4 for the full table.
- Write `subject.json` (full topic/subtopic tree) before any lesson file, so the app stays browsable.
- Every question needs a real `explanation` (validator-enforced, not a restatement of the answer).
- After writing content, run `npm run content:validate` and fix errors immediately.

## Engineering guidelines

Full rules: [docs/engineering-guidelines.md](docs/engineering-guidelines.md). Points most likely to matter day-to-day:

- Server Components by default; `"use client"` only at the smallest interactive boundary.
- Don't introduce an abstraction until at least two real consumers justify it.
- Keep files under ~250 lines; split by responsibility before that.
- Use stable curriculum/concept IDs as keys, never display labels.
- Strict TypeScript; avoid `any`, use `unknown` + narrowing at trust boundaries.
- Preserve the "Maths Studio" notebook visual aesthetic (see [src/styles.css](app-web/src/styles.css)) when making visual changes.
