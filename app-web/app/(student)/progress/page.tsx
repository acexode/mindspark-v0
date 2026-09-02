import Link from "next/link";
import type { Route } from "next";
import { getSubject, getSubjects, idSlug } from "@/lib/content/loader";
import { allSubtopicIds, practiceHref } from "@/lib/content/navigation";
import { aggregateMastery, getRecord } from "@/lib/domain/mastery/mastery";
import { MasteryBar, MasteryBadge, masteryLabel } from "@/components/ui/mastery-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { experienceFor } from "@/lib/domain/student/experience";
import { courseCompletion } from "@/features/undergrad/lib/course-stats";

export const metadata = { title: "Progress — Mindspark" };

export default async function ProgressPage() {
  const profile = await readProfileOrDefault();
  const experience = experienceFor(profile);
  const isUndergraduate = profile.educationLevel === "undergraduate";
  const subjects =
    profile.selectedSubjectIds.length > 0
      ? profile.selectedSubjectIds.map((id) => getSubject(id)).filter((s) => s !== null)
      : getSubjects(profile.educationLevel);

  if (subjects.length === 0) {
    return (
      <section className="page">
        <EmptyState
          title="No progress yet"
          description="Choose subjects and complete a lesson to start building mastery."
          actionLabel="Browse the library"
          actionHref="/library"
        />
      </section>
    );
  }

  const attempted = Object.values(profile.mastery).filter((r) => r.evidenceCount > 0);
  const weakest = [...attempted].sort((a, b) => a.score - b.score).slice(0, 3);
  const strongest = [...attempted].sort((a, b) => b.score - a.score).slice(0, 3);
  const locate = (subtopicId: string) => {
    for (const subject of subjects) {
      for (const topic of subject.topics) {
        const subtopic = topic.subtopics.find((s) => s.id === subtopicId);
        if (subtopic) return { subject, topic, subtopic };
      }
    }
    return null;
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Progress</span>
          <h1>What you know</h1>
          <p>Mastery is earned from correct reasoning, not time on screen.</p>
        </div>
        <div className="header-stats">
          {experience.gamification && (
            <div>
              <span>XP</span>
              <strong>{profile.xp}</strong>
            </div>
          )}
          <div>
            <span>{isUndergraduate ? "Units practised" : "Subtopics practised"}</span>
            <strong>{attempted.length}</strong>
          </div>
        </div>
      </header>

      {attempted.length > 0 && (
        <div className="progress-highlights">
          <article>
            <h2>Needs attention</h2>
            <ul>
              {weakest.map((record) => {
                const located = locate(record.subtopicId);
                return (
                  <li key={record.subtopicId}>
                    {located ? (
                      <Link href={practiceHref(located.subject, located.topic) as Route}>{located.subtopic.name}</Link>
                    ) : (
                      <span>{record.subtopicId}</span>
                    )}
                    <MasteryBadge state={record.state} score={record.score} />
                  </li>
                );
              })}
            </ul>
          </article>
          <article>
            <h2>Strongest</h2>
            <ul>
              {strongest.map((record) => {
                const located = locate(record.subtopicId);
                return (
                  <li key={record.subtopicId}>
                    <span>{located?.subtopic.name ?? record.subtopicId}</span>
                    <MasteryBadge state={record.state} score={record.score} />
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      )}

      <div className="progress-subjects">
        {subjects.map((subject) => {
          const agg = aggregateMastery(profile.mastery, allSubtopicIds(subject));
          const completion = isUndergraduate ? courseCompletion(subject, profile.mastery) : null;
          return (
            <article key={subject.id} className="progress-subject" style={{ ["--accent" as string]: subject.accentColor }}>
              <header>
                <h2>
                  <Link href={`/library/${idSlug(subject.id)}` as Route}>
                    {subject.courseCode ? `${subject.courseCode} · ${subject.name}` : subject.name}
                  </Link>
                </h2>
                <span>
                  {completion ? `${completion.percent}% complete · ` : ""}
                  {agg.score}% mastery · {masteryLabel(agg.state)}
                </span>
              </header>
              <MasteryBar score={agg.score} label={`${subject.name} mastery`} />

              <ul className="progress-topics">
                {subject.topics.map((topic) => {
                  const topicAgg = aggregateMastery(profile.mastery, topic.subtopics.map((s) => s.id));
                  return (
                    <li key={topic.id}>
                      <span className="progress-topic-name">{topic.name}</span>
                      <MasteryBar score={topicAgg.score} label={`${topic.name} mastery`} />
                      <span className="progress-topic-score">{topicAgg.score}%</span>
                    </li>
                  );
                })}
              </ul>

              <details className="progress-detail">
                <summary>Subtopic detail</summary>
                <ul>
                  {subject.topics
                    .flatMap((t) => t.subtopics)
                    .map((subtopic) => {
                      const record = getRecord(profile.mastery, subtopic.id);
                      return (
                        <li key={subtopic.id}>
                          <span>{subtopic.name}</span>
                          <MasteryBadge state={record.state} score={record.score} />
                        </li>
                      );
                    })}
                </ul>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
