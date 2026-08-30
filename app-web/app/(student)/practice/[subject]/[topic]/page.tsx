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

  const subject = resolveSubjectSlug(subjectSlug);
  if (!subject) notFound();
  const topic = resolveTopicSlug(subject, topicSlug);
  if (!topic) notFound();

  const profile = await readProfileOrDefault();
  if (!isTopicVisibleToClass(profile.classLevel, topic)) notFound();
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

  return (
    <div className="page" style={{ ["--accent" as string]: subject.accentColor }}>
      <PracticeSession
        title={subtopic ? subtopic.name : topic.name}
        scopeLabel={scopeLabel}
        questions={questions.map(toPublicQuestion)}
        backHref={`/library/${subjectSlug}/${topicSlug}`}
        subjectSlug={idSlug(subject.id)}
      />
    </div>
  );
}
