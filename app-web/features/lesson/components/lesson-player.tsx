"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import type { ContentBlock, Lesson, PublicQuestion } from "@/lib/content/schema";
import { ContentBlockView } from "./content-block";
import { QuestionCard } from "@/features/practice/components/question-card";
import { recordLessonVisit } from "@/features/learning/server/actions";
import { useEffect } from "react";

interface AdjacentUnit {
  name: string;
  href: string;
}

interface LessonPlayerProps {
  lesson: Lesson;
  checkQuestions: PublicQuestion[];
  subjectId: string;
  subjectName: string;
  topicName: string;
  subtopicName: string;
  practiceHref: string;
  breadcrumb: { subjectHref: string; topicHref: string };
  /** This unit's position within its module, e.g. { index: 2, total: 5 }. */
  unitPosition?: { index: number; total: number } | null;
  prevUnit?: AdjacentUnit | null;
  nextUnit?: AdjacentUnit | null;
}

export function LessonPlayer({
  lesson,
  checkQuestions,
  subjectId,
  subjectName,
  topicName,
  subtopicName,
  practiceHref,
  breadcrumb,
  unitPosition,
  prevUnit,
  nextUnit,
}: LessonPlayerProps) {
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);

  useEffect(() => {
    void recordLessonVisit(subjectId, lesson.subtopicId);
  }, [subjectId, lesson.subtopicId]);

  const checkCount = lesson.blocks.filter((b) => b.type === "check").length;

  return (
    <article className="lesson">
      <header className="lesson-header">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/library">Library</Link>
          <span aria-hidden>/</span>
          <Link href={breadcrumb.subjectHref as Route}>{subjectName}</Link>
          <span aria-hidden>/</span>
          <Link href={breadcrumb.topicHref as Route}>{topicName}</Link>
          <span aria-hidden>/</span>
          <span>{subtopicName}</span>
        </nav>
        <h1>{lesson.title}</h1>
        <p className="lesson-meta">
          {unitPosition && `Unit ${unitPosition.index} of ${unitPosition.total} · `}
          {lesson.estimatedMinutes} min read · {lesson.objectiveIds.length} objectives
          {checkCount > 0 && ` · ${completedChecks.length}/${checkCount} checks done`}
        </p>
      </header>

      <div className="lesson-body">
        {lesson.blocks.map((block, index) => (
          <LessonBlock
            key={index}
            block={block}
            checkQuestions={checkQuestions}
            onCheckAnswered={(id) =>
              setCompletedChecks((current) => (current.includes(id) ? current : [...current, id]))
            }
          />
        ))}
      </div>

      <footer className="lesson-footer">
        <p>Ready to prove it? Practice is where mastery is earned.</p>
        <Link className="primary-action" href={practiceHref as Route}>
          Practise {subtopicName}
        </Link>
      </footer>

      {(prevUnit || nextUnit) && (
        <nav className="lesson-unit-nav" aria-label="Unit navigation">
          {prevUnit ? (
            <Link href={prevUnit.href as Route} className="secondary-action">
              ← {prevUnit.name}
            </Link>
          ) : (
            <span />
          )}
          {nextUnit && (
            <Link href={nextUnit.href as Route} className="secondary-action">
              {nextUnit.name} →
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}

function LessonBlock({
  block,
  checkQuestions,
  onCheckAnswered,
}: {
  block: ContentBlock;
  checkQuestions: PublicQuestion[];
  onCheckAnswered: (questionId: string) => void;
}) {
  if (block.type === "check") {
    const question = checkQuestions.find((q) => q.id === block.questionId);
    if (!question) return null;
    return (
      <section className="lesson-check">
        <h3>Quick check</h3>
        <QuestionCard question={question} onAnswered={() => onCheckAnswered(question.id)} compact />
      </section>
    );
  }

  return <ContentBlockView block={block} />;
}
