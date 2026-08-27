# Prototype Instructions

Read and follow `../docs/engineering-guidelines.md` before implementation.

Run the local server yourself and open the preview in the browser. Do not give the user server-start instructions when you can run it.

Build routes in `app/`, shared UI in `components/`, feature modules in `features/`, and framework-independent learning rules in `lib/domain/`. Server-only logic lives in `lib/server/`.

When implementing visual changes, preserve the Maths Studio notebook aesthetic established in `src/styles.css`.

## Stack

- Next.js 15 App Router + React 19 + TypeScript
- Drizzle ORM + Neon PostgreSQL
- Clerk auth (optional in dev)
- Vercel AI SDK for tutor

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run test     # Unit tests
npm run test:e2e # Playwright E2E
```
