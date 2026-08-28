"use client";

import { useState, useTransition } from "react";
import { askTutor } from "@/features/tutor/server/actions";
import { MathText } from "@/components/ui/math-text";

export interface TutorScopeOption {
  subtopicId: string;
  label: string;
  subjectName: string;
}

interface Message {
  role: "student" | "tutor";
  text: string;
  source?: "ai" | "fallback";
}

export function TutorChat({ scopes }: { scopes: TutorScopeOption[] }) {
  const [scopeId, setScopeId] = useState(scopes[0]?.subtopicId ?? "");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "tutor",
      text: "Pick what you're studying, then tell me what you're stuck on. I'll guide you rather than just hand over answers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();

  const scope = scopes.find((s) => s.subtopicId === scopeId);

  function send(alternate = false) {
    const text = input.trim();
    if (!text && !alternate) return;

    if (text) setMessages((m) => [...m, { role: "student", text }]);
    setInput("");

    startTransition(async () => {
      const reply = await askTutor({
        subjectName: scope?.subjectName ?? "your subject",
        subtopicId: scopeId || undefined,
        userMessage: text || undefined,
        alternateExplanation: alternate,
      });
      setMessages((m) => [...m, { role: "tutor", text: reply.response, source: reply.source }]);
    });
  }

  return (
    <section className="tutor-chat">
      <div className="tutor-scope">
        <label htmlFor="tutor-scope-select">What are you studying?</label>
        <select id="tutor-scope-select" value={scopeId} onChange={(e) => setScopeId(e.target.value)}>
          {scopes.length === 0 && <option value="">No subtopics available</option>}
          {scopes.map((option) => (
            <option key={option.subtopicId} value={option.subtopicId}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="tutor-messages" aria-live="polite">
        {messages.map((message, i) => (
          <div key={i} className={`tutor-message is-${message.role}`}>
            <MathText text={message.text} />
            {message.source === "fallback" && <span className="tutor-source">Offline guidance</span>}
          </div>
        ))}
        {pending && <div className="tutor-message is-tutor">Thinking…</div>}
      </div>

      <div className="tutor-compose">
        <label className="sr-only" htmlFor="tutor-input">
          Your message
        </label>
        <textarea
          id="tutor-input"
          rows={3}
          value={input}
          placeholder="I don't understand why…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <div className="tutor-actions">
          <button type="button" className="primary-action" onClick={() => send()} disabled={pending}>
            Ask tutor
          </button>
          <button type="button" className="secondary-action" onClick={() => send(true)} disabled={pending}>
            Explain another way
          </button>
        </div>
      </div>
    </section>
  );
}
