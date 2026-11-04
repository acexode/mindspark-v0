"use client";

import { useEffect, useMemo, useState } from "react";
import type { DraftingResultData } from "./drafting-types";

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function DraftingResult({ result, script, onScriptChange, onRerun, busy }: {
  result: DraftingResultData;
  script: string;
  onScriptChange: (value: string) => void;
  onRerun: () => void;
  busy: boolean;
}) {
  // An <img> never runs scripts, so the preview is safe even though the drawing contains typed text.
  const previewUrl = useMemo(() => URL.createObjectURL(new Blob([result.svg], { type: "image/svg+xml" })), [result.svg]);
  useEffect(() => () => URL.revokeObjectURL(previewUrl), [previewUrl]);
  const [copied, setCopied] = useState(false);

  return (
    <div className="drafting-result">
      <div className="drafting-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Preview of the generated drawing" />
      </div>
      <div className="drafting-actions">
        <button type="button" className="primary-action" onClick={() => download("mindspark-drawing.dxf", result.dxf, "application/dxf")}>
          Download DXF for AutoCAD
        </button>
        <span className="field-hint">
          {result.summary.entities} objects on {result.summary.layers.length} layers: {result.summary.layers.join(", ")}
        </span>
      </div>
      {result.warnings.length > 0 && (
        <ul className="drafting-warnings">
          {result.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      <details open>
        <summary>Draw it yourself in AutoCAD</summary>
        <p className="field-hint">Type each line at the command line, pressing Enter between items. Click-steps are written out in words.</p>
        <ol className="drafting-commands">
          {result.commands.map((command, index) => (
            <li key={`${index}-${command.what}`}>
              <span>{command.what}</span>
              {command.keys.length > 0 && <code>{command.keys.join("  ")}</code>}
            </li>
          ))}
        </ol>
      </details>

      <details>
        <summary>The Python script</summary>
        <textarea className="drafting-script" value={script} onChange={(e) => onScriptChange(e.target.value)} spellCheck={false} rows={12} aria-label="Python drawing script" />
        <div className="drafting-actions">
          <button type="button" className="secondary-action" onClick={onRerun} disabled={busy}>
            Run edited script
          </button>
          <button
            type="button"
            className="secondary-action"
            onClick={() => {
              void navigator.clipboard?.writeText(script).then(() => setCopied(true));
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied" : "Copy script"}
          </button>
        </div>
      </details>
    </div>
  );
}
