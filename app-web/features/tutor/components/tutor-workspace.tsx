"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AskTutorPanel } from "./ask-tutor-panel";
import { useTutorLevel, type TutorChip } from "./tutor-tone";
import { TutorUnitPicker, type TutorSubjectGroup, type TutorUnit } from "./tutor-unit-picker";

interface TutorWorkspaceProps {
  subjects: TutorSubjectGroup[];
  initialUnitId: string;
}

function locate(subjects: TutorSubjectGroup[], unitId: string) {
  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const unit = topic.units.find((u) => u.id === unitId);
      if (unit) return { subject, topic, unit };
    }
  }
  return null;
}

/** The full-page tutor: what the tutor is working from on the left, the conversation as a notebook page on the right. */
export function TutorWorkspace({ subjects, initialUnitId }: TutorWorkspaceProps) {
  const router = useRouter();
  const level = useTutorLevel();
  const casual = level !== "undergraduate";
  const unitNoun = casual ? "topic" : "unit";
  const [unitId, setUnitId] = useState(initialUnitId);
  const located = useMemo(() => locate(subjects, unitId) ?? locate(subjects, initialUnitId), [subjects, unitId, initialUnitId]);

  if (!located) return null;
  const { subject, topic, unit } = located;

  function select(id: string) {
    setUnitId(id);
    // The URL is the source of truth, so a refresh or shared link keeps the same unit.
    router.replace(`/tutor?subtopic=${encodeURIComponent(id)}` as Route, { scroll: false });
  }

  return (
    <div className="tutor-workspace" style={{ ["--accent" as string]: subject.accent }}>
      <aside className="tutor-rail" aria-label="What the tutor is working from">
        <section className="tutor-context">
          <p className="card-kicker">
            {subject.label} · {topic.name}
          </p>
          <h2>{unit.name}</h2>
          {unit.objectives.length > 0 && (
            <>
              <p className="tutor-rail-title">The tutor is working from</p>
              <ul className="tutor-objectives">
                {unit.objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </>
          )}
          <div className="tutor-context-links">
            {unit.lessonHref && <Link href={unit.lessonHref as Route}>Open lesson</Link>}
            {unit.practiceHref && <Link href={unit.practiceHref as Route}>Practise</Link>}
          </div>
        </section>

        <TutorUnitPicker subjects={subjects} activeUnitId={unit.id} onSelect={select} unitNoun={unitNoun} />
      </aside>

      <section className="tutor-notebook" aria-labelledby="tutor-notebook-title">
        <header className="tutor-notebook-head">
          <span className="eyebrow">Tutor</span>
          <h1 id="tutor-notebook-title">{unit.name}</h1>
        </header>
        <AskTutorPanel
          key={unit.id}
          variant="page"
          scope={{ subjectName: subject.name, subtopicId: unit.id, surface: "lesson" }}
          renderEmpty={(ask) => <TutorStarters unit={unit} casual={casual} onAsk={ask} />}
        />
      </section>
    </div>
  );
}

/** Starters come from the unit's own objectives, so the first question is specific rather than "how can I help?". */
function TutorStarters({ unit, casual, onAsk }: { unit: TutorUnit; casual: boolean; onAsk: (chip: TutorChip) => void }) {
  const starters: TutorChip[] = [
    ...unit.objectives.slice(0, 3).map((objective) => ({
      label: objective,
      prompt: `Help me understand this: ${objective}`,
      mode: "explain" as const,
    })),
    { label: casual ? "Quiz me on this 🎯" : "Test me on this unit", prompt: "Ask me one question to check I understand.", mode: "hint", quiz: true },
  ];

  return (
    <div className="tutor-starters">
      <p className="tutor-starters-title">{casual ? "What's tripping you up?" : "Where would you like to start?"}</p>
      <p className="tutor-starters-sub">
        {casual
          ? "Pick one to start, or type your own question below."
          : "Choose a learning objective, or ask your own question."}
      </p>
      <ul>
        {starters.map((starter) => (
          <li key={starter.label}>
            <button type="button" onClick={() => onAsk(starter)}>
              <span className="tutor-starter-kind">{starter.quiz ? "Practice" : "Explain"}</span>
              {starter.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
