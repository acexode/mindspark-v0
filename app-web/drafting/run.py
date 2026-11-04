"""Entry point the app calls: `python -I run.py`, one JSON request on stdin, one JSON reply on stdout.

Request:  {"script": str, "units": "mm"|"m", "scale": number}
Success:  {"ok": true, "dxf": str, "svg": str, "summary": {...}, "commands": [...], "warnings": [...]}
Failure:  {"ok": false, "stage": "input"|"validate"|"run"|"output", "error": str, "line": int|null}

Nothing but that one JSON document is ever written to stdout.
"""

from __future__ import annotations

import json
import os
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

try:  # a memory ceiling where the platform supports one (not Windows); the caller also enforces a timeout
    import resource

    resource.setrlimit(resource.RLIMIT_AS, (1536 * 1024 * 1024, 1536 * 1024 * 1024))
except (ImportError, ValueError, OSError):
    pass


def fail(stage: str, error: str, line: int | None = None) -> dict:
    return {"ok": False, "stage": stage, "error": error, "line": line}


def build(request: dict) -> dict:
    from mindspark_draft.drawing import Drawing, DraftingError
    from mindspark_draft.output import render
    from mindspark_draft.sandbox import ScriptError, run

    script = request.get("script")
    units = request.get("units", "mm")
    scale = request.get("scale", 50)
    if not isinstance(script, str):
        return fail("input", "script must be a string")

    try:
        drawing = Drawing(units=units, scale=scale)
    except DraftingError as error:
        return fail("input", str(error))

    try:
        run(script, drawing)
    except ScriptError as error:
        return fail(error.stage, error.message, error.line)

    if drawing.object_count == 0:
        return fail("run", "the script did not draw anything")

    try:
        return render(drawing)
    except Exception as error:  # noqa: BLE001 - report any failure of the output stage as JSON
        return fail("output", f"{type(error).__name__}: {error}")


def main() -> None:
    try:
        request = json.loads(sys.stdin.read() or "{}")
        if not isinstance(request, dict):
            raise ValueError("request must be an object")
    except ValueError as error:
        result = fail("input", f"bad request: {error}")
    else:
        try:
            result = build(request)
        except MemoryError:
            result = fail("run", "the script used too much memory")
        except Exception as error:  # noqa: BLE001
            result = fail("run", f"unexpected {type(error).__name__}: {error}")
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()


if __name__ == "__main__":
    main()
