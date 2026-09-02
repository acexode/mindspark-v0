import { notFound } from "next/navigation";
import { getQuestionsForSubject, getQuestionsForTopic, idSlug, resolveSubjectSlug, resolveTopicSlug } from "@/lib/content/loader";
import { toPublicQuestion } from "@/lib/content/schema";
import { filterQuestionsByClass } from "@/lib/content/class-visibility";
import { filterQuestionsByUnlockedTopics, progressionContextFor, subjectProgression } from "@/lib/content/topic-progress";
import { balancedSample } from "@/lib/domain/assessment/shuffle";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { experienceFor } from "@/lib/domain/student/experience";
import { QuizSession } from "@/features/quiz/components/quiz-session";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

const MODES = {
  subject: { count: 20, minutesPerQuestion: 1.5 },
  exam: { count: 40, minutesPerQuestion: 1.5 },
  topic: { count: 10, minutesPerQuestion: 1.5 },
} as const;

const MODE_LABELS = {
  secondary: { subject: "Subject quiz", exam: "Exam mock", topic: "Topic quiz" },
  undergraduate: { subject: "Continuous assessment", exam: "Mock exam", topic: "Module assessment" },
} as const;

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string; mode: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { subject: subjectSlug, mode } = await params;
  const { topic: topicSlug } = await searchParams;
  const config = MODES[mode as keyof typeof MODES];
  if (!config) notFound();

  const profile = await readProfileOrDefault();
  const subject = resolveSubjectSlug(subjectSlug, profile.educationLevel);
  if (!subject) notFound();

  const progression = subjectProgression(subject, progressionContextFor(profile));
  const topic = mode === "topic" && topicSlug ? resolveTopicSlug(subject, topicSlug) : null;
  const scopedQuestions = topic ? getQuestionsForTopic(topic.id) : getQuestionsForSubject(subject.id);
  const pool = filterQuestionsByUnlockedTopics(
    filterQuestionsByClass(scopedQuestions, subject, profile.classLevel),
    progression.unlockedSubtopicIds,
  );
  const label = MODE_LABELS[profile.educationLevel][mode as keyof typeof MODES];

  if (pool.length < 5) {
    return (
      <section className="page">
        <EmptyState
          title={`Not enough questions for ${topic ? topic.name : `a ${subject.name}`} assessment`}
          description={`${topic ? "This module" : "This subject"} needs at least five published questions.`}
          actionLabel="Back to assessments"
          actionHref="/quiz"
        />
      </section>
    );
  }

  const questions = balancedSample(pool, config.count);

  return (
    <div className="page" style={{ ["--accent" as string]: subject.accentColor }}>
      <QuizSession
        title={`${topic ? topic.name : subject.name} — ${label}`}
        subjectName={subject.name}
        subjectSlug={idSlug(subject.id)}
        questions={questions.map(toPublicQuestion)}
        durationSeconds={Math.round(questions.length * config.minutesPerQuestion * 60)}
        gamified={experienceFor(profile).gamification}
      />
    </div>
  );
}