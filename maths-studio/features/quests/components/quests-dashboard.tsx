"use client";

import Link from "next/link";
import { Check, Target } from "@phosphor-icons/react";
import { generateDailyQuests } from "@/lib/domain/gamification/rewards";
import { useStudentProfile } from "@/features/student-profile/profile-provider";
import { ProgressBar } from "@/components/ui/progress-bar";

export function QuestsDashboard() {
  const { profile } = useStudentProfile();
  const quests = generateDailyQuests(profile);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Quests</span>
          <h1>Today&apos;s learning missions.</h1>
          <p>Complete meaningful activities — not busywork.</p>
        </div>
      </header>
      <div className="quests-grid">
        {quests.map((quest) => {
          const complete = quest.progress >= quest.target;
          return (
            <article key={quest.id} className={`quest-card ${complete ? "complete" : ""}`}>
              <div className="quest-header">
                <Target aria-hidden />
                <span className="card-kicker">{quest.type}</span>
              </div>
              <h2>{quest.title}</h2>
              <p>{quest.description}</p>
              <ProgressBar value={quest.progress} max={quest.target} label={quest.title} />
              <div className="quest-footer">
                <span>{quest.xpReward} XP reward</span>
                {complete ? (
                  <span className="quest-done">
                    <Check aria-hidden /> Complete
                  </span>
                ) : (
                  <Link href={quest.href as "/learn/linear-equations"}>Start</Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
