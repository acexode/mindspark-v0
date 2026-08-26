"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Sparkle } from "@phosphor-icons/react";
import { buildKnowledgeMap } from "@/lib/domain/knowledge-graph/graph";
import { useStudentProfile } from "@/features/student-profile/profile-provider";

export function KnowledgeMap() {
  const { profile } = useStudentProfile();
  const [nodes, setNodes] = useState(() =>
    buildKnowledgeMap(
      "algebra",
      {
        "number-sense": 90,
        "algebra-basics": 85,
        "linear-equations": profile.linearEquationsMastery,
        "simultaneous-equations": 0,
      },
      "linear-equations",
    ),
  );

  useEffect(() => {
    fetch("/api/v1/knowledge-map?subjectId=algebra")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.nodes) setNodes(data.nodes);
      })
      .catch(() => undefined);
  }, [profile.linearEquationsMastery]);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Knowledge map</span>
          <h1>See how your skills connect.</h1>
          <p>Each completed skill unlocks a stronger foundation for the next.</p>
        </div>
      </header>
      <div className="knowledge-map">
        {nodes.map((node, index) => (
          <div key={node.id} className="map-node-group">
            {index > 0 && <ArrowRight aria-hidden />}
            <div className={`map-skill ${node.state === "mastered" ? "mastered" : node.state === "current" ? "current" : node.state === "locked" ? "locked" : ""}`}>
              {node.state === "mastered" ? <Check aria-hidden /> : <Sparkle aria-hidden />}
              <strong>{node.label}</strong>
              <span>
                {node.state === "locked"
                  ? node.reason ?? "Locked"
                  : node.state === "mastered"
                    ? "Mastered"
                    : `${Math.round(node.masteryScore)}% mastery`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
