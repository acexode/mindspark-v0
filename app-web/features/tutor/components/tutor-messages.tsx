"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MathText } from "@/components/ui/math-text";
import type { TutorTurn } from "@/lib/domain/tutor/fallback";
import type { TutorSource } from "./stream-reply";

export interface TutorMessage extends TutorTurn {
  source?: TutorSource;
}

interface TutorMessagesProps {
  messages: TutorMessage[];
  pending: boolean;
  /** Shown while the conversation is empty. */
  empty: ReactNode;
  /** The full-page notebook labels each turn in the margin; the compact panel does not have room. */
  showSpeaker?: boolean;
  casual: boolean;
}

export function TutorMessages({ messages, pending, empty, showSpeaker = false, casual }: TutorMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const waitingForFirstChunk = pending && messages[messages.length - 1]?.role !== "tutor";

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [messages, pending]);

  return (
    <div className="ask-tutor-messages" aria-live="polite" aria-busy={pending}>
      {messages.length === 0 && empty}
      {messages.map((message, i) => (
        <div key={i} className={`tutor-message is-${message.role}`}>
          {showSpeaker && (
            <span className="tutor-speaker" aria-hidden>
              {message.role === "tutor" ? "Tutor" : casual ? "Me" : "You"}
            </span>
          )}
          <div className="tutor-message-body">
            <MathText text={message.text} />
            {message.source === "fallback" && <span className="tutor-source">Offline guidance</span>}
          </div>
        </div>
      ))}
      {waitingForFirstChunk && (
        <div className="tutor-message is-tutor ask-tutor-typing" role="status">
          {showSpeaker && (
            <span className="tutor-speaker" aria-hidden>
              Tutor
            </span>
          )}
          <div className="tutor-message-body">
            <span className="sr-only">Tutor is thinking</span>
            <span aria-hidden className="typing-dots">
              <i />
              <i />
              <i />
            </span>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
