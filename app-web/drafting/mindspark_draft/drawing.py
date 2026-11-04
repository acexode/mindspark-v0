"""The drawing helper a model-written script is allowed to call.

Everything a script can do goes through this class, which is why the surface is small and every
method validates its arguments: a mistake becomes a DraftingError the model can be shown and asked
to fix, instead of a silently broken drawing.

Each operation also records the AutoCAD keystrokes that would draw the same thing by hand. Those
come from this file, not from a language model, so they are correct by construction and are what
ties the generated drawing back to the AutoCAD course.

Coordinates are in drawing units (millimetres by default), with (0, 0) at the lower left and angles
in degrees counterclockwise from east, exactly as AutoCAD measures them.
"""

from __future__ import annotations

import math
import re
from typing import Iterable, Sequence

import ezdxf
from ezdxf import units as dxf_units
from ezdxf.enums import TextEntityAlignment
from ezdxf.lldxf.const import VALID_DXF_LINEWEIGHTS

Point = Sequence[float]

MAX_ENTITIES = 20_000
UNIT_MM = {"mm": 1.0, "m": 1000.0}
LAYER_NAME = re.compile(r"^[A-Za-z0-9_\-]{1,31}$")

ALIGNMENTS = {
    "LEFT": (TextEntityAlignment.LEFT, None),
    "CENTER": (TextEntityAlignment.CENTER, "C"),
    "RIGHT": (TextEntityAlignment.RIGHT, "R"),
    "MIDDLE_LEFT": (TextEntityAlignment.MIDDLE_LEFT, "ML"),
    "MIDDLE_CENTER": (TextEntityAlignment.MIDDLE_CENTER, "MC"),
    "MIDDLE_RIGHT": (TextEntityAlignment.MIDDLE_RIGHT, "MR"),
}

# Hatch patterns that exist in ezdxf's built-in library, with what each is conventionally used for.
HATCH_PATTERNS = ("SOLID", "ANSI31", "ANSI32", "ANSI37", "EARTH", "AR-CONC", "AR-SAND", "BRICK")

# name -> (AutoCAD colour index, linetype, lineweight in mm). Created on first use, so a script that
# just says layer="WALLS" gets sensible, conventional settings without declaring them.
LAYER_DEFAULTS = {
    "WALLS": (7, "Continuous", 0.50),
    "DOORS": (3, "Continuous", 0.18),
    "WINDOWS": (5, "Continuous", 0.18),
    "DIMS": (3, "Continuous", 0.18),
    "TEXT": (7, "Continuous", 0.18),
    "HATCH": (8, "Continuous", 0.09),
    "BOUNDARY": (7, "Continuous", 0.50),
    "CENTRE": (1, "CENTER", 0.18),
    "HIDDEN": (5, "DASHED", 0.18),
}


class DraftingError(Exception):
    """A problem with how the script used the drawing, worded so it can be shown back to the model."""


def _num(value: float) -> str:
    """A number as it would be typed on the AutoCAD command line."""
    rounded = round(float(value), 4)
    if rounded == int(rounded):
        return str(int(rounded))
    return f"{rounded:.4f}".rstrip("0").rstrip(".")


def _pt(point: Point) -> str:
    return f"{_num(point[0])},{_num(point[1])}"


def _check_point(point: object, name: str = "point") -> tuple[float, float]:
    try:
        x, y = point[0], point[1]  # type: ignore[index]
        x, y = float(x), float(y)
    except (TypeError, ValueError, IndexError, KeyError):
        raise DraftingError(f"{name} must be an (x, y) pair of numbers, not {point!r}") from None
    if not (math.isfinite(x) and math.isfinite(y)):
        raise DraftingError(f"{name} must be finite numbers, not {point!r}")
    return (x, y)


def _positive(value: object, name: str) -> float:
    try:
        number = float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        raise DraftingError(f"{name} must be a number, not {value!r}") from None
    if not (math.isfinite(number) and number > 0):
        raise DraftingError(f"{name} must be greater than zero, not {value!r}")
    return number


def _nearest_lineweight(mm: float) -> int:
    hundredths = int(round(mm * 100))
    return min((w for w in VALID_DXF_LINEWEIGHTS if w >= 0), key=lambda w: abs(w - hundredths))


def bearing_to_cad_angle(bearing: float) -> float:
    """A surveyed bearing (clockwise from north) as the angle AutoCAD wants (counterclockwise from east)."""
    return (90.0 - bearing) % 360.0


