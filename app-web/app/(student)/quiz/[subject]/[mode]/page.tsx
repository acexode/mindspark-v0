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
  subject: { count: 20 },
  exam: { count: 40 },
  topic: { count: 10 },
} as const;

const MODE_LABELS = {
  secondary: { subject: "Subject quiz", exam: "Exam mock", topic: "Topic quiz" },
  undergraduate: { subject: "Continuous assessment", exam: "Mock exam", topic: "Module assessment" },
} as const;

/**
 * Minutes allowed per question, by difficulty. Easy gives the most thinking
 * time; medium sits close to easy so the step down doesn't feel punishing;
 * hard is a deliberately tight, exam-pressure pace.
 */
const DIFFICULTY_MINUTES_PER_QUESTION = {
  easy: 2.2,
  medium: 1.8,
  hard: 1.0,
} as const;

export type QuizDifficulty = keyof typeof DIFFICULTY_MINUTES_PER_QUESTION;

const DIFFICULTY_LABELS: Record<QuizDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function resolveDifficulty(value: string | undefined): QuizDifficulty {
  return value === "easy" || value === "medium" || value === "hard" ? value : "medium";
}

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string; mode: string }>;
  searchParams: Promise<{ topic?: string; difficulty?: string }>;
}) {
  const { subject: subjectSlug, mode } = await params;
  const { topic: topicSlug, difficulty: difficultyParam } = await searchParams;
  const config = MODES[mode as keyof typeof MODES];
  if (!config) notFound();
  const difficulty = resolveDifficulty(difficultyParam);
  const minutesPerQuestion = DIFFICULTY_MINUTES_PER_QUESTION[difficulty];

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
        durationSeconds={Math.round(questions.length * minutesPerQuestion * 60)}
        difficultyLabel={DIFFICULTY_LABELS[difficulty]}
        gamified={experienceFor(profile).gamification}
      />
    </div>
  );
}