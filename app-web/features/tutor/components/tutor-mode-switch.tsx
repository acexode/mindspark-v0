"use client";

import type { TutorMode } from "@/lib/domain/tutor/fallback";

const MODES: { value: TutorMode; label: string; hint: string }[] = [
  { value: "explain", label: "Explain", hint: "Answers your question directly" },
  { value: "hint", label: "Hint", hint: "Nudges you one step at a time" },
  { value: "check-my-thinking", label: "Check my work", hint: "Tells you where your reasoning goes wrong" },
];

/** How the tutor should respond. A radio group, so arrow keys move between options. */
export function TutorModeSwitch({
  value,
  onChange,
  disabled,
}: {
  value: TutorMode;
  onChange: (mode: TutorMode) => void;
  disabled?: boolean;
}) {
  return (
    <div className="tutor-mode-switch" role="radiogroup" aria-label="How should the tutor respond?">
      {MODES.map((mode) => (
        <label key={mode.value} className={value === mode.value ? "is-active" : ""} title={mode.hint}>
          <input
            type="radio"
            name="tutor-mode"
            value={mode.value}
            checked={value === mode.value}
            disabled={disabled}
            onChange={() => onChange(mode.value)}
          />
          {mode.label}
        </label>
      ))}
    </div>
  );
}
