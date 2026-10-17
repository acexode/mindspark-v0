import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getLesson, getQuestions, idSlug, resolveSubjectSlug, resolveTopicSlug } from "@/lib/content/loader";
import { filterTopicsForClass } from "@/lib/content/class-visibility";
import { progressionContextFor, subjectProgression } from "@/lib/content/topic-progress";
import { getRecord, isUnlocked, lockReason } from "@/lib/domain/mastery/mastery";
import { coveredSubtopicIds } from "@/lib/domain/student/coverage";
import { LessonList, type LessonListItem } from "@/features/library/components/lesson-list";
import { EmptyState } from "@/components/ui/empty-state";
import { LessonTutor } from "@/features/tutor/components/lesson-tutor";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const profile = await readProfileOrDefault();
  const subject = resolveSubjectSlug(subjectSlug, profile.educationLevel);
  if (!subject) notFound();
  const rawTopic = resolveTopicSlug(subject, topicSlug);
  if (!rawTopic) notFound();

  const topic = filterTopicsForClass([rawTopic], profile.classLevel)[0];
  if (!topic) notFound();
  const progression = subjectProgression(subject, progressionContextFor(profile));
  if (!progression.isUnlocked(topic.id)) {
    const reason = progression.lockReason(topic.id);
    const blocker = progression.blocker(topic.id);
    return (
      <section className="page">
        <EmptyState
          title={`${topic.name} is locked`}
          description={reason ?? "Finish the previous topic first."}
          descriptionLabel="Why this is locked"
          actionLabel={blocker ? `Go to ${blocker.name}` : `Back to ${subject.name}`}
          actionHref={
            blocker
              ? (`/library/${subjectSlug}/${idSlug(blocker.id)}` as never)
              : (`/library/${subjectSlug}` as never)
          }
        />
      </section>
    );
  }
  const nameById = new Map(
    subject.topics.flatMap((t) => t.subtopics.map((s) => [s.id, s.name] as const)),
  );

  const items: LessonListItem[] = topic.subtopics.map((subtopic) => {
    const subtopicSlug = idSlug(subtopic.id);
    const questionCount = getQuestions(subtopic.id).length;
    const unlocked = isUnlocked(profile.mastery, subtopic.prerequisites);
    return {
      id: subtopic.id,
      name: subtopic.name,
      summary: subtopic.summary,
      objectives: subtopic.objectives,
      record: getRecord(profile.mastery, subtopic.id),
      reached: coveredSubtopicIds(profile, [subtopic.id]).length > 0,
      learnHref: getLesson(subtopic.id) ? `/learn/${subjectSlug}/${topicSlug}/${subtopicSlug}` : null,
      practiceHref: questionCount > 0 ? `/practice/${subjectSlug}/${topicSlug}?subtopic=${subtopicSlug}` : null,
      questionCount,
      suggestion: unlocked ? null : lockReason(profile.mastery, subtopic.prerequisites, (id) => nameById.get(id) ?? id),
    };
  });
  const reachedCount = items.filter((i) => i.reached).length;
  const nextUp = items.find((i) => !i.reached && i.learnHref) ?? null;

  return (
    <section className="page topic-page" style={{ ["--accent" as string]: subject.accentColor }}>
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
          <p className="subject-page-meta">
            {reachedCount} of {items.length} lessons started
            {(progression.practiceBest[topic.id] ?? 0) > 0 ? ` · best topic practice ${progression.practiceBest[topic.id]}%` : ""}
          </p>
        </div>
        <div className="header-actions">
          {nextUp?.learnHref && (
            <Link className="primary-action" href={nextUp.learnHref as Route}>
              {reachedCount === 0 ? "Start" : "Next"}: {nextUp.name}
            </Link>
          )}
          {reachedCount > 0 && (
            <Link className={nextUp ? "secondary-action" : "primary-action"} href={`/practice/${subjectSlug}/${topicSlug}` as Route}>
              Practise this topic
            </Link>
          )}
        </div>
      </header>

      <LessonList items={items} />

      <LessonTutor scope={{ subjectName: subject.name, topicId: topic.id }} heading={`Ask about ${topic.name}`} />
    </section>
  );
}
