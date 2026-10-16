"use client";

import { useEffect, useRef, useState } from "react";
import type { TutorMode } from "@/lib/domain/tutor/fallback";
import { AskTutorPanel, type AskTutorScope } from "./ask-tutor-panel";
import { chipsFor, useTutorLevel } from "./tutor-tone";

interface LessonTutorProps {
  scope: Omit<AskTutorScope, "surface" | "question">;
  heading: string;
  fullTutorHref?: string;
}

interface Launch {
  /** Changes on every open so a chip tapped twice re-sends. */
  key: number;
  prompt?: string;
  mode?: TutorMode;
  quiz?: boolean;
}

/**
 * One chat, two doors: a floating pill and an inline "stuck?" card both open the
 * same drawer, so there is a single conversation per page. A native <dialog>
 * gives focus trapping and Esc-to-close without custom code.
 */
export function LessonTutor({ scope, heading, fullTutorHref }: LessonTutorProps) {
  const level = useTutorLevel();
  const casual = level !== "undergraduate";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [launch, setLaunch] = useState<Launch | null>(null);
  // Keeps the conversation after the drawer closes; the panel mounts on first open only.
  const [mounted, setMounted] = useState(false);

  function open(prompt?: string, mode?: TutorMode, quiz?: boolean) {
    setMounted(true);
    setLaunch({ key: Date.now(), prompt, mode, quiz });
  }

  useEffect(() => {
    if (launch && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [launch]);

  return (
    <>
      <aside className="stuck-card" aria-label="Ask the tutor">
        <div>
          <strong>{casual ? "Stuck? Ask the tutor 💬" : "Questions on this unit?"}</strong>
          <p>{casual ? "It knows exactly what you're reading, so ask away." : "The tutor is grounded in this unit's lesson."}</p>
        </div>
        <div className="ask-tutor-chips">
          {chipsFor(level, "lesson")
            .slice(0, 3)
            .map((chip) => (
              <button key={chip.label} type="button" className="tutor-chip" onClick={() => open(chip.prompt, chip.mode, chip.quiz)}>
                {chip.label}
              </button>
            ))}
          <button type="button" className="secondary-action" onClick={() => open()}>
            Type my own
          </button>
        </div>
      </aside>

      <button type="button" className="tutor-fab" onClick={() => open()} aria-haspopup="dialog">
        <span aria-hidden>{casual ? "💬" : "?"}</span> Ask
      </button>

      <dialog
        ref={dialogRef}
        className="tutor-drawer"
        aria-label={heading}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <header className="tutor-drawer-head">
          <div>
            <span className="eyebrow">Tutor</span>
            <h2>{heading}</h2>
          </div>
          <button type="button" className="secondary-action" onClick={() => dialogRef.current?.close()}>
            Close
          </button>
        </header>
        {mounted && launch && (
          <AskTutorPanel
            scope={{ ...scope, surface: "lesson" }}
            fullTutorHref={fullTutorHref}
            autoSend={launch.prompt ? { prompt: launch.prompt, mode: launch.mode, quiz: launch.quiz, nonce: launch.key } : undefined}
          />
        )}
      </dialog>
    </>
  );
}
