/** Runs the Python drafting tests with the project's private environment (any platform). */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "drafting");
const python = process.platform === "win32" ? path.join(dir, ".venv", "Scripts", "python.exe") : path.join(dir, ".venv", "bin", "python");

if (!existsSync(python)) {
  console.error("The drafting environment is missing. Run: npm run drafting:setup");
  process.exit(1);
}
const result = spawnSync(python, ["-m", "unittest", "discover", "-s", path.join(dir, "tests")], { stdio: "inherit" });
process.exit(result.status ?? 1);
