"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SCORE_REACTION, scoreMood, type ScoreMood } from "./score-mood";

interface ScoreCelebrationProps {
  percent: number;
}

interface Piece {
  id: number;
  kind: "confetti" | "emoji";
  emoji?: string;
  color: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  spin: number;
}

const CELEBRATE_COLORS = ["#0c4dcc", "#147a52", "#e2b007", "#e85d4c", "#7b5cff", "#f4f1e8"];
const ENCOURAGE_COLORS = ["#8a6210", "#c9a227", "#5b8a72", "#d9d3c6"];
const LETDOWN_EMOJIS = ["😞", "😔", "🙁", "😢", "👎", "🫠"];
const CELEBRATE_EMOJIS = ["🎉", "🎊", "✨", "⭐"];
const ENCOURAGE_EMOJIS = ["⭐", "✨", "👏"];

function createPieces(mood: ScoreMood): Piece[] {
  if (mood === "celebrate") {
    return Array.from({ length: 96 }, (_, id) => ({
      id,
      kind: id % 4 === 0 ? "emoji" : "confetti",
      emoji: CELEBRATE_EMOJIS[id % CELEBRATE_EMOJIS.length],
      color: CELEBRATE_COLORS[id % CELEBRATE_COLORS.length]!,
      left: Math.random() * 100,
      delay: Math.random() * 0.7,
      duration: 2.1 + Math.random() * 1.6,
      size: 8 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 120,
      spin: 220 + Math.random() * 500,
    }));
  }

  if (mood === "encourage") {
    return Array.from({ length: 36 }, (_, id) => ({
      id,
      kind: id % 3 === 0 ? "emoji" : "confetti",
      emoji: ENCOURAGE_EMOJIS[id % ENCOURAGE_EMOJIS.length],
      color: ENCOURAGE_COLORS[id % ENCOURAGE_COLORS.length]!,
      left: 15 + Math.random() * 70,
      delay: Math.random() * 0.9,
      duration: 2.8 + Math.random() * 1.4,
      size: 6 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 40,
      spin: 80 + Math.random() * 160,
    }));
  }

  return Array.from({ length: 72 }, (_, id) => ({
    id,
    kind: "emoji",
    emoji: LETDOWN_EMOJIS[id % LETDOWN_EMOJIS.length],
    color: "transparent",
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.4 + Math.random() * 1.8,
    size: 22 + Math.random() * 16,
    drift: (Math.random() - 0.5) * 50,
    spin: 40 + Math.random() * 80,
  }));
}

export function ScoreCelebration({ percent }: ScoreCelebrationProps) {
  const mood = scoreMood(percent);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    setPieces(createPieces(mood));
    const timer = window.setTimeout(() => setPieces([]), 6500);
    return () => window.clearTimeout(timer);
  }, [mood]);

  const overlay =
    pieces.length > 0 ? (
      <div className={`score-celebration is-${mood}`} aria-hidden="true">
        {pieces.map((piece) => (
          <span
            key={piece.id}
            className={`score-piece is-${piece.kind}`}
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              fontSize: piece.kind === "emoji" ? `${piece.size}px` : undefined,
              width: piece.kind === "confetti" ? `${piece.size * 0.55}px` : undefined,
              height: piece.kind === "confetti" ? `${piece.size}px` : undefined,
              background: piece.kind === "confetti" ? piece.color : undefined,
              ["--drift" as string]: `${piece.drift}px`,
              ["--spin" as string]: `${piece.spin}deg`,
            }}
          >
            {piece.kind === "emoji" ? piece.emoji : null}
          </span>
        ))}
      </div>
    ) : null;

  return (
    <>
      {mounted && overlay ? createPortal(overlay, document.body) : null}
      <p className={`score-reaction is-${mood}`} role="status">
        {SCORE_REACTION[mood]}
      </p>
    </>
  );
}
