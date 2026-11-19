/**
 * One-time setup for the drafting studio: a private Python environment with the drawing library.
 * Works on Windows, macOS and Linux. Run with `npm run drafting:setup`.
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "drafting");
const venv = path.join(dir, ".venv");
const windows = process.platform === "win32";
const venvPython = windows ? path.join(venv, "Scripts", "python.exe") : path.join(venv, "bin", "python");

const candidates: [string, string[]][] = windows
  ? [["py", ["-3"]], ["python", []], ["python3", []]]
  : [["python3", []], ["python", []]];

function findPython(): [string, string[]] | null {
  for (const [command, args] of candidates) {
    const probe = spawnSync(command, [...args, "-c", "import sys; print(sys.version_info >= (3, 9))"], { encoding: "utf8" });
    if (!probe.error && probe.status === 0 && probe.stdout.trim() === "True") return [command, args];
  }
  return null;
}

function run(command: string, args: string[]): void {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`\nSetup stopped: "${command} ${args.join(" ")}" failed.`);
    process.exit(1);
  }
}

const python = findPython();
if (!python) {
  console.error("Python 3.9 or newer was not found.\nInstall it from https://www.python.org/downloads/ (on Windows tick \"Add python.exe to PATH\"), then run this again.");
  process.exit(1);
}

// A venv remembers the Python that made it. If that Python was upgraded or removed, the venv is dead: rebuild it.
if (existsSync(venvPython)) {
  const alive = spawnSync(venvPython, ["-c", "import sys"], { encoding: "utf8" });
  if (alive.error || alive.status !== 0) {
    console.log("The existing Python environment points at a Python that is no longer installed. Rebuilding it ...");
    rmSync(venv, { recursive: true, force: true });
  }
}

if (!existsSync(venvPython)) {
  console.log("Creating a private Python environment in drafting/.venv ...");
  run(python[0], [...python[1], "-m", "venv", venv]);
}
console.log("Installing the drawing library ...");
run(venvPython, ["-m", "pip", "install", "--disable-pip-version-check", "-r", path.join(dir, "requirements.txt")]);
run(venvPython, ["-I", "-c", "import ezdxf; print('ezdxf', ezdxf.__version__, 'is ready')"]);
console.log("\nDone. Restart the app and open the Drafting page.");
