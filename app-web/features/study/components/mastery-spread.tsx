import type { MasteryState } from "@/lib/domain/mastery/mastery";
import { masteryLabel } from "@/components/ui/mastery-badge";

/** Strongest first, so the bar fills from the left as the student improves. */
const BANDS: MasteryState[] = ["mastered", "proficient", "developing", "exploring", "not_started"];

/**
 * How a subject's subtopics are spread across mastery bands. More honest than one average:
 * "2 mastered, 30 not started" says far more than "6% mastery".
 */
export function MasterySpread({ distribution, label }: { distribution: Record<MasteryState, number>; label: string }) {
  const total = BANDS.reduce((sum, band) => sum + distribution[band], 0);
  if (total === 0) return null;
  const summary = BANDS.filter((b) => distribution[b] > 0)
    .map((b) => `${distribution[b]} ${masteryLabel(b).toLowerCase()}`)
    .join(", ");

  return (
    <div className="mastery-spread">
      <div className="mastery-spread-bar" role="img" aria-label={`${label}: ${summary}`}>
        {BANDS.map((band) =>
          distribution[band] > 0 ? (
            <span key={band} className={`is-${band.replace("_", "-")}`} style={{ flexGrow: distribution[band] }} />
          ) : null,
        )}
      </div>
      <ul className="mastery-spread-legend" aria-hidden>
        {BANDS.filter((b) => distribution[b] > 0).map((band) => (
          <li key={band} className={`is-${band.replace("_", "-")}`}>
            <strong>{distribution[band]}</strong> {masteryLabel(band)}
          </li>
        ))}
      </ul>
    </div>
  );
}
