"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock, Sparkle, Target, Trophy } from "@phosphor-icons/react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getHomeRecommendation } from "@/lib/domain/recommendations/get-home-recommendation";
import { useStudentProfile } from "@/features/student-profile/profile-provider";

export function HomeDashboard() {
  const { profile } = useStudentProfile();
  const [recommendation, setRecommendation] = useState(() =>
    getHomeRecommendation({
      preferredName: profile.preferredName,
      lessonComplete: profile.lessonComplete,
      linearEquationsMastery: profile.linearEquationsMastery,
      practiceCorrect: profile.practiceCorrect,
      diagnosticScore: profile.diagnosticScore,
      weakConcepts: [],
      retentionDue: [],
    }),
  );

  useEffect(() => {
    fetch("/api/v1/home/recommendation")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.title) setRecommendation(data);
      })
      .catch(() => undefined);
  }, [profile]);

  const greeting = profile.preferredName ? `Good to see you, ${profile.preferredName}.` : "Good to see you.";

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <Eyebrow>Your learning plan</Eyebrow>
          <h1>{greeting}</h1>
          <p>One focused lesson is enough to move forward today.</p>
        </div>
        <div className="header-stats">
          <div>
            <Trophy aria-hidden />
            <span>
              <strong>{profile.xp}</strong> XP earned
            </span>
          </div>
          <div>
            <Sparkle aria-hidden />
            <span>
              <strong>{profile.streak}</strong> day streak
            </span>
          </div>
        </div>
      </header>
      <div className="dashboard-grid">
        <article className="next-lesson">
          <span className="card-kicker">Recommended next</span>
          <h2>{recommendation.title}</h2>
          <p>{recommendation.description}</p>
          <p className="recommendation-reason">{recommendation.reason}</p>
          <div className="lesson-meta">
            <span>
              <Clock aria-hidden /> {recommendation.estimatedMinutes} minutes
            </span>
            <span>
              <Target aria-hidden /> Developing
            </span>
          </div>
          <Link className="primary-action" href={recommendation.href as "/learn/linear-equations"}>
            {profile.lessonComplete ? "Review lesson" : "Continue lesson"}
            <ArrowRight aria-hidden />
          </Link>
        </article>
        <article className="mastery-card">
          <div
            className="ring"
            style={{ "--value": `${profile.linearEquationsMastery * 3.6}deg` } as React.CSSProperties}
          >
            <strong>{profile.linearEquationsMastery}%</strong>
          </div>
          <div>
            <span className="card-kicker">Algebra mastery</span>
            <h2>{profile.linearEquationsMastery < 50 ? "Building foundations" : "Making strong progress"}</h2>
            <p>Your next evidence comes from isolating a variable correctly.</p>
          </div>
        </article>
        <article className="path-card">
          <span className="card-kicker">Today&apos;s path</span>
          {["Understand balancing", "Solve with guidance", "Practise independently"].map((step, index) => {
            const complete = index === 0 || profile.lessonComplete;
            return (
              <div className={`path-step ${complete ? "done" : ""}`} key={step}>
                <span>{complete ? <Check aria-hidden /> : index + 1}</span>
                <strong>{step}</strong>
              </div>
            );
          })}
        </article>
      </div>
    </section>
  );
}
