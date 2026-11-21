"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { MAX_HISTORY_TURNS, MAX_MESSAGE_CHARS } from "@/features/tutor/server/request";
import type { TutorMode, TutorSurface } from "@/lib/domain/tutor/fallback";
import { defaultModeFor } from "@/lib/domain/tutor/prompt";
import { chipLabel } from "@/lib/domain/tutor/suggestions";
import { streamReply } from "./stream-reply";
import { TutorMessages, type TutorMessage } from "./tutor-messages";
import { TutorModeSwitch } from "./tutor-mode-switch";
import { chipsFor, useTutorLevel, type TutorChip } from "./tutor-tone";

export interface AskTutorScope {
  subjectName?: string;
  subtopicId?: string;
  topicId?: string;
  surface: Exclude<TutorSurface, "general">;
  /** Present on question surfaces; the server grades it, the client never sees the key. */
  question?: { id: string; answer: { optionId?: string; optionIds?: string[]; value?: string } };
}

interface AskTutorPanelProps {
  scope: AskTutorScope;
  /** "compact" fits the drawer and question cards; "page" is the full tutor notebook. */
  variant?: "compact" | "page";
  /** Where "Open full tutor" goes; omitted when there is no subtopic to preselect. */
  fullTutorHref?: string;
  /** A message to send for a chip tapped outside the panel. A new nonce sends again. */
  autoSend?: { prompt: string; mode?: TutorMode; quiz?: boolean; nonce: number };
  /** Page variant: what to show before the first message (usually starters built from objectives). */
  renderEmpty?: (ask: (chip: TutorChip) => void) => ReactNode;
  /** Lesson-specific opening questions; replaced by fresh follow-ups after every tutor reply. */
  suggestions?: string[];
}

