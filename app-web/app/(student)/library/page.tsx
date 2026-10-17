import { getSubjects, getSubjectStats, idSlug } from "@/lib/content/loader";
import { filterSubjectsForClass } from "@/lib/content/class-visibility";
import { buildSubjectOverview } from "@/lib/content/study-overview";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { CourseCatalogue } from "@/features/undergrad/courses/course-catalogue";
import { LibrarySubjectCard, OtherSubjectList, shortSummary } from "@/features/library/components/library-subjects";

export const metadata = { title: "Library — Mindspark" };

export default async function LibraryPage() {
  const profile = await readProfileOrDefault();
  if (profile.educationLevel === "undergraduate") {
    return <CourseCatalogue profile={profile} />;
  }

  const all = filterSubjectsForClass(getSubjects(profile.educationLevel), profile.classLevel);
  const chosen = (id: string) => profile.selectedSubjectIds.indexOf(id);
  const mine = all.filter((s) => chosen(s.id) >= 0).sort((a, b) => chosen(a.id) - chosen(b.id));
  const others = all.filter((s) => chosen(s.id) < 0);

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

  const featured = mine.length > 0 ? mine : all;
  const rest = mine.length > 0 ? others : [];

  return (
    <section className="page library-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Library</span>
          <h1>{mine.length > 0 ? "Your subjects" : "Subjects"}</h1>
          <p>Every lesson and question bank for {profile.classLevel}. Pick up where you are, or browse ahead.</p>
        </div>
      </header>

      <div className="library-grid">
        {featured.map((subject) => (
          <LibrarySubjectCard
            key={subject.id}
            subject={buildSubjectOverview(subject, profile)}
            stats={getSubjectStats(subject)}
            summary={shortSummary(subject.description)}
          />
        ))}
      </div>

      {rest.length > 0 && (
        <section className="library-more" aria-labelledby="library-more-title">
          <h2 id="library-more-title">Other subjects</h2>
          <p className="library-more-note">Not in your study plan. You can browse any of them, or add them from your profile.</p>
          <OtherSubjectList
            subjects={rest.map((subject) => ({
              id: subject.id,
              slug: idSlug(subject.id),
              name: subject.name,
              accent: subject.accentColor,
              summary: shortSummary(subject.description),
              stats: getSubjectStats(subject),
            }))}
          />
        </section>
      )}
    </section>
  );
}
