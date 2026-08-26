"use client";

import { Medal, Trophy } from "@phosphor-icons/react";
import { LEAGUE_TIERS, getLeagueTier, checkAchievements } from "@/lib/domain/gamification/rewards";
import { useStudentProfile } from "@/features/student-profile/profile-provider";

export function LeagueDashboard() {
  const { profile } = useStudentProfile();
  const tier = getLeagueTier(profile.xp);
  const achievements = checkAchievements(profile);
  const nextTier = LEAGUE_TIERS.find((t) => t.minXp > profile.xp);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">League</span>
          <h1>Friendly competition.</h1>
          <p>Progress through tiers by demonstrating real learning.</p>
        </div>
      </header>
      <div className="league-grid">
        <article className="league-card current-tier">
          <Medal size={48} aria-hidden style={{ color: tier.color }} />
          <h2>{tier.name} League</h2>
          <p>
            <strong>{profile.xp} XP</strong> earned
          </p>
          {nextTier && (
            <p className="league-next">
              {nextTier.minXp - profile.xp} XP to {nextTier.name}
            </p>
          )}
        </article>
        <article className="league-tiers">
          <h3>All tiers</h3>
          <ul>
            {LEAGUE_TIERS.map((t) => (
              <li key={t.id} className={t.id === tier.id ? "active" : ""} style={{ borderColor: t.color }}>
                {t.name} — {t.minXp}+ XP
              </li>
            ))}
          </ul>
        </article>
        <article className="achievements-card">
          <h3>
            <Trophy aria-hidden /> Achievements
          </h3>
          <ul>
            {achievements.map((a) => (
              <li key={a.id} className={a.earned ? "earned" : ""}>
                <strong>{a.title}</strong>
                <span>{a.description}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
