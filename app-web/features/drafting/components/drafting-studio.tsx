"use client";

import { useState } from "react";
import { DescribeForm, RoomForm, TABS, TraverseForm, type DraftingPayload } from "./drafting-forms";
import { DraftingResult } from "./drafting-result";
import { DraftingSetupNote } from "./drafting-setup-note";
import type { DraftingResponse, DraftingTab } from "./drafting-types";

const SOURCE_LABEL: Record<string, string> = { ollama: "the local model", ai: "the online model", template: "a template", script: "your edited script" };

export function DraftingStudio({ status }: { status: { ready: boolean; problem: "no-python" | "no-ezdxf" | null } }) {
  const [tab, setTab] = useState<DraftingTab>("room");
  const [busy, setBusy] = useState(false);
  const [response, setResponse] = useState<DraftingResponse | null>(null);
  const [script, setScript] = useState("");
  const [units, setUnits] = useState<"mm" | "m">("mm");
  const [scale, setScale] = useState(50);

  if (!status.ready) return <DraftingSetupNote problem={status.problem} />;

  async function send(payload: DraftingPayload) {
    setBusy(true);
    try {
      const res = await fetch("/api/v1/drafting", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ units, scale, ...payload }),
      });
      const data = (await res.json()) as DraftingResponse;
      setResponse(data);
      if (data.script) setScript(data.script);
    } catch {
      setResponse({ ok: false, error: "Could not reach the app. Is it still running?" });
    } finally {
      setBusy(false);
    }
  }

  const submit = (payload: DraftingPayload) => send(payload.kind === "traverse" ? { ...payload, units: "m", scale: 500 } : payload);

  return (
    <div className="drafting-studio">
      <div className="chip-row" role="tablist" aria-label="How to make the drawing">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "chip is-selected" : "chip"} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab !== "traverse" && (
        <div className="drafting-settings">
          <label>Units
            <select value={units} onChange={(e) => setUnits(e.target.value as "mm" | "m")}>
              <option value="mm">millimetres</option>
              <option value="m">metres</option>
            </select>
          </label>
          <label>Plot scale 1:
            <select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
              {[1, 5, 10, 20, 50, 100, 200, 500].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
      )}

      {tab === "describe" && <DescribeForm onSubmit={submit} busy={busy} />}
      {tab === "room" && <RoomForm onSubmit={submit} busy={busy} />}
      {tab === "traverse" && <TraverseForm onSubmit={submit} busy={busy} />}

      {response && !response.ok && (
        <div className="form-error drafting-error" role="alert">
          <strong>The drawing could not be made.</strong> {response.error}
          {response.line ? ` (script line ${response.line})` : ""}
        </div>
      )}
      {response?.ok && response.result && (
        <>
          <p className="field-hint drafting-source">
            Made by {SOURCE_LABEL[response.source ?? ""] ?? "the app"}
            {response.attempts && response.attempts > 1 ? ` after ${response.attempts} tries` : ""}. Always check a generated drawing against your own working before you rely on it.
          </p>
          <DraftingResult
            result={response.result}
            script={script}
            onScriptChange={setScript}
            onRerun={() => void send({ kind: "script", script })}
            busy={busy}
          />
        </>
      )}
    </div>
  );
}