class Drawing:
    def __init__(self, units: str = "mm", scale: float = 50) -> None:
        if units not in UNIT_MM:
            raise DraftingError(f'units must be "mm" or "m", not {units!r}')
        self.units = units
        self.scale = _positive(scale, "scale")
        self._mm = UNIT_MM[units]
        self._decimals = 0 if units == "mm" else 2

        self.doc = ezdxf.new("R2010", setup=True)
        self.doc.units = dxf_units.MM if units == "mm" else dxf_units.M
        # The same rule the course teaches: linetype scale follows the drawing scale.
        self.doc.header["$LTSCALE"] = self.scale / self._mm
        self.msp = self.doc.modelspace()

        # Plotted sizes, converted to model space: text 3 mm tall on the sheet is 3 x scale in the model.
        self.text_height = self._plotted(3.0)
        self._dimstyle = self._make_dimstyle()

        self._count = 0
        self._ops: list[dict] = []
        self._known_layers: set[str] = {"0"}

    # ------------------------------------------------------------------ sizing

    def _plotted(self, mm_on_sheet: float) -> float:
        """A size measured on the printed sheet, in drawing units."""
        return mm_on_sheet * self.scale / self._mm

    def _make_dimstyle(self) -> str:
        name = "MS_DIM"
        style = self.doc.dimstyles.new(name)
        style.dxf.dimtxt = self.text_height
        style.dxf.dimasz = self._plotted(2.5)
        style.dxf.dimexe = self._plotted(2.0)
        style.dxf.dimexo = self._plotted(1.5)
        style.dxf.dimgap = self._plotted(1.0)
        style.dxf.dimdle = 0
        style.dxf.dimtad = 1
        style.dxf.dimdec = self._decimals
        style.dxf.dimzin = 8
        return name

    # ------------------------------------------------------------------ bookkeeping

    def _log(self, what: str, *keys: object) -> None:
        self._ops.append({"what": what, "keys": [str(k) for k in keys]})

    def _bump(self, n: int = 1) -> None:
        self._count += n
        if self._count > MAX_ENTITIES:
            raise DraftingError(f"the drawing has more than {MAX_ENTITIES} objects; simplify it")

    def _use_layer(self, name: str) -> str:
        if not isinstance(name, str) or not LAYER_NAME.match(name):
            raise DraftingError(f"layer name {name!r} must be 1-31 letters, digits, - or _")
        name = name.upper()
        if name not in self._known_layers:
            colour, linetype, weight = LAYER_DEFAULTS.get(name, (7, "Continuous", 0.25))
            self._add_layer(name, colour, linetype, weight)
        return name

    def _add_layer(self, name: str, colour: int, linetype: str, weight: float) -> None:
        if linetype not in {lt.dxf.name for lt in self.doc.linetypes}:
            raise DraftingError(f"linetype {linetype!r} is not available; try Continuous, DASHED, CENTER or HIDDEN")
        if name in self.doc.layers:
            layer = self.doc.layers.get(name)
            layer.color, layer.dxf.linetype = colour, linetype
        else:
            layer = self.doc.layers.add(name, color=colour, linetype=linetype)
        layer.dxf.lineweight = _nearest_lineweight(weight)
        self._known_layers.add(name)
        self._log(f"Create the {name} layer", "-LAYER", "M", name, "C", colour, "Enter", "Enter")

    # ------------------------------------------------------------------ layers

    def layer(self, name: str, color: int = 7, linetype: str = "Continuous", lineweight: float = 0.25) -> None:
        """Create or restyle a layer. Colour is an AutoCAD colour index, lineweight is in millimetres."""
        if not isinstance(name, str) or not LAYER_NAME.match(name):
            raise DraftingError(f"layer name {name!r} must be 1-31 letters, digits, - or _")
        if not isinstance(color, int) or not 1 <= color <= 255:
            raise DraftingError("color must be an AutoCAD colour index from 1 to 255")
        self._add_layer(name.upper(), color, linetype, _positive(lineweight, "lineweight"))

    # ------------------------------------------------------------------ geometry

    def line(self, p1: Point, p2: Point, layer: str = "0") -> None:
        a, b = _check_point(p1, "p1"), _check_point(p2, "p2")
        layer = self._use_layer(layer)
        self.msp.add_line(a, b, dxfattribs={"layer": layer})
        self._bump()
        self._log("Draw a line", "LINE", _pt(a), _pt(b), "Enter")

    def polyline(self, points: Iterable[Point], closed: bool = False, layer: str = "0") -> None:
        pts = [_check_point(p, "a polyline point") for p in points]
        if len(pts) < 2:
            raise DraftingError("a polyline needs at least two points")
        layer = self._use_layer(layer)
        self.msp.add_lwpolyline(pts, close=bool(closed), dxfattribs={"layer": layer})
        self._bump()
        end = ["C"] if closed else ["Enter"]
        self._log("Draw a polyline", "PLINE", *[_pt(p) for p in pts], *end)

    def rectangle(self, p1: Point, p2: Point, layer: str = "0") -> None:
        a, b = _check_point(p1, "p1"), _check_point(p2, "p2")
        if a[0] == b[0] or a[1] == b[1]:
            raise DraftingError("a rectangle needs two opposite corners that differ in both x and y")
        layer = self._use_layer(layer)
        x1, x2 = sorted((a[0], b[0]))
        y1, y2 = sorted((a[1], b[1]))
        self.msp.add_lwpolyline([(x1, y1), (x2, y1), (x2, y2), (x1, y2)], close=True, dxfattribs={"layer": layer})
        self._bump()
        self._log("Draw a rectangle", "RECTANG", _pt(a), _pt(b))

    def circle(self, center: Point, radius: float, layer: str = "0") -> None:
        c = _check_point(center, "center")
        r = _positive(radius, "radius")
        layer = self._use_layer(layer)
        self.msp.add_circle(c, r, dxfattribs={"layer": layer})
        self._bump()
        self._log("Draw a circle", "CIRCLE", _pt(c), _num(r))

    def arc(self, center: Point, radius: float, start_angle: float, end_angle: float, layer: str = "0") -> None:
        """An arc drawn counterclockwise from start_angle to end_angle, in degrees."""
        c = _check_point(center, "center")
        r = _positive(radius, "radius")
        try:
            start, end = float(start_angle), float(end_angle)
        except (TypeError, ValueError):
            raise DraftingError("arc angles must be numbers in degrees") from None
        layer = self._use_layer(layer)
        self.msp.add_arc(c, r, start, end, dxfattribs={"layer": layer})
        self._bump()
        start_point = (c[0] + r * math.cos(math.radians(start)), c[1] + r * math.sin(math.radians(start)))
        included = (end - start) % 360.0 or 360.0
        self._log("Draw an arc", "ARC", "C", _pt(c), _pt(start_point), "A", _num(included))

    # ------------------------------------------------------------------ text

    def text(
        self,
        content: str,
        position: Point,
        height: float | None = None,
        rotation: float = 0,
        layer: str = "TEXT",
        align: str = "LEFT",
    ) -> None:
        if not isinstance(content, str) or not content.strip():
            raise DraftingError("text needs some content")
        if len(content) > 200:
            raise DraftingError("text is limited to 200 characters; use several text calls")
        pos = _check_point(position, "position")
        h = _positive(height, "height") if height is not None else self.text_height
        align = align.upper() if isinstance(align, str) else align
        if align not in ALIGNMENTS:
            raise DraftingError(f"align must be one of {', '.join(ALIGNMENTS)}")
        layer = self._use_layer(layer)
        enum, code = ALIGNMENTS[align]
        entity = self.msp.add_text(content, height=h, rotation=float(rotation), dxfattribs={"layer": layer})
        entity.set_placement(pos, align=enum)
        self._bump()
        keys = ["TEXT"] + (["J", code] if code else []) + [_pt(pos), _num(h), _num(rotation), content, "Enter", "Enter"]
        self._log("Write text", *keys)

    # ------------------------------------------------------------------ dimensions

    def _offset(self, offset: float | None) -> float:
        return float(offset) if offset is not None else self.text_height * 4.0

    def dim_linear(self, p1: Point, p2: Point, offset: float | None = None, horizontal: bool | None = None, layer: str = "DIMS") -> None:
        """A horizontal or vertical dimension. Positive offset puts the dimension line above (or to the right of) the points."""
        a, b = _check_point(p1, "p1"), _check_point(p2, "p2")
        if a == b:
            raise DraftingError("a dimension needs two different points")
        layer = self._use_layer(layer)
        off = self._offset(offset)
        if horizontal is None:
            horizontal = abs(b[0] - a[0]) >= abs(b[1] - a[1])
        if horizontal:
            base = ((a[0] + b[0]) / 2, max(a[1], b[1]) + off if off >= 0 else min(a[1], b[1]) + off)
            angle = 0
            location = (_pt(((a[0] + b[0]) / 2, base[1])))
        else:
            base = (max(a[0], b[0]) + off if off >= 0 else min(a[0], b[0]) + off, (a[1] + b[1]) / 2)
            angle = 90
            location = _pt((base[0], (a[1] + b[1]) / 2))
        dim = self.msp.add_linear_dim(base=base, p1=a, p2=b, angle=angle, dimstyle=self._dimstyle, dxfattribs={"layer": layer})
        dim.render()
        self._bump()
        self._log("Add a linear dimension", "DIMLINEAR", _pt(a), _pt(b), location)

    def dim_aligned(self, p1: Point, p2: Point, offset: float | None = None, layer: str = "DIMS") -> None:
        """A dimension parallel to the line between the two points."""
        a, b = _check_point(p1, "p1"), _check_point(p2, "p2")
        if a == b:
            raise DraftingError("a dimension needs two different points")
        layer = self._use_layer(layer)
        off = self._offset(offset)
        dim = self.msp.add_aligned_dim(p1=a, p2=b, distance=off, dimstyle=self._dimstyle, dxfattribs={"layer": layer})
        dim.render()
        self._bump()
        length = math.hypot(b[0] - a[0], b[1] - a[1]) or 1.0
        nx, ny = (a[1] - b[1]) / length, (b[0] - a[0]) / length
        mid = ((a[0] + b[0]) / 2 + nx * off, (a[1] + b[1]) / 2 + ny * off)
        self._log("Add an aligned dimension", "DIMALIGNED", _pt(a), _pt(b), _pt(mid))

    def dim_radius(self, center: Point, radius: float, angle: float = 45, layer: str = "DIMS") -> None:
        c = _check_point(center, "center")
        r = _positive(radius, "radius")
        layer = self._use_layer(layer)
        dim = self.msp.add_radius_dim(center=c, radius=r, angle=float(angle), dimstyle=self._dimstyle, dxfattribs={"layer": layer})
        dim.render()
        self._bump()
        self._log("Dimension a radius", "DIMRADIUS", "click the circle or arc", "click where the dimension should sit")

    def dim_diameter(self, center: Point, radius: float, angle: float = 45, layer: str = "DIMS") -> None:
        c = _check_point(center, "center")
        r = _positive(radius, "radius")
        layer = self._use_layer(layer)
        dim = self.msp.add_diameter_dim(center=c, radius=r, angle=float(angle), dimstyle=self._dimstyle, dxfattribs={"layer": layer})
        dim.render()
        self._bump()
        self._log("Dimension a diameter", "DIMDIAMETER", "click the circle", "click where the dimension should sit")

    # ------------------------------------------------------------------ hatching

    def hatch(self, points: Iterable[Point], pattern: str = "ANSI31", scale: float | None = None, layer: str = "HATCH") -> None:
        """Fill a closed outline, given as a list of corner points, with a pattern."""
        pts = [_check_point(p, "a hatch point") for p in points]
        if len(pts) < 3:
            raise DraftingError("a hatch needs at least three corner points")
        pattern = pattern.upper() if isinstance(pattern, str) else pattern
        if pattern not in HATCH_PATTERNS:
            raise DraftingError(f"pattern must be one of {', '.join(HATCH_PATTERNS)}")
        layer = self._use_layer(layer)
        pattern_scale = _positive(scale, "scale") if scale is not None else self.scale / self._mm
        hatch = self.msp.add_hatch(color=256, dxfattribs={"layer": layer})
        if pattern == "SOLID":
            hatch.set_solid_fill()
        else:
            hatch.set_pattern_fill(pattern, scale=pattern_scale)
        hatch.paths.add_polyline_path(pts, is_closed=True)
        self._bump()
        inside = (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))
        self._log("Hatch the area", "HATCH", f"choose the {pattern} pattern", f"set the scale to {_num(pattern_scale)}", f"click inside the outline near {_pt(inside)}", "Enter")

    # ------------------------------------------------------------------ civil composites

    def room(
        self,
        origin: Point,
        width: float,
        height: float,
        wall: float = 230,
        doors: Sequence[dict] | None = None,
        windows: Sequence[dict] | None = None,
    ) -> dict:
        """A rectangular room with walls, door openings (with swings) and window openings.

        width and height are the OUTSIDE dimensions. Each opening is a dict with:
          side:  "south", "north", "west" or "east"
          at:    distance along that side from the outside corner (south/north measure from the west,
                 west/east measure from the south) to where the opening starts
          width: the opening width
        Returns the inside dimensions as {"inner_width", "inner_height", "inner_origin"}.
        """
        o = _check_point(origin, "origin")
        w_out, h_out, t = _positive(width, "width"), _positive(height, "height"), _positive(wall, "wall")
        if 2 * t >= min(w_out, h_out):
            raise DraftingError("the walls are too thick for a room this small")
        x0, y0, x1, y1 = o[0], o[1], o[0] + w_out, o[1] + h_out

        # Each side: (axis, span the wall runs along, fixed band across, direction into the room)
        sides = {
            "south": ("x", (x0, x1), (y0, y0 + t)),
            "north": ("x", (x0, x1), (y1 - t, y1)),
            "west": ("y", (y0 + t, y1 - t), (x0, x0 + t)),
            "east": ("y", (y0 + t, y1 - t), (x1 - t, x1)),
        }
        openings: dict[str, list[tuple[float, float, str]]] = {k: [] for k in sides}
        for kind, items in (("door", doors or []), ("window", windows or [])):
            for item in items:
                if not isinstance(item, dict) or item.get("side") not in sides:
                    raise DraftingError('each opening needs side: "south", "north", "west" or "east"')
                span = sides[item["side"]][1]
                along0 = (x0 if sides[item["side"]][0] == "x" else y0) + _positive(item.get("at", 0) + 1e-9, "at")
                width_o = _positive(item.get("width"), "opening width")
                if along0 < span[0] - 1e-6 or along0 + width_o > span[1] + 1e-6:
                    raise DraftingError(f"a {kind} on the {item['side']} wall does not fit between the corners")
                openings[item["side"]].append((along0, along0 + width_o, kind))

        self._log(f"Set up the room walls: outside {_num(w_out)} x {_num(h_out)}, walls {_num(t)} thick")
        self._log("Draw the outside of the walls", "RECTANG", _pt((x0, y0)), _pt((x1, y1)))
        self._log("Offset it inwards to make the inside face", "OFFSET", _num(t), "click the rectangle", "click inside it", "Enter")

        for side, (axis, span, band) in sides.items():
            cuts = sorted(openings[side])
            for (a0, a1, _k), (b0, b1, _k2) in zip(cuts, cuts[1:]):
                if b0 < a1 - 1e-6:
                    raise DraftingError(f"two openings overlap on the {side} wall")
            cursor = span[0]
            pieces = []
            for a0, a1, _kind in cuts:
                if a0 > cursor + 1e-6:
                    pieces.append((cursor, a0))
                cursor = a1
            if cursor < span[1] - 1e-6:
                pieces.append((cursor, span[1]))
            for lo, hi in pieces:
                corners = [(lo, band[0]), (hi, band[0]), (hi, band[1]), (lo, band[1])] if axis == "x" else [(band[0], lo), (band[1], lo), (band[1], hi), (band[0], hi)]
                layer = self._use_layer("WALLS")
                self.msp.add_lwpolyline(corners, close=True, dxfattribs={"layer": layer})
                self._bump()
            for a0, a1, kind in cuts:
                (self._door if kind == "door" else self._window)(side, axis, band, a0, a1 - a0)
                label = "door" if kind == "door" else "window"
                if axis == "x":
                    cut_a, cut_b = (_pt((a0, band[0])), _pt((a0, band[1]))), (_pt((a1, band[0])), _pt((a1, band[1])))
                else:
                    cut_a, cut_b = (_pt((band[0], a0)), _pt((band[1], a0))), (_pt((band[0], a1)), _pt((band[1], a1)))
                self._log(f"Open the {side} wall for a {label}", "LINE", *cut_a, "Enter", "LINE", *cut_b, "Enter", "TRIM", "select both lines", "Enter", "click the wall between them", "Enter")

        return {"inner_width": w_out - 2 * t, "inner_height": h_out - 2 * t, "inner_origin": (x0 + t, y0 + t)}

    def _door(self, side: str, axis: str, band: tuple[float, float], start: float, width: float) -> None:
        layer = self._use_layer("DOORS")
        lo, hi = band
        # The leaf is hinged at the start of the opening on the inside face and swings into the room.
        hinge, leaf_end, arc_from, arc_to = {
            "south": ((start, hi), (start, hi + width), 0.0, 90.0),
            "north": ((start, lo), (start, lo - width), 270.0, 360.0),
            "west": ((hi, start), (hi + width, start), 0.0, 90.0),
            "east": ((lo, start), (lo - width, start), 90.0, 180.0),
        }[side]
        if axis == "y":
            hinge = (hinge[0], hinge[1])
        self.msp.add_line(hinge, leaf_end, dxfattribs={"layer": layer})
        self.msp.add_arc(hinge, width, arc_from, arc_to, dxfattribs={"layer": layer})
        self._bump(2)
        arc_start = (hinge[0] + width * math.cos(math.radians(arc_from)), hinge[1] + width * math.sin(math.radians(arc_from)))
        self._log("Draw the door leaf and its swing", "LINE", _pt(hinge), _pt(leaf_end), "Enter", "ARC", "C", _pt(hinge), _pt(arc_start), "A", "90")

    def _window(self, side: str, axis: str, band: tuple[float, float], start: float, width: float) -> None:
        layer = self._use_layer("WINDOWS")
        lo, hi = band
        for offset in (lo, (lo + hi) / 2, hi):
            if axis == "x":
                self.msp.add_line((start, offset), (start + width, offset), dxfattribs={"layer": layer})
            else:
                self.msp.add_line((offset, start), (offset, start + width), dxfattribs={"layer": layer})
        self._bump(3)
        self._log("Draw the window lines across the opening (three lines through the wall thickness)", "LINE", "...", "Enter")

    # ------------------------------------------------------------------ surveying

    def traverse(self, start: Point, legs: Sequence[Sequence[float]], closed: bool = True, layer: str = "BOUNDARY", label: bool = True) -> dict:
        """A site boundary from surveyed legs.

        Each leg is (bearing, distance): the bearing in degrees clockwise from north and the distance in
        drawing units. The bearing is converted to AutoCAD's angle for you (90 - bearing).
        Returns {"points", "misclosure", "area"}.
        """
        s = _check_point(start, "start")
        if not legs:
            raise DraftingError("a traverse needs at least one leg")
        points = [s]
        steps = []
        for index, leg in enumerate(legs, 1):
            try:
                bearing, distance = float(leg[0]), float(leg[1])
            except (TypeError, ValueError, IndexError):
                raise DraftingError(f"leg {index} must be (bearing, distance) numbers") from None
            if not (math.isfinite(bearing) and math.isfinite(distance) and distance > 0):
                raise DraftingError(f"leg {index} needs a positive distance")
            angle = bearing_to_cad_angle(bearing)
            x, y = points[-1]
            points.append((x + distance * math.cos(math.radians(angle)), y + distance * math.sin(math.radians(angle))))
            steps.append((bearing, angle, distance))

        misclosure = math.hypot(points[-1][0] - s[0], points[-1][1] - s[1])
        tolerance = 1e-6 * max(1.0, sum(d for _b, _a, d in steps))
        is_closed = bool(closed) and misclosure <= max(tolerance, 1e-3)
        drawn = points[:-1] if is_closed else points
        layer = self._use_layer(layer)
        self.msp.add_lwpolyline(drawn, close=is_closed, dxfattribs={"layer": layer})
        self._bump()

        keys: list[object] = ["LINE", _pt(s)]
        for bearing, angle, distance in steps:
            keys.append(f"@{_num(distance)}<{_num(angle)}")
        keys.append("C" if is_closed else "Enter")
        conversion = "; ".join(f"bearing {_num(b)} gives angle {_num(a)}" for b, a, _d in steps)
        self._log(f"Draw the boundary. AutoCAD angle = 90 - bearing (plus 360 if negative): {conversion}", *keys)

        if label:
            for index, ((bearing, _angle, distance), p0, p1) in enumerate(zip(steps, points, points[1:]), 1):
                mid = ((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2)
                self.text(f"{_num(bearing)} deg  {_num(distance)}", mid, layer="TEXT", align="MIDDLE_CENTER")

        area = 0.0
        ring = points[:-1] if misclosure <= max(tolerance, 1e-3) else points
        for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
            area += x1 * y2 - x2 * y1
        return {"points": [(round(x, 6), round(y, 6)) for x, y in points], "misclosure": misclosure, "area": abs(area) / 2.0}

    # ------------------------------------------------------------------ output (used by the runner, not by scripts)

    @property
    def object_count(self) -> int:
        return self._count

    def operations(self) -> list[dict]:
        return list(self._ops)

    def save(self, path: str) -> None:
        self.doc.saveas(path)
