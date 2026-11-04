import { describe, expect, it, vi } from "vitest";
import { draftingStatus, pythonCandidates, runDraftingScript } from "./python";

vi.mock("server-only", () => ({}));

describe("pythonCandidates", () => {
  it("prefers an explicit override and uses the py launcher on Windows", () => {
    const list = pythonCandidates({ DRAFTING_PYTHON: "C:\\Py\\python.exe" }, "win32");
    expect(list[0].command).toBe("C:\\Py\\python.exe");
    expect(list.some((c) => c.command === "py" && c.args[0] === "-3")).toBe(true);
    expect(list.some((c) => c.command === "python3")).toBe(false);
  });
  it("uses python3 on macOS and Linux", () => {
    expect(pythonCandidates({}, "darwin").some((c) => c.command === "python3")).toBe(true);
  });
});

// These need the project venv (npm run drafting:setup); they are skipped on a machine without it.
const ready = draftingStatus().ready;
describe.skipIf(!ready)("runDraftingScript", () => {
  it("draws, and returns a DXF and an SVG", async () => {
    const result = await runDraftingScript("d.rectangle((0,0),(4000,3000), layer='WALLS')", { units: "mm", scale: 50 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.dxf).toContain("SECTION");
      expect(result.svg).toContain("<svg");
    }
  }, 30_000);

  it("reports a rejected script without running it", async () => {
    const result = await runDraftingScript("import os", { units: "mm", scale: 50 });
    expect(result).toMatchObject({ ok: false, stage: "validate" });
  }, 30_000);
});
