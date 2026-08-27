# Mindspark

A learning platform for Nigerian secondary-school students and undergraduates.
Students **learn** a topic, **practise** what they learned, **take exam-style quizzes**, and **watch their mastery grow** — across every subject they study.

> **Status:** active rebuild. See [docs/mindspark-build-guide.md](docs/mindspark-build-guide.md) for scope, domain model and build plan.

---

## Quick start

```bash
cd app-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No database or auth setup is required for local development — the profile is stored in `app-web/.dev-data/`.

---

## Scripts

Run from `app-web/`.

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run test` | Unit and guard tests |
| `npm run test:e2e` | Playwright end-to-end journeys |
| `npm run content:validate` | Schema and reference integrity across all content |
| `npm run content:validate:tiers` | As above, plus per-subject coverage targets |
| `npm run content:report` | Coverage table and gap list |
| `npm run content:index` | Write the generated content manifest |

---

## How it is organised

```
app-web/
  app/              routes only — thin, compose features
    (student)/      library, learn, practice, quiz, progress, tutor
    api/v1/         JSON contracts
  features/         feature UI and server actions
  lib/
    content/        schema, loader, validation, navigation
    domain/         pure logic: mastery, grading, recommendation, tutor fallback
    server/         profile store, AI integration
  content/
    subjects/       ALL educational content lives here
  scripts/          content tooling
  tests/            guards and end-to-end journeys
docs/               build guide and authoring contract
```

### Content model

```
EducationLevel → Subject → Topic → Subtopic → Objective
                                      ├─ Lesson (content blocks)
                                      └─ Questions (with explanations)
```

Every entity has a stable dotted ID, for example
`sec.mathematics.algebra.linear-equations`. Mastery is tracked **per subtopic**
and aggregated upwards, so topic and subject scores can never drift.

---

## Two rules that shape the codebase

**1. No content in code.** Every lesson and question lives in `content/`.
Guard tests in `tests/guards/` fail the build if a question bank or answer key
appears in a `.ts` or `.tsx` file.

**2. Nothing is scoped to one subject.** Routes are parameterised
(`/learn/[subject]/[topic]/[subtopic]`), practice and quizzes always start from
an explicit picker, and no subject slug is hardcoded anywhere. A guard test
enforces this too.

---

## Adding content

Read [docs/content-authoring-guide.md](docs/content-authoring-guide.md) — it is
the complete contract. Copy the reference pack at
`app-web/content/subjects/mathematics/topics/algebra/`, then run
`npm run content:validate`.

---

## Deferred to later phases

Authentication (Clerk), PostgreSQL persistence, and deployment are intentionally
not wired up yet. The profile store in `lib/server/profile/store.ts` sits behind
a narrow interface so swapping the file-backed development store for a database
touches no page or feature code.
