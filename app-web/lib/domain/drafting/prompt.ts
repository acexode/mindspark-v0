/**
 * What the model is told about the drawing library, and how its reply is turned back into a script.
 *
 * The model never writes a drawing file. It writes a short Python script against the small API in
 * drafting/mindspark_draft/drawing.py, and that script is checked and run elsewhere. Keeping the API
 * reference here, as plain text, is what lets a small local model get the calls right.
 */

export const DRAFTING_COURSE_ID = "ug.cve-autocad-drafting";

export interface DraftingSettings {
  units: "mm" | "m";
  /** Drawing scale denominator: 50 means 1:50. */
  scale: number;
}

const API_REFERENCE = `
The object d is already created. Coordinates are (x, y) with (0, 0) at the lower left. Angles are degrees counterclockwise from east.
Layers are created automatically; use these names: WALLS, DOORS, WINDOWS, DIMS, TEXT, HATCH, BOUNDARY, CENTRE, HIDDEN.

d.line(p1, p2, layer="0")
d.polyline(points, closed=False, layer="0")
d.rectangle(p1, p2, layer="0")                  # two opposite corners
d.circle(center, radius, layer="0")
d.arc(center, radius, start_angle, end_angle, layer="0")
d.text(content, position, height=None, rotation=0, layer="TEXT", align="LEFT")   # align: LEFT CENTER RIGHT MIDDLE_LEFT MIDDLE_CENTER MIDDLE_RIGHT
d.dim_linear(p1, p2, offset=None)                # horizontal or vertical; negative offset puts it below / left
d.dim_aligned(p1, p2, offset=None)
d.dim_radius(center, radius, angle=45)
d.dim_diameter(center, radius, angle=45)
d.hatch(points, pattern="ANSI31")               # closed outline as a list of points; patterns: SOLID ANSI31 ANSI32 ANSI37 EARTH AR-CONC AR-SAND BRICK
d.room(origin, width, height, wall=230, doors=[], windows=[])
    # width and height are OUTSIDE sizes. An opening is {"side": "south"|"north"|"west"|"east", "at": distance from the corner, "width": w}
    # (south/north measure "at" from the west corner, west/east from the south corner). Returns {"inner_width", "inner_height", "inner_origin"}.
d.traverse(start, legs, closed=True)
    # legs is a list of (bearing, distance); bearing is in degrees clockwise from north (a surveyor's bearing).
    # It converts to the CAD angle itself. Returns {"points", "misclosure", "area"}.

Also available: math (math.sin, math.cos, math.radians, math.pi, ...), range, len, min, max, abs, round, sum, int, float, str, list, tuple, enumerate, zip, sorted.
`.trim();

const RULES = `
Rules:
- Reply with ONE python code block and nothing else. No imports, no while loops, no functions needed.
- Use only the d.* calls above. Never invent others.
- Work out dimensions yourself and use realistic sizes in the chosen units. A bedroom is about 3500 x 3000 mm; walls are 230 mm; a door is 900 mm wide; a window is 1200 mm wide.
- Put things on the right layers. Dimension the overall sizes with d.dim_linear. Label rooms and the drawing with d.text.
- Keep it simple: a tidy, correct drawing beats a complicated one.
`.trim();

const EXAMPLE = `
Example request: a 4 m by 3 m room with a door on the south wall and a window on the north wall
\`\`\`python
d.room((0, 0), 4000, 3000, wall=230,
       doors=[{"side": "south", "at": 600, "width": 900}],
       windows=[{"side": "north", "at": 1400, "width": 1200}])
d.dim_linear((0, 0), (4000, 0), offset=-600)
d.dim_linear((0, 0), (0, 3000), offset=-600)
d.text("ROOM  3540 x 2540", (2000, 1500), align="MIDDLE_CENTER")
\`\`\`
`.trim();

export function buildDraftingSystemPrompt(settings: DraftingSettings): string {
  return [
    "You write short Python scripts that draw civil engineering drawings with a small drawing library. The script is run for the student, who opens the result in AutoCAD.",
    `Units are ${settings.units === "mm" ? "millimetres" : "metres"}. The drawing will be plotted at 1:${settings.scale}.`,
    "API reference:",
    API_REFERENCE,
    RULES,
    EXAMPLE,
  ].join("\n\n");
}

/** The model's reply as a script: the first fenced block if there is one, otherwise the bare text. */
export function extractScript(reply: string): string {
  const fenced = reply.match(/```(?:python|py)?[ \t]*\r?\n([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const open = reply.match(/```(?:python|py)?[ \t]*\r?\n([\s\S]*)$/i);
  return (open ? open[1] : reply).trim();
}

export interface ScriptFailure {
  stage: string;
  error: string;
  line: number | null;
}

/** What to say to the model when its script was rejected, so the next attempt can fix it. */
export function repairPrompt(script: string, failure: ScriptFailure): string {
  const where = failure.line ? ` on line ${failure.line}` : "";
  return [
    `Your script failed${where}: ${failure.error}`,
    "Here is the script you wrote:",
    "```python",
    script,
    "```",
    "Fix the problem and reply with the complete corrected script in one python code block.",
  ].join("\n");
}
