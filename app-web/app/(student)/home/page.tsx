import Link from "next/link";
import type { Route } from "next";
import { getSubject, getSubjectStats, idSlug } from "@/lib/content/loader";
import { allSubtopicIds, buildCandidates } from "@/lib/content/navigation";
import { filterSubjectForClass } from "@/lib/content/class-visibility";
import { progressionContextFor, subjectProgression } from "@/lib/content/topic-progress";
import { aggregateMastery } from "@/lib/domain/mastery/mastery";
import { recommendNext } from "@/lib/domain/recommendations/recommend";
import { MasteryBar, masteryLabel } from "@/components/ui/mastery-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { UndergradDashboard } from "@/features/undergrad/dashboard/undergrad-dashboard";

export const metadata = { title: "Today — Mindspark" };

export default async function HomePage() {
  const profile = await readProfileOrDefault();
  if (profile.educationLevel === "undergraduate") {
    return <UndergradDashboard profile={profile} />;
  }

  const subjects = profile.selectedSubjectIds.map((id) => getSubject(id)).filter((s) => s !== null);
  const unlockedTopicIds = new Set(
    subjects.flatMap((subject) => [
      ...subjectProgression(subject, progressionContextFor(profile)).unlockedTopicIds,
    ]),
  );
  const candidates = buildCandidates(profile.selectedSubjectIds, profile.classLevel).filter((candidate) =>
    unlockedTopicIds.has(candidate.topicId),
  );
  const recommendation = recommendNext(candidates, profile.mastery);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Today</span>
          <h1>{profile.preferredName ? `Good to see you, ${profile.preferredName}.` : "Good to see you."}</h1>
          <p>One focused session is enough to move forward.</p>
        </div>
        <div className="header-stats">
          <div>
            <span>XP</span>
            <strong>{profile.xp}</strong>
          </div>
          <div>
            <span>Streak</span>
            <strong>{profile.streak} days</strong>
          </div>
        </div>
      </header>

      {recommendation ? (
        <article className="recommendation-card">
          <span className="card-kicker">Recommended next · {recommendation.subjectName}</span>
          <h2>{recommendation.title}</h2>
          <p>{recommendation.description}</p>
          <p className="recommendation-reason">{recommendation.reason}</p>
          <Link className="primary-action" href={recommendation.href as Route}>
            {recommendation.action === "learn"
              ? "Start lesson"
              : recommendation.action === "quiz"
                ? "Start quiz"
                : "Start practice"}
          </Link>
        </article>
      ) : (
        <EmptyState
          title="Choose your subjects to get started"
          description="Pick the subjects you study and we will build your learning path."
          actionLabel="Browse the library"
          actionHref="/library"
        />
      )}

      {subjects.length > 0 && (
        <section className="home-subjects">
          <h2>Your subjects</h2>
          <div className="home-subject-grid">
            {subjects.map((subject) => {
              const scoped = filterSubjectForClass(subject, profile.classLevel);
              const agg = aggregateMastery(profile.mastery, allSubtopicIds(scoped));
              const stats = getSubjectStats(scoped);
              return (
                <Link
                  key={subject.id}
                  href={`/library/${idSlug(subject.id)}` as Route}
                  className="home-subject-card"
                  style={{ ["--accent" as string]: subject.accentColor }}
                >
                  <h3>{subject.name}</h3>
                  <MasteryBar score={agg.score} label={`${subject.name} mastery`} />
                  <span>
                    {masteryLabel(agg.state)} · {stats.topicCount} topics
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}
