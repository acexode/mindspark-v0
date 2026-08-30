import { notFound } from "next/navigation";
import {
  getLesson,
  getQuestionById,
  idSlug,
  resolveSubjectSlug,
  resolveSubtopicSlug,
  resolveTopicSlug,
} from "@/lib/content/loader";
import { toPublicQuestion } from "@/lib/content/schema";
import { classLevelsForSubtopic, isClassVisible } from "@/lib/content/class-visibility";
import { LessonPlayer } from "@/features/lesson/components/lesson-player";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { EmptyState } from "@/components/ui/empty-state";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string; subtopic: string }>;
}) {
  const { subject: subjectSlug, topic: topicSlug, subtopic: subtopicSlug } = await params;

  const subject = resolveSubjectSlug(subjectSlug);
  if (!subject) notFound();
  const topic = resolveTopicSlug(subject, topicSlug);
  if (!topic) notFound();
  const subtopic = resolveSubtopicSlug(topic, subtopicSlug);
  if (!subtopic) notFound();

  const profile = await readProfileOrDefault();
  if (!isClassVisible(profile.classLevel, classLevelsForSubtopic(topic, subtopic))) {
    notFound();
  }

  const lesson = getLesson(subtopic.id);
  if (!lesson) {
    return (
      <section className="page">
        <EmptyState
          title={`No lesson published for ${subtopic.name} yet`}
          description="You can still practise this subtopic if it has questions."
          actionLabel={`Back to ${topic.name}`}
          actionHref={`/library/${subjectSlug}/${topicSlug}` as never}
        />
      </section>
    );
  }

  const checkQuestions = lesson.blocks
    .filter((block): block is { type: "check"; questionId: string } => block.type === "check")
    .map((block) => getQuestionById(block.questionId))
    .filter((question) => question !== null)
    .map(toPublicQuestion);

  return (
    <div className="lesson-page" style={{ ["--accent" as string]: subject.accentColor }}>
      <LessonPlayer
        lesson={lesson}
        checkQuestions={checkQuestions}
        subjectId={subject.id}
        subjectName={subject.name}
        topicName={topic.name}
        subtopicName={subtopic.name}
        practiceHref={`/practice/${subjectSlug}/${topicSlug}?subtopic=${idSlug(subtopic.id)}`}
        breadcrumb={{
          subjectHref: `/library/${subjectSlug}`,
          topicHref: `/library/${subjectSlug}/${topicSlug}`,
        }}
      />
    </div>
  );
}
