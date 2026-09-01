import { notFound } from "next/navigation";
import {
  getQuestions,
  getQuestionsForTopic,
  idSlug,
  resolveSubjectSlug,
  resolveSubtopicSlug,
  resolveTopicSlug,
} from "@/lib/content/loader";
import { toPublicQuestion } from "@/lib/content/schema";
import { classLevelsForSubtopic, filterQuestionsByClass, isClassVisible, isTopicVisibleToClass } from "@/lib/content/class-visibility";
import { subjectProgression } from "@/lib/content/topic-progress";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { PracticeSession } from "@/features/practice/components/practice-session";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function TopicPracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string; topic: string }>;
  searchParams: Promise<{ subtopic?: string }>;
}) {
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const { subtopic: subtopicSlug } = await searchParams;

  const profile = await readProfileOrDefault();
  const subject = resolveSubjectSlug(subjectSlug, profile.educationLevel);
  if (!subject) notFound();
  const topic = resolveTopicSlug(subject, topicSlug);
  if (!topic) notFound();

  if (!isTopicVisibleToClass(profile.classLevel, topic)) notFound();
  const progression = subjectProgression(subject, profile.classLevel, profile.mastery, profile.topicPracticeBest);
  if (!progression.isUnlocked(topic.id)) {
    const reason = progression.lockReason(topic.id);
    const blocker = progression.blocker(topic.id);
    return (
      <section className="page">
        <EmptyState
          title={`${topic.name} is locked`}
          description={reason ?? "Finish the previous topic first."}
          descriptionLabel="Why this is locked"
          actionLabel={blocker ? `Practise ${blocker.name}` : `Back to ${subject.name}`}
          actionHref={
            blocker
              ? (`/practice/${subjectSlug}/${idSlug(blocker.id)}` as never)
              : (`/library/${subjectSlug}` as never)
          }
        />
      </section>
    );
  }
  const subtopic = subtopicSlug ? resolveSubtopicSlug(topic, subtopicSlug) : null;
  if (subtopic && !isClassVisible(profile.classLevel, classLevelsForSubtopic(topic, subtopic))) notFound();
  const questions = filterQuestionsByClass(
    subtopic ? getQuestions(subtopic.id) : getQuestionsForTopic(topic.id),
    subject,
    profile.classLevel,
  );
  const scopeLabel = subtopic ? `${subject.name} · ${subtopic.name}` : `${subject.name} · ${topic.name}`;

  if (questions.length === 0) {
    return (
      <section className="page">
        <EmptyState
          title={`No questions yet for ${subtopic?.name ?? topic.name}`}
          description="Try another topic in this subject."
          actionLabel={`Back to ${subject.name}`}
          actionHref={`/library/${subjectSlug}` as never}
        />
      </section>
    );
  }

  const nextTopic = progression.items[progression.items.findIndex((item) => item.id === topic.id) + 1];

  return (
    <div className="page" style={{ ["--accent" as string]: subject.accentColor }}>
      <PracticeSession
        title={subtopic ? subtopic.name : topic.name}
        scopeLabel={scopeLabel}
        questions={questions.map(toPublicQuestion)}
        backHref={`/library/${subjectSlug}/${topicSlug}`}
        subjectSlug={idSlug(subject.id)}
        checkpointTopicId={subtopic ? undefined : topic.id}
        nextTopicName={subtopic ? undefined : (nextTopic?.name ?? null)}
      />
    </div>
  );
}
