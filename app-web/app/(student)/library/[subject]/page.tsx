import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getLesson, getQuestions, idSlug, resolveSubjectSlug } from "@/lib/content/loader";
import { progressionContextFor, subjectProgression } from "@/lib/content/topic-progress";
import { aggregateMastery, getRecord } from "@/lib/domain/mastery/mastery";
import { MasteryBar, MasteryBadge } from "@/components/ui/mastery-badge";
import { LockNotice } from "@/components/ui/lock-notice";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectSlug } = await params;
  const profile = await readProfileOrDefault();
  const raw = resolveSubjectSlug(subjectSlug, profile.educationLevel);
  if (!raw) notFound();

  const progression = subjectProgression(raw, progressionContextFor(profile));
  const subject = progression.subject;
  if (subject.topics.length === 0) notFound();
  const isUndergraduate = profile.educationLevel === "undergraduate";

  return (
    <section className="page" style={{ ["--accent" as string]: subject.accentColor }}>
      <header className="page-header">
        <div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/library">{isUndergraduate ? "Courses" : "Library"}</Link>
            <span aria-hidden>/</span>
            <span>{subject.name}</span>
          </nav>
          <h1>{subject.name}</h1>
          {isUndergraduate ? (
            <p className="topic-meta">
              {subject.courseCode ?? subject.shortName}
              {subject.creditUnits ? ` · ${subject.creditUnits} unit${subject.creditUnits === 1 ? "" : "s"}` : ""}
              {subject.semester ? ` · Semester ${subject.semester}` : ""}
            </p>
          ) : null}
          <p>{subject.description}</p>
          {!isUndergraduate && (
            <>
              <p className="topic-meta">Showing topics for {profile.classLevel}. Other classes stay hidden so you only study what matches your year.</p>
              <p className="topic-meta">Topics unlock in order. Master the current topic and score at least 50% in its practice to open the next one.</p>
            </>
          )}
          <p className="curricula-tags">
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

      <ol className="topic-list">
        {subject.topics.map((topic) => {
          const agg = aggregateMastery(profile.mastery, topic.subtopics.map((s) => s.id));
          const topicSlug = idSlug(topic.id);
          const unlocked = progression.isUnlocked(topic.id);
          const reason = progression.lockReason(topic.id);
          const best = progression.practiceBest[topic.id] ?? 0;
          const readiness = isUndergraduate ? progression.readiness(topic.id) : null;

          return (
            <li key={topic.id} className={`topic-row ${unlocked ? "" : "is-locked"}`}>
              <div className="topic-row-head">
                <div>
                  <h2>
                    {unlocked ? (
                      <Link href={`/library/${subjectSlug}/${topicSlug}` as Route}>{topic.name}</Link>
                    ) : (
                      <span>
                        {topic.name} <span className="topic-lock-badge">Locked</span>
                      </span>
                    )}
                  </h2>
                  <p>{topic.summary}</p>
                  <p className="topic-meta">
                    {topic.subtopics.length} subtopics · {topic.classLevels.join(", ")}
                    {unlocked && best > 0 ? ` · Best practice ${best}%` : ""}
                  </p>
                </div>
                <div className="topic-row-mastery">
                  <MasteryBadge state={agg.state} score={agg.score} />
                  <MasteryBar score={agg.score} label={`${topic.name} mastery`} />
                </div>
              </div>

              {!unlocked && reason && <LockNotice reason={reason} />}
              {readiness?.position === "ahead" && readiness.suggestion && <p className="readiness-note">{readiness.suggestion}</p>}
              {isUndergraduate && (
                <p className="topic-meta">
                  <Link href={`/practice/${subjectSlug}/${topicSlug}` as Route}>Practise this module</Link>
                  {" · "}
                  <Link href={`/quiz/${subjectSlug}/topic?topic=${topicSlug}` as Route}>Assess this module</Link>
                </p>
              )}

              <ul className="subtopic-chips">
                {topic.subtopics.map((subtopic) => {
                  const record = getRecord(profile.mastery, subtopic.id);
                  const hasLesson = Boolean(getLesson(subtopic.id));
                  const questionCount = getQuestions(subtopic.id).length;
                  return (
                    <li key={subtopic.id}>
                      {unlocked ? (
                        <Link
                          href={
                            hasLesson
                              ? (`/learn/${subjectSlug}/${topicSlug}/${idSlug(subtopic.id)}` as Route)
                              : (`/library/${subjectSlug}/${topicSlug}` as Route)
                          }
                          className={`subtopic-chip is-${record.state.replace("_", "-")}`}
                        >
                          {subtopic.name}
                          <small>
                            {hasLesson ? "Lesson" : "No lesson yet"} · {questionCount} Q
                          </small>
                        </Link>
                      ) : (
                        <span className="subtopic-chip is-locked" title={reason ?? "Locked"}>
                          {subtopic.name}
                          <small>Locked</small>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
