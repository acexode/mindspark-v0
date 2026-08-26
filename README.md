# Mindspark v0 — Adaptive Learning Platform

Mindspark is an AI-powered adaptive learning platform built as **Maths Studio** — a calm, notebook-like study environment for secondary and university students.

## Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Drizzle ORM** + Neon PostgreSQL
- **Clerk** authentication
- **Vercel AI SDK** for grounded tutor
- **Vitest** + **Playwright** + **axe** for testing
- Deployed on **Vercel**

## Getting started

```bash
cd maths-studio
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed curriculum and concepts |

## Learning spaces

| Route | Space |
|-------|-------|
| `/home` | Today — recommendations |
| `/learn/linear-equations` | Interactive lesson |
| `/practice/linear-equations` | Adaptive practice |
| `/knowledge-map` | Skill graph |
| `/library` | Browse curriculum |
| `/quests` | Daily missions |
| `/league` | Tiered competition |
| `/tutor` | AI tutor chat |
| `/progress` | Mastery evidence |
| `/guardian` | Parent view |
| `/teacher` | Teacher portal |
| `/admin/curriculum` | Content CMS |

## Architecture

See [docs/engineering-guidelines.md](docs/engineering-guidelines.md) and [docs/implementation-plan.md](docs/implementation-plan.md).

## Production checklist

- [ ] Set `DATABASE_URL` (Neon)
- [ ] Configure Clerk keys
- [ ] Set `OPENAI_API_KEY` for AI tutor
- [ ] Run `npm run db:migrate && npm run db:seed`
- [ ] Deploy to Vercel with env vars
- [ ] Verify PWA install and offline lesson cache
