import { notFound } from "next/navigation";
import { getQuestionsForSubject, idSlug, resolveSubjectSlug } from "@/lib/content/loader";
import { toPublicQuestion } from "@/lib/content/schema";
import { QuizSession } from "@/features/quiz/components/quiz-session";
import { EmptyState } from "@/components/ui/empty-state";

const MODES = {
  subject: { label: "Subject quiz", count: 20, minutesPerQuestion: 1.5 },
  exam: { label: "Exam mock", count: 40, minutesPerQuestion: 1.5 },
  topic: { label: "Topic quiz", count: 10, minutesPerQuestion: 1.5 },
} as const;

export default async function QuizPage({
  params,
}: {
  params: Promise<{ subject: string; mode: string }>;
}) {
  const { subject: subjectSlug, mode } = await params;
  const config = MODES[mode as keyof typeof MODES];
  if (!config) notFound();

  const subject = resolveSubjectSlug(subjectSlug);
  if (!subject) notFound();

  const pool = getQuestionsForSubject(subject.id);
  if (pool.length < 5) {
    return (
      <section className="page">
        <EmptyState
          title={`Not enough questions for a ${subject.name} quiz`}
          description="This subject needs at least five published questions."
          actionLabel="Back to quizzes"
          actionHref="/quiz"
        />
      </section>
    );
  }

  const questions = balancedSample(pool, config.count);

  return (
    <div className="page" style={{ ["--accent" as string]: subject.accentColor }}>
      <QuizSession
        title={`${subject.name} — ${config.label}`}
        subjectName={subject.name}
        subjectSlug={idSlug(subject.id)}
        questions={questions.map(toPublicQuestion)}
        durationSeconds={Math.round(questions.length * config.minutesPerQuestion * 60)}
      />
    </div>
  );
}

/** Spreads the sample across difficulties so a quiz is never all easy or all hard. */
function balancedSample<T extends { difficulty: number }>(pool: T[], count: number): T[] {
  const byDifficulty = new Map<number, T[]>();
  for (const item of pool) {
    byDifficulty.set(item.difficulty, [...(byDifficulty.get(item.difficulty) ?? []), item]);
  }

  const selected: T[] = [];
  const difficulties = [...byDifficulty.keys()].sort();
  let index = 0;

  while (selected.length < Math.min(count, pool.length)) {
    const difficulty = difficulties[index % difficulties.length];
    const bucket = byDifficulty.get(difficulty);
    const next = bucket?.shift();
    if (next) selected.push(next);
    index += 1;
    if (difficulties.every((d) => (byDifficulty.get(d)?.length ?? 0) === 0)) break;
  }

  return selected;
}
