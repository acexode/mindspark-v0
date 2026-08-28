import type { MasteryState } from "@/lib/domain/mastery/mastery";

const LABELS: Record<MasteryState, string> = {
  not_started: "Not started",
  exploring: "Exploring",
  developing: "Developing",
  proficient: "Proficient",
  mastered: "Mastered",
};

export function masteryLabel(state: MasteryState): string {
  return LABELS[state];
}

export function MasteryBadge({ state, score }: { state: MasteryState; score?: number }) {
  return (
    <span className={`mastery-badge is-${state.replace("_", "-")}`}>
      {LABELS[state]}
      {typeof score === "number" && state !== "not_started" ? ` · ${score}%` : ""}
    </span>
  );
}

export function MasteryBar({ score, label }: { score: number; label: string }) {
  return (
    <div
      className="mastery-bar"
      role="progressbar"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
    </div>
  );
}
