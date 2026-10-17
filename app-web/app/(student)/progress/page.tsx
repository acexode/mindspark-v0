import { getSubject, getSubjects, idSlug } from "@/lib/content/loader";
import { practiceHref } from "@/lib/content/navigation";
import { buildSubjectOverview } from "@/lib/content/study-overview";
import { scopeSubjectForStudent } from "@/lib/content/courses";
import { getRecord } from "@/lib/domain/mastery/mastery";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { experienceFor } from "@/lib/domain/student/experience";
import { courseCompletion } from "@/features/undergrad/lib/course-stats";
import { ProgressHighlights, type PractisedUnit } from "@/features/progress/components/progress-highlights";
import { ProgressSubject } from "@/features/progress/components/progress-subject";

export const metadata = { title: "Progress — Mindspark" };

export default async function ProgressPage() {
  const profile = await readProfileOrDefault();
  const experience = experienceFor(profile);
  const isUndergraduate = profile.educationLevel === "undergraduate";
  const subjects = (
    profile.selectedSubjectIds.length > 0
      ? profile.selectedSubjectIds.map((id) => getSubject(id)).filter((s) => s !== null)
      : getSubjects(profile.educationLevel)
  ).map((subject) => scopeSubjectForStudent(subject, profile.classLevel, profile.educationLevel));

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

  const overviews = subjects.map((subject) => buildSubjectOverview(subject, profile));
  const practised: PractisedUnit[] = subjects.flatMap((subject) =>
    subject.topics.flatMap((topic) =>
      topic.subtopics
        .map((subtopic) => ({ subtopic, record: getRecord(profile.mastery, subtopic.id) }))
        .filter(({ record }) => record.evidenceCount > 0)
        .map(({ subtopic, record }) => ({
          record,
          name: subtopic.name,
          context: `${subject.courseCode ?? subject.name} · ${topic.name}`,
          practiceHref: `${practiceHref(subject, topic)}?subtopic=${idSlug(subtopic.id)}`,
        })),
    ),
  );

  const totals = {
    subtopics: overviews.reduce((sum, o) => sum + o.subtopicCount, 0),
    practised: overviews.reduce((sum, o) => sum + o.practisedSubtopicCount, 0),
    answered: overviews.reduce((sum, o) => sum + o.answeredCount, 0),
    cleared: overviews.reduce((sum, o) => sum + o.clearedCount, 0),
    topics: overviews.reduce((sum, o) => sum + o.topics.length, 0),
  };

  return (
    <section className="page progress-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Progress</span>
          <h1>What you know</h1>
          <p>Mastery is earned from correct reasoning, not time on screen.</p>
        </div>
        <dl className="header-stats">
          {experience.gamification && (
            <div>
              <dt>XP</dt>
              <dd>{profile.xp}</dd>
            </div>
          )}
          <div>
            <dt>{isUndergraduate ? "Units practised" : "Subtopics practised"}</dt>
            <dd>
              {totals.practised}
              <span>/{totals.subtopics}</span>
            </dd>
          </div>
          <div>
            <dt>Answered</dt>
            <dd>{totals.answered}</dd>
          </div>
          {!isUndergraduate && (
            <div>
              <dt>Topics cleared</dt>
              <dd>
                {totals.cleared}
                <span>/{totals.topics}</span>
              </dd>
            </div>
          )}
        </dl>
      </header>

      {practised.length > 0 ? (
        <ProgressHighlights units={practised} />
      ) : (
        <p className="progress-intro">
          Your mastery appears here as you practise. Each subtopic moves from <em>exploring</em> to <em>mastered</em> as you
          answer its questions correctly.
        </p>
      )}

      <div className="progress-subjects">
        {overviews.map((overview, i) => (
          <ProgressSubject
            key={overview.id}
            subject={overview}
            completion={isUndergraduate ? courseCompletion(subjects[i], profile.mastery).percent : null}
          />
        ))}
      </div>
    </section>
  );
}
