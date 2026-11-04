import "server-only";
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

export const DRAFTING_DIR = path.join(process.cwd(), "drafting");
const RUN_TIMEOUT_MS = 20_000;
const MAX_OUTPUT_BYTES = 24 * 1024 * 1024;

interface PythonCommand {
  command: string;
  args: string[];
}

export interface DraftingSuccess {
  ok: true;
  dxf: string;
  svg: string;
  summary: Record<string, unknown>;
  commands: { what: string; keys: string[] }[];
  warnings: string[];
}

export interface DraftingFailure {
  ok: false;
  stage: string;
  error: string;
  line: number | null;
}

export type DraftingResult = DraftingSuccess | DraftingFailure;

/** The venv that `npm run drafting:setup` makes, then whatever Python is on the PATH. */
export function pythonCandidates(env: Record<string, string | undefined> = process.env, platform: NodeJS.Platform = process.platform): PythonCommand[] {
  const candidates: PythonCommand[] = [];
  if (env.DRAFTING_PYTHON) candidates.push({ command: env.DRAFTING_PYTHON, args: [] });
  const venv = platform === "win32" ? path.join(DRAFTING_DIR, ".venv", "Scripts", "python.exe") : path.join(DRAFTING_DIR, ".venv", "bin", "python");
  if (existsSync(venv)) candidates.push({ command: venv, args: [] });
  if (platform === "win32") {
    candidates.push({ command: "py", args: ["-3"] }, { command: "python", args: [] });
  } else {
    candidates.push({ command: "python3", args: [] }, { command: "python", args: [] });
  }
  return candidates;
}

export interface DraftingStatus {
  ready: boolean;
  /** What to tell the student when it is not ready. */
  problem?: "no-python" | "no-ezdxf";
  python?: string;
}

let cachedStatus: { at: number; value: DraftingStatus; command: PythonCommand | null } | null = null;

/** Finds a Python that has ezdxf. Cached briefly because every page load asks. */
export function draftingStatus(): DraftingStatus {
  return locatePython().value;
}

function locatePython(): { value: DraftingStatus; command: PythonCommand | null } {
  if (cachedStatus && Date.now() - cachedStatus.at < 10_000) return cachedStatus;
  let sawPython = false;
  let found: PythonCommand | null = null;
  let value: DraftingStatus = { ready: false, problem: "no-python" };
  for (const candidate of pythonCandidates()) {
    const probe = spawnSync(candidate.command, [...candidate.args, "-I", "-c", "import ezdxf, sys; print(sys.version_info >= (3, 9))"], {
      encoding: "utf8",
      timeout: 8000,
    });
    if (probe.error) continue;
    sawPython = true;
    if (probe.status === 0 && probe.stdout.trim() === "True") {
      value = { ready: true, python: [candidate.command, ...candidate.args].join(" ") };
      found = candidate;
      break;
    }
    value = { ready: false, problem: "no-ezdxf" };
  }
  if (!sawPython) value = { ready: false, problem: "no-python" };
  cachedStatus = { at: Date.now(), value, command: found };
  return cachedStatus;
}

export function resetDraftingStatusCache(): void {
  cachedStatus = null;
}

function failure(error: string, stage = "run"): DraftingFailure {
  return { ok: false, stage, error, line: null };
}

/** Runs a script in a separate, isolated, time-limited Python process and returns its JSON reply. */
export async function runDraftingScript(script: string, settings: { units: string; scale: number }): Promise<DraftingResult> {
  const { command: python } = locatePython();
  if (!python) return failure("Python with ezdxf is not set up. Run: npm run drafting:setup", "setup");

  const { command, args } = python;
  return new Promise<DraftingResult>((resolve) => {
    const child = spawn(command, [...args, "-I", path.join(DRAFTING_DIR, "run.py")], { cwd: DRAFTING_DIR, stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    let size = 0;
    let settled = false;
    const finish = (result: DraftingResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish(failure("the script took too long to run; simplify it"));
    }, RUN_TIMEOUT_MS);

    child.stdout.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_OUTPUT_BYTES) {
        child.kill("SIGKILL");
        finish(failure("the drawing is too large; simplify it"));
        return;
      }
      out += chunk.toString("utf8");
    });
    child.on("error", (error) => finish(failure(error.message, "setup")));
    child.on("close", () => {
      try {
        finish(JSON.parse(out) as DraftingResult);
      } catch {
        finish(failure("the drawing process ended without a result"));
      }
    });
    child.stdin.on("error", () => undefined);
    child.stdin.end(JSON.stringify({ script, units: settings.units, scale: settings.scale }));
  });
}
