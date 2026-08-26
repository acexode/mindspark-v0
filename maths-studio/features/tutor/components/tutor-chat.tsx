"use client";

import { useState, useTransition } from "react";
import { requestTutorTurn } from "@/features/tutor/server/actions";
import { useStudentProfile } from "@/features/student-profile/profile-provider";

export function TutorChat() {
  const { profile } = useStudentProfile();
  const [messages, setMessages] = useState<Array<{ role: "user" | "tutor"; text: string }>>([
    { role: "tutor", text: "Hi! I'm your maths tutor. What would you like help with today?" },
  ]);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();

  function send() {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMessage }]);
    setInput("");

    startTransition(async () => {
      const result = await requestTutorTurn({
        ageBand: profile.ageBand,
        educationLevel: profile.educationLevel,
        conceptId: "linear-equations",
        equationStep: 0,
        solved: false,
        recentAttempts: 0,
        alternateExplanation: false,
        userMessage,
      });
      setMessages((m) => [...m, { role: "tutor", text: result.response }]);
    });
  }

  return (
    <section className="page tutor-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Tutor</span>
          <h1>Ask your AI tutor.</h1>
          <p>Socratic guidance grounded in reviewed curriculum content.</p>
        </div>
      </header>
      <div className="tutor-chat">
        <div className="tutor-messages" aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`tutor-message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {pending && <div className="tutor-message tutor">Thinking…</div>}
        </div>
        <div className="tutor-compose">
          <label className="sr-only" htmlFor="tutor-chat-input">
            Message to tutor
          </label>
          <textarea
            id="tutor-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about linear equations…"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button type="button" className="primary-action" onClick={send} disabled={pending}>
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
