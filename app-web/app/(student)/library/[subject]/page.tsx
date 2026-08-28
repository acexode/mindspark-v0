import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getLesson, getQuestions, idSlug, resolveSubjectSlug } from "@/lib/content/loader";
import { aggregateMastery, getRecord } from "@/lib/domain/mastery/mastery";
import { MasteryBar, MasteryBadge } from "@/components/ui/mastery-badge";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectSlug } = await params;
  const subject = resolveSubjectSlug(subjectSlug);
  if (!subject) notFound();

  const profile = await readProfileOrDefault();

  return (
    <section className="page" style={{ ["--accent" as string]: subject.accentColor }}>
      <header className="page-header">
        <div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/library">Library</Link>
            <span aria-hidden>/</span>
            <span>{subject.name}</span>
          </nav>
          <h1>{subject.name}</h1>
          <p>{subject.description}</p>
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
            Practise this subject
          </Link>
          <Link className="secondary-action" href={`/quiz/${subjectSlug}/subject` as Route}>
            Take a quiz
          </Link>
        </div>
      </header>

      <ol className="topic-list">
        {subject.topics.map((topic) => {
          const agg = aggregateMastery(profile.mastery, topic.subtopics.map((s) => s.id));
          const topicSlug = idSlug(topic.id);

          return (
            <li key={topic.id} className="topic-row">
              <div className="topic-row-head">
                <div>
                  <h2>
                    <Link href={`/library/${subjectSlug}/${topicSlug}` as Route}>{topic.name}</Link>
                  </h2>
                  <p>{topic.summary}</p>
                  <p className="topic-meta">
                    {topic.subtopics.length} subtopics · {topic.classLevels.join(", ")}
                  </p>
                </div>
                <div className="topic-row-mastery">
                  <MasteryBadge state={agg.state} score={agg.score} />
                  <MasteryBar score={agg.score} label={`${topic.name} mastery`} />
                </div>
              </div>

              <ul className="subtopic-chips">
                {topic.subtopics.map((subtopic) => {
                  const record = getRecord(profile.mastery, subtopic.id);
                  const hasLesson = Boolean(getLesson(subtopic.id));
                  const questionCount = getQuestions(subtopic.id).length;
                  return (
                    <li key={subtopic.id}>
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