function endsWithQuestion(text: string): boolean {
  return /\?[\s"'”’)*_]*$/.test(text.trim());
}

export function AskTutorPanel({ scope, variant = "compact", fullTutorHref, autoSend, renderEmpty, suggestions }: AskTutorPanelProps) {
  const level = useTutorLevel();
  const casual = level !== "undergraduate";
  const isPage = variant === "page";
  const isQuestion = Boolean(scope.question);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<TutorMode>(defaultModeFor(scope.surface));
  /** The tutor just asked a question, so what the student types next is an answer, not a new question. */
  const [awaitingAnswer, setAwaitingAnswer] = useState(false);
  const [pending, startTransition] = useTransition();
  const messagesRef = useRef<TutorMessage[]>([]);
  /** Follow-up questions written after the latest reply; null until ready, "loading" while the model writes them. */
  const [followUps, setFollowUps] = useState<string[] | "loading" | null>(null);
  const followUpRun = useRef(0);
  const sentNonce = useRef<number | null>(null);

  messagesRef.current = messages;

  function send(text: string, sendMode: TutorMode = mode, asksQuestion = false) {
    const message = text.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!message || pending) return;

    const history = messagesRef.current.slice(-MAX_HISTORY_TURNS).map(({ role, text: t }) => ({ role, text: t }));
    followUpRun.current++;
    setFollowUps(null);
    setMessages((m) => [...m, { role: "student", text: message }]);
    setInput("");
    // Checking an answer is a one-off; the student's chosen mode stays for their next question.
    if (sendMode !== "check-my-thinking") setMode(sendMode);
    setAwaitingAnswer(asksQuestion);

    startTransition(async () => {
      let replyStarted = false;
      let finalText = "";
      let note: string | undefined;
      const source = await streamReply(
        {
          subjectName: scope.subjectName,
          subtopicId: scope.subtopicId,
          topicId: scope.topicId,
          surface: scope.surface,
          mode: sendMode,
          userMessage: message,
          history,
          questionId: scope.question?.id,
          studentAnswer: scope.question?.answer,
        },
        (reply) => {
          // The first chunk adds the tutor bubble; later chunks grow it in place. Decide now, not inside
          // the updater: React runs updaters later, when the flag would already have flipped.
          const firstChunk = !replyStarted;
          replyStarted = true;
          finalText = reply;
          setMessages((m) =>
            firstChunk ? [...m, { role: "tutor", text: reply }] : [...m.slice(0, -1), { role: "tutor", text: reply }],
          );
        },
        (text) => {
          note = text;
        },
      );
      setMessages((m) => [...m.slice(0, -1), { ...m[m.length - 1], source, note }]);
      // Hints, explanations and checks often end by posing a question; what the student types next is their attempt at it.
      setAwaitingAnswer(asksQuestion || (source !== "scope" && endsWithQuestion(finalText)));
      if (source !== "scope" && source !== "fallback" && finalText && !isQuestion) {
        loadFollowUps([...history, { role: "student" as const, text: message }, { role: "tutor" as const, text: finalText }]);
      }
    });
  }

  /** Asks the server for next questions based on the conversation; a stale answer from an older turn is ignored. */
  function loadFollowUps(turns: Array<{ role: "student" | "tutor"; text: string }>) {
    const run = ++followUpRun.current;
    setFollowUps("loading");
    fetch("/api/v1/tutor/suggestions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        subjectName: scope.subjectName,
        subtopicId: scope.subtopicId,
        topicId: scope.topicId,
        history: turns.slice(-MAX_HISTORY_TURNS),
      }),
    })
      .then((r) => (r.ok ? r.json() : { questions: [] }))
      .then((data: { questions?: string[] }) => {
        if (run === followUpRun.current) setFollowUps(Array.isArray(data.questions) && data.questions.length > 0 ? data.questions : null);
      })
      .catch(() => {
        if (run === followUpRun.current) setFollowUps(null);
      });
  }

  const ask = (chip: TutorChip) => send(chip.prompt, chip.mode, chip.quiz);

  useEffect(() => {
    if (!autoSend || sentNonce.current === autoSend.nonce) return;
    sentNonce.current = autoSend.nonce;
    send(autoSend.prompt, autoSend.mode, autoSend.quiz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSend?.nonce]);

  function submit() {
    send(input, awaitingAnswer ? "check-my-thinking" : mode);
  }

  const dynamic = Array.isArray(followUps) ? followUps : messages.length === 0 ? suggestions : undefined;
  const chips: TutorChip[] =
    dynamic && dynamic.length > 0
      ? dynamic.map((q) => ({ label: chipLabel(q), prompt: q, mode: "explain" as const }))
      : chipsFor(level, isQuestion ? "question" : "lesson");
  const writingFollowUps = followUps === "loading" && !pending;
  const offline = messages.some((m) => m.source === "fallback");
  const inputId = `ask-tutor-${variant}-${scope.question?.id ?? scope.subtopicId ?? scope.topicId}`;

  const empty =
    isPage && renderEmpty ? (
      renderEmpty(ask)
    ) : (
      <p className="ask-tutor-empty">
        {casual
          ? isQuestion
            ? "Stuck on this one? Tell me what confused you — I've got you. 🙌"
            : "Ask me anything about this topic. No such thing as a silly question. ✨"
          : isQuestion
            ? "Ask about this question and your answer."
            : "Ask a question about this unit."}
      </p>
    );

  return (
    <div className={`ask-tutor ${isPage ? "is-page" : ""}`}>
      <TutorMessages messages={messages} pending={pending} empty={empty} showSpeaker={isPage} casual={casual} />

      {offline && (
        <p className="ask-tutor-note" role="note">
          The AI tutor isn&apos;t reachable right now, so you&apos;re getting basic guidance.
        </p>
      )}

      <div className="ask-tutor-dock">
        {(!isPage || messages.length > 0) && (
          <div className="ask-tutor-chips" role="group" aria-label="Quick questions">
            {writingFollowUps ? (
              <span className="ask-tutor-note" role="status">
                Thinking of follow-up questions…
              </span>
            ) : (
              chips.map((chip) => (
                <button key={chip.prompt} type="button" className="tutor-chip" title={chip.prompt} disabled={pending} onClick={() => ask(chip)}>
                  {chip.label}
                </button>
              ))
            )}
          </div>
        )}

        <form
          className="ask-tutor-compose"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label className="sr-only" htmlFor={inputId}>
            {awaitingAnswer ? "Your answer" : "Your question"}
          </label>
          <textarea
            id={inputId}
            rows={2}
            maxLength={MAX_MESSAGE_CHARS}
            value={input}
            placeholder={awaitingAnswer ? "Type your answer…" : casual ? "I don't get why…" : "Ask a question…"}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <div className="ask-tutor-actions">
            {isPage && !awaitingAnswer && <TutorModeSwitch value={mode} onChange={setMode} disabled={pending} />}
            <button type="submit" className="primary-action" disabled={pending || input.trim().length === 0}>
              {awaitingAnswer ? "Check my answer" : "Ask"}
            </button>
            {awaitingAnswer ? (
              <button type="button" className="secondary-action" disabled={pending} onClick={() => send("I give up. What is the answer? Please explain it.", "explain")}>
                {casual ? "Show me the answer 👀" : "Show the answer"}
              </button>
            ) : (
              !isPage &&
              mode === "hint" &&
              messages.length > 0 && (
                <button type="button" className="secondary-action" disabled={pending} onClick={() => send("Please explain it fully.", "explain")}>
                  {casual ? "Just explain it 🙏" : "Explain fully"}
                </button>
              )
            )}
            {fullTutorHref && (
              <Link className="ask-tutor-full" href={fullTutorHref as Route}>
                Open full tutor →
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
