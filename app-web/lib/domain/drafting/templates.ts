/**
 * Scripts for the two drawings a first-year student draws most, built without a language model.
 *
 * Every value is validated as a finite number before it is written into the script, so a template can
 * never carry anything but numbers into the generated code.
 */

export interface OpeningInput {
  side: "south" | "north" | "west" | "east";
  at: number;
  width: number;
}

export interface RoomTemplate {
  width: number;
  height: number;
  wall: number;
  doors: OpeningInput[];
  windows: OpeningInput[];
  label?: string;
}

export interface TraverseTemplate {
  startX: number;
  startY: number;
  legs: { bearing: number; distance: number }[];
  closed: boolean;
}

const SIDES = new Set(["south", "north", "west", "east"]);

function n(value: number): string {
  if (!Number.isFinite(value)) throw new Error("template values must be finite numbers");
  return String(Math.round(value * 10_000) / 10_000);
}

function opening(o: OpeningInput): string {
  if (!SIDES.has(o.side)) throw new Error("unknown wall side");
  return `{"side": "${o.side}", "at": ${n(o.at)}, "width": ${n(o.width)}}`;
}

/** Strips anything that is not a plain label character, so the text can sit inside a string literal. */
function safeLabel(label: string): string {
  return label.replace(/[^A-Za-z0-9 .,x\-/()]/g, "").slice(0, 60);
}

export function roomPlanScript(t: RoomTemplate): string {
  const lines = [
    `info = d.room((0, 0), ${n(t.width)}, ${n(t.height)}, wall=${n(t.wall)},`,
    `              doors=[${t.doors.map(opening).join(", ")}],`,
    `              windows=[${t.windows.map(opening).join(", ")}])`,
    `d.dim_linear((0, 0), (${n(t.width)}, 0), offset=-${n(Math.max(t.width, t.height) * 0.15)})`,
    `d.dim_linear((0, 0), (0, ${n(t.height)}), offset=-${n(Math.max(t.width, t.height) * 0.15)})`,
  ];
  const label = safeLabel(t.label ?? "ROOM");
  lines.push(
    `d.text("${label}", (${n(t.width / 2)}, ${n(t.height / 2 + t.height * 0.05)}), align="MIDDLE_CENTER")`,
    `d.text("Inside: " + str(round(info["inner_width"])) + " x " + str(round(info["inner_height"])), (${n(t.width / 2)}, ${n(t.height / 2 - t.height * 0.05)}), align="MIDDLE_CENTER")`,
  );
  return lines.join("\n");
}

export function traverseScript(t: TraverseTemplate): string {
  if (t.legs.length === 0) throw new Error("a traverse needs at least one leg");
  const legs = t.legs.map((leg) => `(${n(leg.bearing)}, ${n(leg.distance)})`).join(", ");
  return [
    `result = d.traverse((${n(t.startX)}, ${n(t.startY)}), [${legs}], closed=${t.closed ? "True" : "False"})`,
    `p = result["points"][0]`,
    `d.text("Area " + str(round(result["area"], 2)) + "   Misclosure " + str(round(result["misclosure"], 3)), (p[0], p[1] - 3 * d.text_height * 2))`,
  ].join("\n");
}
