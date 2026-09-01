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
import { subjectProgression } from "@/lib/content/topic-progress";
import { LessonPlayer } from "@/features/lesson/components/lesson-player";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { EmptyState } from "@/components/ui/empty-state";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string; subtopic: string }>;
}) {
  const { subject: subjectSlug, topic: topicSlug, subtopic: subtopicSlug } = await params;

  const profile = await readProfileOrDefault();
  const subject = resolveSubjectSlug(subjectSlug, profile.educationLevel);
  if (!subject) notFound();
  const topic = resolveTopicSlug(subject, topicSlug);
  if (!topic) notFound();
  const subtopic = resolveSubtopicSlug(topic, subtopicSlug);
  if (!subtopic) notFound();

  if (!isClassVisible(profile.classLevel, classLevelsForSubtopic(topic, subtopic))) {
    notFound();
  }
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
