import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getLesson, getQuestions, idSlug, resolveSubjectSlug, resolveTopicSlug } from "@/lib/content/loader";
import { filterTopicsForClass } from "@/lib/content/class-visibility";
import { getRecord, isUnlocked, lockReason } from "@/lib/domain/mastery/mastery";
import { MasteryBadge } from "@/components/ui/mastery-badge";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const subject = resolveSubjectSlug(subjectSlug);
  if (!subject) notFound();
  const rawTopic = resolveTopicSlug(subject, topicSlug);
  if (!rawTopic) notFound();

  const profile = await readProfileOrDefault();
  const topic = filterTopicsForClass([rawTopic], profile.classLevel)[0];
  if (!topic) notFound();
  const nameById = new Map(
    subject.topics.flatMap((t) => t.subtopics.map((s) => [s.id, s.name] as const)),
  );

  return (
    <section className="page" style={{ ["--accent" as string]: subject.accentColor }}>
      <header className="page-header">
        <div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/library">Library</Link>
            <span aria-hidden>/</span>
            <Link href={`/library/${subjectSlug}` as Route}>{subject.name}</Link>
            <span aria-hidden>/</span>
            <span>{topic.name}</span>
          </nav>
          <h1>{topic.name}</h1>
          <p>{topic.summary}</p>
        </div>
        <div className="header-actions">
          <Link className="primary-action" href={`/practice/${subjectSlug}/${topicSlug}` as Route}>
            Practise this topic
          </Link>
        </div>
      </header>

      <div className="subtopic-grid">
        {topic.subtopics.map((subtopic) => {
          const record = getRecord(profile.mastery, subtopic.id);
          const unlocked = isUnlocked(profile.mastery, subtopic.prerequisites);
          const reason = lockReason(profile.mastery, subtopic.prerequisites, (id) => nameById.get(id) ?? id);
          const hasLesson = Boolean(getLesson(subtopic.id));
          const questionCount = getQuestions(subtopic.id).length;
          const subtopicSlug = idSlug(subtopic.id);

          return (
            <article key={subtopic.id} className={`subtopic-card ${unlocked ? "" : "is-locked"}`}>
              <header>
                <h2>{subtopic.name}</h2>
                <MasteryBadge state={record.state} score={record.score} />
              </header>
              <p>{subtopic.summary}</p>

              <details className="objectives">
                <summary>{subtopic.objectives.length} learning objectives</summary>
                <ul>
                  {subtopic.objectives.map((objective) => (
                    <li key={objective.id}>{objective.text}</li>
                  ))}
                </ul>
              </details>

              {!unlocked && reason && <p className="lock-reason">{reason}</p>}

              <div className="subtopic-actions">
                {hasLesson ? (
                  <Link className="primary-action" href={`/learn/${subjectSlug}/${topicSlug}/${subtopicSlug}` as Route}>
                    Learn
                  </Link>
                ) : (
                  <span className="action-disabled">Lesson coming soon</span>
                )}
                {questionCount > 0 ? (
                  <Link className="secondary-action" href={`/practice/${subjectSlug}/${topicSlug}?subtopic=${subtopicSlug}` as Route}>
                    Practise ({questionCount})
                  </Link>
                ) : (
                  <span className="action-disabled">No questions yet</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
