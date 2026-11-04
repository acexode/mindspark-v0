# Drafting studio (Python side)

Turns a short Python script into a DXF file that AutoCAD opens. The model writes the script; nothing
here trusts it (see `mindspark_draft/sandbox.py`).

## Set up on a student's PC (once)

1. Install Python 3.9 or newer from https://www.python.org/downloads/ . On Windows tick **Add python.exe to PATH**.
2. In the app folder run `npm run drafting:setup`. It creates a private environment in `drafting/.venv`
   and installs `ezdxf` and `pillow` into it. Your system Python is not touched.
3. Restart the app and open **Drafting** (shown to students enrolled in CVE107).

Use `DRAFTING_PYTHON=<path to python>` to point at a specific interpreter.

## Tests

`npm run drafting:test`.

## Layout

- `mindspark_draft/drawing.py` – the `Drawing` API scripts call, plus the AutoCAD command log.
- `mindspark_draft/sandbox.py` – allowlist validator and restricted runner.
- `mindspark_draft/output.py` – saves, re-reads and audits the DXF; builds the SVG preview.
- `run.py` – JSON-in, JSON-out entry point the app spawns (`python -I run.py`).
