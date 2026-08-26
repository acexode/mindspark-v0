"use client";

import { useState, useTransition } from "react";
import { requestTutorTurn } from "@/features/tutor/server/actions";
import { ArrowRight, CaretUp, Check } from "@phosphor-icons/react";
import { useStudentProfile } from "@/features/student-profile/profile-provider";

interface ContextualTutorProps {
  open: boolean;
  solved: boolean;
  equationStep: number;
  onOpenChange: (open: boolean) => void;
}

export function ContextualTutor({ open, solved, equationStep, onOpenChange }: ContextualTutorProps) {
  const { profile } = useStudentProfile();
  const [alternate, setAlternate] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(
    solved
      ? "You kept the equation balanced. Why does 3x remain after the fives cancel?"
      : "Why subtract 5 from the right-hand side when we subtract 5 from the left?",
  );
  const [pending, startTransition] = useTransition();

  function askAlternate() {
    startTransition(async () => {
      const result = await requestTutorTurn({
        ageBand: profile.ageBand,
        educationLevel: profile.educationLevel,
        conceptId: "linear-equations",
        equationStep,
        solved,
        recentAttempts: 0,
        alternateExplanation: !alternate,
      });
      setAlternate(!alternate);
      setResponse(result.response);
    });
  }

  function sendMessage() {
    if (!message.trim()) return;
    startTransition(async () => {
      const result = await requestTutorTurn({
        ageBand: profile.ageBand,
        educationLevel: profile.educationLevel,
        conceptId: "linear-equations",
        equationStep,
        solved,
        recentAttempts: 1,
        alternateExplanation: false,
        userMessage: message,
      });
      setResponse(result.response);
      setMessage("");
    });
  }

  return (
    <aside className={`right-panel ${open ? "" : "collapsed"}`}>
      <header className="tutor-title">
        <h2>AI Tutor</h2>
        <button type="button" onClick={() => onOpenChange(!open)}>
          {open ? "Hide" : "Show"}
          <CaretUp aria-hidden />
        </button>
      </header>
      {open && (
        <>
          <section className="tutor-note">
            <div className="note-kicker">
              <span>2</span>
              {solved ? "Strong reasoning." : "Let's think about line 2."}
            </div>
            <p>{pending ? "Thinking…" : response}</p>
            <button type="button" onClick={askAlternate} disabled={pending}>
              Explain another way
              <ArrowRight aria-hidden />
            </button>
          </section>
          <section className="tutor-input">
            <label className="sr-only" htmlFor="tutor-message">
              Ask the tutor
            </label>
            <textarea
              id="tutor-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I still don't understand…"
              rows={2}
            />
            <button type="button" className="primary-action compact" onClick={sendMessage} disabled={pending}>
              Ask tutor
            </button>
          </section>
          <section className="progress-panel">
            <div className="section-head">
              <h3>My progress</h3>
            </div>
            <div className="mastery-line">
              <span>Exploring</span>
              <ArrowRight aria-hidden />
              <strong>Developing</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: solved ? "82%" : "68%" }} />
            </div>
            <div className="evidence">
              <p>Evidence of learning</p>
              <span>
                <Check aria-hidden /> Kept both sides equal
              </span>
              <span>
                <Check aria-hidden /> Removed the constant
              </span>
            </div>
          </section>
        </>
      )}
    </aside>
  );
}
