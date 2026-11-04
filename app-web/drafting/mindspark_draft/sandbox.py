"""Checks and runs a model-written drawing script.

The script is untrusted text from a language model. Two layers keep it harmless:

1. validate() reads the script as a syntax tree and rejects anything outside a small allowlist: no
   imports, no while loops, no names or attributes starting with an underscore, no access to the
   underlying ezdxf document, no str.format. Rejections come back worded for the model so it can fix them.
2. run() executes it with a tiny set of builtins and only the drawing object `d`, `math` and a few
   helpers in scope. The caller (run.py) also runs in its own isolated, time-limited process.
"""

from __future__ import annotations

import ast
import math

from .drawing import Drawing, DraftingError, bearing_to_cad_angle

MAX_SOURCE_CHARS = 20_000
MAX_NODES = 6_000
MAX_RANGE = 5_000

FORBIDDEN_NODES = {
    ast.Import: "imports are not allowed; `d` and `math` are already available",
    ast.ImportFrom: "imports are not allowed; `d` and `math` are already available",
    ast.While: "while loops are not allowed; use `for ... in range(...)`",
    ast.Try: "try/except is not allowed",
    ast.With: "with is not allowed",
    ast.Global: "global is not allowed",
    ast.Nonlocal: "nonlocal is not allowed",
    ast.ClassDef: "classes are not allowed",
    ast.AsyncFunctionDef: "async is not allowed",
    ast.Await: "await is not allowed",
    ast.Yield: "yield is not allowed",
    ast.YieldFrom: "yield is not allowed",
    ast.Lambda: "lambda is not allowed; use def",
    ast.Delete: "del is not allowed",
}

FORBIDDEN_ATTRIBUTES = {
    "format", "format_map", "doc", "msp", "save", "operations", "object_count",
    "mro", "gi_frame", "cr_frame", "f_globals", "f_back", "tb_frame",
}


class ScriptError(Exception):
    """The script was rejected or failed. `line` is the script line, when known."""

    def __init__(self, message: str, line: int | None = None, stage: str = "validate") -> None:
        super().__init__(message)
        self.message = message
        self.line = line
        self.stage = stage


def validate(source: str) -> ast.Module:
    if not isinstance(source, str) or not source.strip():
        raise ScriptError("the script is empty")
    if len(source) > MAX_SOURCE_CHARS:
        raise ScriptError(f"the script is longer than {MAX_SOURCE_CHARS} characters")
    try:
        tree = ast.parse(source, mode="exec")
    except SyntaxError as error:
        raise ScriptError(f"syntax error: {error.msg}", error.lineno) from None

    count = 0
    for node in ast.walk(tree):
        count += 1
        if count > MAX_NODES:
            raise ScriptError("the script is too large; simplify it")
        line = getattr(node, "lineno", None)
        for kind, message in FORBIDDEN_NODES.items():
            if isinstance(node, kind):
                raise ScriptError(message, line)
        if isinstance(node, ast.Name) and node.id.startswith("_"):
            raise ScriptError(f"the name {node.id!r} is not allowed", line)
        if isinstance(node, ast.Attribute):
            if node.attr.startswith("_") or node.attr in FORBIDDEN_ATTRIBUTES:
                raise ScriptError(f"the attribute {node.attr!r} is not allowed", line)
        if isinstance(node, ast.arg) and node.arg.startswith("_"):
            raise ScriptError(f"the name {node.arg!r} is not allowed", line)
        if isinstance(node, ast.Constant) and isinstance(node.value, int) and abs(node.value) > 10**9:
            raise ScriptError("numbers larger than 1,000,000,000 are not allowed", line)
    return tree


def _capped_range(*args: int) -> range:
    r = range(*args)
    if len(r) > MAX_RANGE:
        raise DraftingError(f"range() is limited to {MAX_RANGE} steps")
    return r


def _safe_namespace(drawing: Drawing) -> dict:
    builtins = {
        "abs": abs, "min": min, "max": max, "round": round, "sum": sum, "len": len,
        "int": int, "float": float, "str": str, "list": list, "tuple": tuple, "dict": dict,
        "range": _capped_range, "enumerate": enumerate, "zip": zip, "sorted": sorted,
        "reversed": reversed, "bool": bool, "True": True, "False": False, "None": None,
        "print": lambda *a, **k: None,
    }
    return {
        "__builtins__": builtins,
        "d": drawing,
        "math": math,
        "bearing_to_cad_angle": bearing_to_cad_angle,
    }


def run(source: str, drawing: Drawing) -> None:
    tree = validate(source)
    code = compile(tree, "<drawing script>", "exec")
    namespace = _safe_namespace(drawing)
    try:
        exec(code, namespace)  # noqa: S102 - the tree was allowlisted above and builtins are replaced
    except DraftingError as error:
        raise ScriptError(str(error), _script_line(error), stage="run") from None
    except RecursionError:
        raise ScriptError("the script recursed too deeply", stage="run") from None
    except (NameError, TypeError, ValueError, KeyError, IndexError, AttributeError, ZeroDivisionError, OverflowError) as error:
        raise ScriptError(f"{type(error).__name__}: {error}", _script_line(error), stage="run") from None


def _script_line(error: BaseException) -> int | None:
    tb = error.__traceback__
    line = None
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == "<drawing script>":
            line = tb.tb_lineno
        tb = tb.tb_next
    return line
