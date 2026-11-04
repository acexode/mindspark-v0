"""Turns a finished Drawing into what the app needs: DXF text, an SVG preview, a summary and warnings.

The DXF is saved, read back from disk and audited, so a file that AutoCAD would complain about is
reported here rather than discovered by the student.
"""

from __future__ import annotations

import os
import tempfile
from collections import Counter

import ezdxf
from ezdxf import bbox
from ezdxf.addons.drawing import Frontend, RenderContext, layout
from ezdxf.addons.drawing.config import BackgroundPolicy, ColorPolicy, Configuration, LineweightPolicy
from ezdxf.addons.drawing.svg import SVGBackend

from .drawing import Drawing

MAX_DXF_BYTES = 8 * 1024 * 1024


def render_svg(doc: ezdxf.document.Drawing) -> str:
    backend = SVGBackend()
    # Black linework on white, like a printed sheet, whatever colours the layers carry in AutoCAD.
    config = Configuration(background_policy=BackgroundPolicy.WHITE, color_policy=ColorPolicy.BLACK, lineweight_policy=LineweightPolicy.ABSOLUTE)
    Frontend(RenderContext(doc), backend, config=config).draw_layout(doc.modelspace())
    # A sheet-sized page, shaped like the drawing, so line weights (in mm) look like a printed sheet.
    extent = bbox.extents(doc.modelspace())
    long_side = 297.0
    ratio = (extent.size.y / extent.size.x) if extent.has_data and extent.size.x > 0 else 0.7
    width, height = (long_side, long_side * ratio) if ratio <= 1 else (long_side / ratio, long_side)
    page = layout.Page(max(width, 60), max(height, 60), layout.Units.mm, margins=layout.Margins.all(8))
    settings = layout.Settings(
        fit_page=True,
        page_alignment=layout.PageAlignment.MIDDLE_CENTER,
        min_stroke_width=0.2,
        max_stroke_width=0.8,
        fixed_stroke_width=0.35,
    )
    return backend.get_string(page, settings=settings)


def render(drawing: Drawing) -> dict:
    with tempfile.TemporaryDirectory() as folder:
        path = os.path.join(folder, "drawing.dxf")
        drawing.save(path)
        if os.path.getsize(path) > MAX_DXF_BYTES:
            raise ValueError("the drawing file is too large; simplify the drawing")
        with open(path, "r", encoding="cp1252", errors="replace") as handle:
            dxf_text = handle.read()
        reread = ezdxf.readfile(path)

    auditor = reread.audit()
    if auditor.has_errors:
        messages = "; ".join(e.message for e in auditor.errors[:3])
        raise ValueError(f"the generated file failed the DXF audit: {messages}")

    msp = reread.modelspace()
    kinds = Counter(entity.dxftype() for entity in msp)
    extent = bbox.extents(msp)
    warnings: list[str] = []
    size = None
    if extent.has_data:
        size = {
            "min": [round(extent.extmin.x, 3), round(extent.extmin.y, 3)],
            "max": [round(extent.extmax.x, 3), round(extent.extmax.y, 3)],
            "width": round(extent.size.x, 3),
            "height": round(extent.size.y, 3),
        }
        mm = drawing.units == "mm"
        longest = max(extent.size.x, extent.size.y)
        if longest * (1.0 if mm else 1000.0) / drawing.scale > 1189:
            warnings.append(f"at 1:{drawing.scale:g} this is larger than an A0 sheet; choose a larger scale number such as 1:{drawing.scale * 2:g}")
    if "TEXT" not in kinds and "MTEXT" not in kinds:
        warnings.append("the drawing has no text labels")
    if not any(k.startswith("DIMENSION") for k in kinds):
        warnings.append("the drawing has no dimensions")

    return {
        "ok": True,
        "dxf": dxf_text,
        "svg": render_svg(reread),
        "summary": {
            "entities": sum(kinds.values()),
            "byType": dict(sorted(kinds.items())),
            "layers": sorted(layer.dxf.name for layer in reread.layers if layer.dxf.name not in ("0", "Defpoints")),
            "extents": size,
            "units": drawing.units,
            "scale": drawing.scale,
        },
        "commands": drawing.operations(),
        "warnings": warnings,
    }
