import { getSubject } from "@/lib/content/loader";
import { buildCandidates } from "@/lib/content/navigation";
import { buildSubjectOverview } from "@/lib/content/study-overview";
import { recommendNext } from "@/lib/domain/recommendations/recommend";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { UndergradDashboard } from "@/features/undergrad/dashboard/undergrad-dashboard";
import { NextUp } from "@/features/home/components/next-up";
import { SubjectRows } from "@/features/home/components/subject-rows";
import { TodayAside } from "@/features/home/components/today-aside";

export const metadata = { title: "Today — Mindspark" };

/** Students are in Nigeria; the server's own clock may not be. */
const todayLabel = () =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Lagos" }).format(new Date());

export default async function HomePage() {
  const profile = await readProfileOrDefault();
  if (profile.educationLevel === "undergraduate") {
    return <UndergradDashboard profile={profile} />;
  }

  const subjects = profile.selectedSubjectIds
    .map((id) => getSubject(id))
    .filter((s) => s !== null)
    .map((subject) => buildSubjectOverview(subject, profile));

  const unlockedTopicIds = new Set(subjects.flatMap((s) => s.topics.filter((t) => t.status !== "locked").map((t) => t.id)));
  const candidates = buildCandidates(profile.selectedSubjectIds, profile.classLevel).filter((c) =>
    unlockedTopicIds.has(c.topicId),
  );
  const recommendation = recommendNext(candidates, profile.mastery);
  const answered = subjects.reduce((sum, s) => sum + s.answeredCount, 0);

  return (
    <section className="page today-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{todayLabel()}</span>
          <h1>{profile.preferredName ? `Good to see you, ${profile.preferredName}.` : "Good to see you."}</h1>
          <p>One focused session is enough to move forward.</p>
        </div>
        <dl className="header-stats">
          <div>
            <dt>XP</dt>
            <dd>{profile.xp}</dd>
          </div>
          <div>
            <dt>Streak</dt>
            <dd>
              {profile.streak} {profile.streak === 1 ? "day" : "days"}
            </dd>
          </div>
          <div>
            <dt>Answered</dt>
            <dd>{answered}</dd>
          </div>
        </dl>
      </header>

      {subjects.length === 0 ? (
        <EmptyState
          title="Choose your subjects to get started"
          description="Pick the subjects you study and we will build your learning path."
          actionLabel="Browse the library"
          actionHref="/library"
        />
      ) : (
        <div className="today-grid">
          <div className="today-main">
            {recommendation && (
              <NextUp
                recommendation={recommendation}
                subject={subjects.find((s) => recommendation.subtopicId.startsWith(`${s.id}.`)) ?? null}
              />
            )}
            <section className="today-subjects" aria-labelledby="today-subjects-title">
              <h2 id="today-subjects-title">Your subjects</h2>
              <SubjectRows subjects={subjects} />
            </section>
          </div>
          <TodayAside subjects={subjects} casual />
        </div>
      )}
    </section>
  );
}
