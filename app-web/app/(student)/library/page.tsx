import Link from "next/link";
import type { Route } from "next";
import { getSubjects, getSubjectStats, idSlug } from "@/lib/content/loader";
import { allSubtopicIds } from "@/lib/content/navigation";
import { aggregateMastery } from "@/lib/domain/mastery/mastery";
import { MasteryBar, masteryLabel } from "@/components/ui/mastery-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export const metadata = { title: "Library — Mindspark" };

export default async function LibraryPage() {
  const profile = await readProfileOrDefault();
  const level = profile.educationLevel;
  const all = getSubjects(level);
  const mine = all.filter((s) => profile.selectedSubjectIds.includes(s.id));
  const others = all.filter((s) => !profile.selectedSubjectIds.includes(s.id));

  if (all.length === 0) {
    return (
      <section className="page">
        <EmptyState
          title="No subjects available yet"
          description="Content for this education level has not been published."
        />
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Library</span>
          <h1>Your subjects</h1>
          <p>Choose a subject to see its topics, lessons and question banks.</p>
        </div>
      </header>

      <SubjectGrid subjects={mine.length > 0 ? mine : all} mastery={profile.mastery} />

      {mine.length > 0 && others.length > 0 && (
        <section className="library-more">
          <h2>Other subjects</h2>
          <SubjectGrid subjects={others} mastery={profile.mastery} muted />
        </section>
      )}
    </section>
  );
}

function SubjectGrid({
  subjects,
  mastery,
  muted = false,
}: {
  subjects: ReturnType<typeof getSubjects>;
  mastery: Awaited<ReturnType<typeof readProfileOrDefault>>["mastery"];
  muted?: boolean;
}) {
  return (
    <div className={`subject-grid ${muted ? "is-muted" : ""}`}>
      {subjects.map((subject) => {
        const stats = getSubjectStats(subject);
        const agg = aggregateMastery(mastery, allSubtopicIds(subject));
        const href = `/library/${idSlug(subject.id)}` as Route;

        return (
          <Link key={subject.id} href={href} className="subject-card" style={{ ["--accent" as string]: subject.accentColor }}>
            <span className="subject-card-rule" aria-hidden />
            <h2>{subject.name}</h2>
            <p>{subject.description}</p>
            <dl className="subject-stats">
              <div>
                <dt>Topics</dt>
                <dd>{stats.topicCount}</dd>
              </div>
              <div>
                <dt>Lessons</dt>
                <dd>{stats.lessonCount}</dd>
              </div>
              <div>
                <dt>Questions</dt>
                <dd>{stats.questionCount}</dd>
              </div>
            </dl>
            <MasteryBar score={agg.score} label={`${subject.name} mastery`} />
            <span className="subject-card-foot">{masteryLabel(agg.state)}</span>
          </Link>
        );
      })}
    </div>
  );
}
