import { notFound } from "next/navigation";
import { getQuestionsForSubject, resolveSubjectSlug, idSlug } from "@/lib/content/loader";
import { toPublicQuestion } from "@/lib/content/schema";
import { filterQuestionsByClass } from "@/lib/content/class-visibility";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { PracticeSession } from "@/features/practice/components/practice-session";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function SubjectPracticePage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: subjectSlug } = await params;
  const subject = resolveSubjectSlug(subjectSlug);
  if (!subject) notFound();

  const profile = await readProfileOrDefault();
  const questions = filterQuestionsByClass(getQuestionsForSubject(subject.id), subject, profile.classLevel);
  if (questions.length === 0) {
    return (
      <section className="page">
        <EmptyState
          title={`No questions yet for ${subject.name}`}
          description="Choose another subject or topic to practise."
          actionLabel="Back to practice"
          actionHref="/practice"
        />
      </section>
    );
  }

  return (
    <div className="page" style={{ ["--accent" as string]: subject.accentColor }}>
      <PracticeSession
        title={`${subject.name} — mixed practice`}
        scopeLabel={subject.name}
        questions={questions.map(toPublicQuestion)}
        backHref="/practice"
        subjectSlug={idSlug(subject.id)}
      />
    </div>
  );
}
