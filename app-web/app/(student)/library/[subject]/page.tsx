import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getLesson, getQuestions, resolveSubjectSlug } from "@/lib/content/loader";
import { progressionContextFor, subjectProgression } from "@/lib/content/topic-progress";
import { buildSubjectOverview } from "@/lib/content/study-overview";
import { TOPIC_PRACTICE_UNLOCK_PERCENT } from "@/lib/domain/mastery/progression";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { TopicTrail } from "@/features/study/components/topic-trail";
import { subjectStateLabel } from "@/features/study/labels";
import { shortSummary } from "@/features/library/components/library-subjects";
import { TopicOutline, type OutlineTopic } from "@/features/library/components/topic-outline";

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectSlug } = await params;
  const profile = await readProfileOrDefault();
  const raw = resolveSubjectSlug(subjectSlug, profile.educationLevel);
  if (!raw) notFound();

  const progression = subjectProgression(raw, progressionContextFor(profile));
  const subject = progression.subject;
  if (subject.topics.length === 0) notFound();
  const isUndergraduate = profile.educationLevel === "undergraduate";
  const overview = buildSubjectOverview(raw, profile);
  const nextLocked = overview.topics.find((t) => t.status === "locked");

  const topics: OutlineTopic[] = subject.topics.map((topic) => {
    const readiness = isUndergraduate ? progression.readiness(topic.id) : null;
    return {
      topic,
      overview: overview.topics.find((t) => t.id === topic.id)!,
      lessons: Object.fromEntries(topic.subtopics.map((s) => [s.id, Boolean(getLesson(s.id))])),
      questionCounts: Object.fromEntries(topic.subtopics.map((s) => [s.id, getQuestions(s.id).length])),
      suggestion: readiness?.position === "ahead" ? readiness.suggestion : null,
    };
  });

  return (
    <section className="page subject-page" style={{ ["--accent" as string]: subject.accentColor }}>
      <header className="page-header">
        <div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/library">{isUndergraduate ? "Courses" : "Library"}</Link>
            <span aria-hidden>/</span>
            <span>{subject.name}</span>
          </nav>
          <h1>{subject.name}</h1>
          <p>{shortSummary(subject.description)}</p>
          <p className="subject-page-meta">
            {isUndergraduate ? (
              <>
                {subject.courseCode ?? subject.shortName}
                {subject.creditUnits ? ` · ${subject.creditUnits} unit${subject.creditUnits === 1 ? "" : "s"}` : ""}
                {subject.semester ? ` · Semester ${subject.semester}` : ""}
              </>
            ) : (
              <>Showing {profile.classLevel} topics</>
            )}
            {subject.curricula.map((c) => (
              <span key={c} className="tag">
                {c}
              </span>
            ))}
          </p>
        </div>
        <div className="header-actions">
          <Link className="primary-action" href={`/practice/${subjectSlug}` as Route}>
            {isUndergraduate ? "Practise this course" : "Practise this subject"}
          </Link>
          <Link className="secondary-action" href={`/quiz/${subjectSlug}/subject` as Route}>
            {isUndergraduate ? "Take an assessment" : "Take a quiz"}
          </Link>
        </div>
      </header>

      <section className="subject-summary" aria-label={`Your progress in ${subject.name}`}>
        <div className="subject-summary-trail">
          <TopicTrail topics={overview.topics} label={`${subject.name} topics`} />
          {!isUndergraduate && overview.current && nextLocked ? (
            <p>
              Topics unlock in order. Score {TOPIC_PRACTICE_UNLOCK_PERCENT}% in <strong>{overview.current.name}</strong>
              {"'"}s practice, or work through all of its subtopics, to open <strong>{nextLocked.name}</strong>.
            </p>
          ) : (
            <p>{isUndergraduate ? "Every module is open. Work through them in any order." : "Every topic is open to you."}</p>
          )}
        </div>
        <dl className="subject-summary-stats">
          <div>
            <dt>{isUndergraduate ? "Modules" : "Topics cleared"}</dt>
            <dd>
              {isUndergraduate ? overview.topics.length : overview.clearedCount}
              {!isUndergraduate && <span>/{overview.topics.length}</span>}
            </dd>
          </div>
          <div>
            <dt>Mastery</dt>
            <dd>
              {overview.mastery.score}% <span>{subjectStateLabel(overview).toLowerCase()}</span>
            </dd>
          </div>
          <div>
            <dt>Answered</dt>
            <dd>{overview.answeredCount}</dd>
          </div>
        </dl>
      </section>

      <TopicOutline subjectSlug={subjectSlug} topics={topics} mastery={profile.mastery} isUndergraduate={isUndergraduate} />
    </section>
  );
}
