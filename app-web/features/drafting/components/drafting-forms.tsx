"use client";

import { useState } from "react";
import type { DraftingTab } from "./drafting-types";

export interface OpeningDraft {
  side: "south" | "north" | "west" | "east";
  at: number;
  width: number;
}

export type DraftingPayload = Record<string, unknown>;

const num = (value: string, fallback: number) => (value.trim() === "" || Number.isNaN(Number(value)) ? fallback : Number(value));

export function DescribeForm({ onSubmit, busy }: { onSubmit: (p: DraftingPayload) => void; busy: boolean }) {
  const [prompt, setPrompt] = useState("A 4 m by 3 m bedroom with a door on the south wall and a window on the north wall");
  return (
    <form className="field-group" onSubmit={(e) => { e.preventDefault(); onSubmit({ kind: "describe", prompt }); }}>
      <label>
        Describe the drawing
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} maxLength={1000} />
      </label>
      <p className="field-hint">The tutor model writes a short script, the app checks and runs it. Needs Ollama running, or an OpenAI key.</p>
      <button className="primary-action" disabled={busy || prompt.trim().length < 3}>{busy ? "Drawing…" : "Generate drawing"}</button>
    </form>
  );
}

export function RoomForm({ onSubmit, busy }: { onSubmit: (p: DraftingPayload) => void; busy: boolean }) {
  const [v, setV] = useState({ width: "4000", height: "3000", wall: "230", doorAt: "600", doorWidth: "900", windowAt: "1400", windowWidth: "1200", label: "BEDROOM" });
  const set = (key: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [key]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const doors: OpeningDraft[] = [{ side: "south", at: num(v.doorAt, 600), width: num(v.doorWidth, 900) }];
    const windows: OpeningDraft[] = [{ side: "north", at: num(v.windowAt, 1400), width: num(v.windowWidth, 1200) }];
    onSubmit({ kind: "room", width: num(v.width, 4000), height: num(v.height, 3000), wall: num(v.wall, 230), doors, windows, label: v.label });
  };
  return (
    <form className="field-group drafting-grid" onSubmit={submit}>
      <label>Outside width (mm)<input inputMode="decimal" value={v.width} onChange={set("width")} /></label>
      <label>Outside depth (mm)<input inputMode="decimal" value={v.height} onChange={set("height")} /></label>
      <label>Wall thickness (mm)<input inputMode="decimal" value={v.wall} onChange={set("wall")} /></label>
      <label>Room label<input value={v.label} onChange={set("label")} maxLength={60} /></label>
      <label>Door position on south wall (mm)<input inputMode="decimal" value={v.doorAt} onChange={set("doorAt")} /></label>
      <label>Door width (mm)<input inputMode="decimal" value={v.doorWidth} onChange={set("doorWidth")} /></label>
      <label>Window position on north wall (mm)<input inputMode="decimal" value={v.windowAt} onChange={set("windowAt")} /></label>
      <label>Window width (mm)<input inputMode="decimal" value={v.windowWidth} onChange={set("windowWidth")} /></label>
      <button className="primary-action" disabled={busy}>{busy ? "Drawing…" : "Draw the room"}</button>
    </form>
  );
}

export function TraverseForm({ onSubmit, busy }: { onSubmit: (p: DraftingPayload) => void; busy: boolean }) {
  const [text, setText] = useState("0, 50\n90, 40\n180, 50\n270, 40");
  const [error, setError] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const legs = text.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => l.split(/[,\s]+/).map(Number));
    if (legs.length < 2 || legs.some((l) => l.length !== 2 || l.some((n) => !Number.isFinite(n)) || l[0] < 0 || l[0] > 360 || l[1] <= 0)) {
      setError("Enter at least two lines, each as: bearing, distance (bearing 0 to 360, distance above 0).");
      return;
    }
    setError(null);
    onSubmit({ kind: "traverse", legs: legs.map(([bearing, distance]) => ({ bearing, distance })), units: "m", scale: 500, closed: true });
  };
  return (
    <form className="field-group" onSubmit={submit}>
      <label>
        Survey legs, one per line: whole-circle bearing (°), distance (m)
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} spellCheck={false} />
      </label>
      <p className="field-hint">Bearings are measured clockwise from north. The drawing converts them to AutoCAD angles (90 − bearing) for you, and reports the misclosure and area.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-action" disabled={busy}>{busy ? "Drawing…" : "Plot the traverse"}</button>
    </form>
  );
}

export const TABS: { id: DraftingTab; label: string }[] = [
  { id: "describe", label: "Describe it" },
  { id: "room", label: "Room plan" },
  { id: "traverse", label: "Site traverse" },
];
