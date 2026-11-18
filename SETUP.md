# Setting up MindSpark on a new computer

These steps take a fresh laptop (Windows 10/11 or macOS, 16 GB RAM) from nothing to a running app with all the
MBBS and Mechanical Engineering courses. Everything below runs from a terminal. On Windows use PowerShell.

## What you need first

| Tool | Version | Check with |
|---|---|---|
| Git | any recent | `git --version` |
| Node.js | 22.13 or newer (LTS 24 is a good choice) | `node -v` |
| Ollama | any recent | `ollama --version` |

Node 22.13+ matters: the content database uses `node:sqlite`, which is only available without a flag from that
version. If `node -v` prints something older, install the current LTS from https://nodejs.org.

The app also runs without Ollama (the tutor falls back to built-in guidance), but the tutor is much better with it.

## 1. Get the code

```bash
git clone https://github.com/acexode/mindspark-v0.git
cd mindspark-v0/app-web
```

All commands below run from `mindspark-v0/app-web`. (The `maths-studio` folder at the repo top is a stale leftover; ignore it.)

## 2. Install packages

```bash
npm install
```

This takes a few minutes and uses about 500 MB of disk.

## 3. Create your environment file

```bash
copy .env.example .env.local      # Windows
# cp .env.example .env.local      # macOS / Linux
```

For local use you only need these lines in `.env.local` (they are already in the example file):

```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

Everything else in the example (Neon database, Clerk sign-in, Vercel Blob, Inngest, Sentry) is not needed to run
locally: the student profile is stored in `app-web/.dev-data/`, and sign-in is switched off.
`OPENAI_API_KEY` is only needed if you later want to generate new course content with OpenAI. Never commit `.env.local`.

## 4. Set up the AI tutor (Ollama)

```bash
ollama pull llama3.2:3b
ollama list
```

The model is about 2 GB and runs comfortably on a 16 GB laptop. Ollama listens on `http://localhost:11434` once its
app or service is running. If you use a different model, change `OLLAMA_MODEL` in `.env.local`.

## 5. Install the course database

The 71 undergraduate courses (1,029 units, about 24,000 questions) live in a SQLite file, `app-web/data/content.db`.
It is not in git, because it is a generated file. download it via this link https://drive.google.com/drive/folders/1Izro0U9Syg7qCW3K2uJLzjKsD6bD_-s0?usp=drive_link,git  It travels as a snapshot bundle: a folder with `content.db` and
`manifest.json`.

1. Copy the bundle folder from the old computer to this one (USB stick, Drive, or network share). The latest one was
   written to `C:\mindspark-export\mindspark-content-2026-11-18T15-27-40-856Z\`.
2. Restore it:

```bash
npx tsx scripts/content-db-snapshot.ts import "C:\path\to\mindspark-content-2026-11-18T15-27-40-856Z" --replace
```

You should see `Manifest hash verified.` followed by the path of the installed database. The bundle's SHA-256 is
`d6a2175a7766d2e20e8236737f51908cd981abb9c4aa94753e2d7c5074c3430f` if you want to compare.

Run the PowerShell command with `npx tsx ...` directly. `npm run <script> -- --flag` swallows flags in PowerShell 5.

3. Check it:

```bash
npm run content:validate
```

Expected: `content:validate PASS — 107 subjects, 1879 lessons, 23843 questions`.

Without the database the app still starts, but the undergraduate MBBS and Mechanical Engineering courses will be missing.

## 6. Run the app

Development mode (hot reload):

```bash
npm run dev
```

Then open http://localhost:3000.

Faster production mode (recommended for daily use on a laptop):

```bash
npm run build
npm start
```

## 7. Check that it works

```bash
npm run typecheck
npm run test
```

Expected: the type check is clean and the tests report 240 passed, 2 skipped. Then open the Library in the app and
find an MBBS or Mechanical Engineering course. Database-backed courses show a "Draft: AI-generated, not yet
expert-verified" badge. That badge is expected: no course is human-verified yet.

End-to-end browser tests (`npm run test:e2e`) are optional. They need `npx playwright install`, which downloads about 2 GB.

## Optional extras

- **Drafting studio** (only for the AutoCAD drafting course): install Python 3.9 or newer, then run `npm run drafting:setup` once.
- **Windows kiosk install** (a launcher on the desktop for a student PC): restore the database first (step 5), then
  right-click `windows\install.bat` and choose Run as administrator. It copies the whole app, including `data\`, to
  `C:\ProgramData\Mindspark` and creates a desktop shortcut.
- **macOS launcher:** double-click `app-web/start-mindspark.command`. It builds and starts the app.

## Where things live

| Path | What it is | In git? |
|---|---|---|
| `app-web/content/subjects/` | secondary-school lessons and questions (JSON) | yes |
| `app-web/data/content.db` | undergraduate courses (SQLite) | no, restore from a snapshot |
| `app-web/data/review/` | AI review verdicts for each course | yes (verdict files) |
| `app-web/data/author/` | the authored lesson and question payloads | yes |
| `app-web/.env.local` | your local settings and keys | no |
| `app-web/.dev-data/` | student profile and progress | no |

All undergraduate content is AI-drafted and AI-reviewed. A clinician or engineer still has to verify it before
students rely on it. Several clinical doses and legal statements are marked for source checks in the review files.

## Backing up and moving the database later

```bash
npx tsx scripts/content-db-snapshot.ts export --out "D:\Backups\mindspark"
npx tsx scripts/content-db-snapshot.ts import "D:\Backups\mindspark\<bundle-folder>" --merge
```

`--merge` keeps the newer version of each document and never downgrades a `human_verified` one. `--replace` swaps in
the whole database after saving a timestamped backup of the old one. Stop `npm run dev` / `npm start` before `--replace`.

## Troubleshooting

- **`node:sqlite` not found, or an `ExperimentalWarning` about SQLite:** the first means Node is too old (install 22.13+);
  the warning is normal and harmless.
- **Port 3000 is busy:** `set PORT=3001` then `npm start` (PowerShell: `$env:PORT=3001; npm start`), or stop the other app.
- **The tutor says it can't reach a model:** start Ollama, run `ollama list` to confirm `llama3.2:3b` is installed, and
  check `OLLAMA_BASE_URL`. The first reply after starting Ollama can be slow while the model loads.
- **Slow or out of memory on 16 GB:** close browser tabs and other heavy apps. The app and a 3B model fit comfortably.
- **Git prints "LF will be replaced by CRLF" warnings:** harmless on Windows.
- **A course shows "being prepared":** some units had no lesson yet when the student enrolled. All 71 courses are complete
  in the current database, so this should not appear after a successful restore.
