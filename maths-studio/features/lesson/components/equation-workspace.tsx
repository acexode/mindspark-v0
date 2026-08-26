"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowRight, Check, FloppyDisk, Lightbulb, SealCheck, X } from "@phosphor-icons/react";
import type { EquationOperation } from "@/lib/domain/equations/types";
import { EQUATION_STEPS } from "@/lib/domain/equations/types";
import { assessBalanceStep } from "@/features/learning/server/actions";
import { useStudentProfile } from "@/features/student-profile/profile-provider";
import { LessonStepRail } from "./lesson-step-rail";
import { ContextualTutor } from "@/features/tutor/components/contextual-tutor";

const operationLabels: Record<EquationOperation, string> = {
  "subtract-five": "Subtract 5 from both sides",
  "add-five": "Add 5 to both sides",
  "divide-three": "Divide both sides by 3",
};

export function EquationWorkspace() {
  const { profile, updateProfile, refreshProfile } = useStudentProfile();
  const [equationStep, setEquationStep] = useState(profile.lessonComplete ? 4 : 0);
  const [operation, setOperation] = useState<EquationOperation>("subtract-five");
  const [solved, setSolved] = useState(profile.lessonComplete);
  const [feedback, setFeedback] = useState("Apply the same operation to both sides.");
  const [tutorOpen, setTutorOpen] = useState(true);
  const [pending, startTransition] = useTransition();

  const currentStepData = EQUATION_STEPS[equationStep] ?? EQUATION_STEPS[0];
  const lessonComplete = equationStep >= 4;

  function checkReasoning() {
    startTransition(async () => {
      const result = await assessBalanceStep({ operation, currentStep: equationStep, hintsUsed: 0 });
      setFeedback(result.feedback);
      if (result.correct) {
        setSolved(true);
        if (result.nextStep !== null) {
          setEquationStep(result.nextStep);
          if (result.nextStep === 2) {
            setOperation("divide-three");
            setSolved(false);
            setFeedback("Good. Now isolate x — what operation removes the coefficient?");
          }
        }
        updateProfile((current) => ({
          ...current,
          lessonComplete: current.lessonComplete || result.lessonComplete,
          xp: current.xp + result.xpAwarded,
          linearEquationsMastery: result.mastery,
        }));
        await refreshProfile();
      } else {
        setSolved(false);
      }
    });
  }

  return (
    <>
      <section className="workspace">
        <header className="lesson-header">
          <div className="breadcrumbs">
            Lessons
            <ArrowRight aria-hidden />
            Algebra
            <ArrowRight aria-hidden />
            Linear Equations
            <ArrowRight aria-hidden />
            <span>Solving by Balancing</span>
          </div>
          <div className="lesson-title-row">
            <div>
              <h1>Solving Linear Equations</h1>
              <p>
                Solve for x: <strong>3x + 5 = 20</strong>
              </p>
            </div>
            <LessonStepRail currentStep={lessonComplete ? 3 : equationStep >= 2 ? 2 : 1} solved={lessonComplete} />
          </div>
        </header>
        <section className="worked-example">
          <span className="hand-label">Worked example</span>
          <div className="example-flow">
            <b>3x + 5 = 20</b>
            <em>
              Subtract 5
              <br />
              from both sides
            </em>
            <ArrowRight aria-hidden />
            <b>3x + 5 − 5 = 20 − 5</b>
            <ArrowRight aria-hidden />
            <b>3x = 15</b>
            <em>
              Divide both
              <br />
              sides by 3
            </em>
            <ArrowRight aria-hidden />
            <b>x = 5</b>
          </div>
        </section>
        <section className="notebook">
          <div className="notebook-top">
            <div>
              <span className="hand-label">Your step</span>
              <p>{currentStepData.label ?? "Apply the operation to both sides. Keep the equation balanced."}</p>
            </div>
            <label className="operation-field">
              <span className="sr-only">Choose an operation</span>
              <select
                value={operation}
                onChange={(event) => {
                  setOperation(event.target.value as EquationOperation);
                  setSolved(false);
                }}
              >
                {Object.entries(operationLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="equation-lines">
            <div className="line-number">1</div>
            <div className="equation">3x + 5 = 20</div>
            <div className="annotation red">Starting equation</div>
            <div className="line-number">2</div>
            <div className={`equation input-line ${solved ? "checked" : ""}`}>
              3x + 5{" "}
              <span>{operation === "subtract-five" ? "− 5" : operation === "add-five" ? "+ 5" : "÷ 3"}</span> = 20{" "}
              <span>{operation === "subtract-five" ? "− 5" : operation === "add-five" ? "+ 5" : "÷ 3"}</span>
              <i />
            </div>
            <div className={`annotation ${solved ? "green" : operation === "subtract-five" && equationStep === 0 ? "" : "red"}`}>
              {feedback}
            </div>
            {equationStep >= 2 && (
              <>
                <div className="line-number">3</div>
                <div className="equation">3x = 15</div>
                <div className="annotation">Simplify both sides</div>
              </>
            )}
            {equationStep >= 4 && (
              <>
                <div className="line-number">4</div>
                <div className="equation fraction-row">
                  <span>
                    <u>3x</u>
                    <u>3</u>
                  </span>{" "}
                  ={" "}
                  <span>
                    <u>15</u>
                    <u>3</u>
                  </span>
                </div>
                <div className="line-number">5</div>
                <div className="equation">x = 5</div>
                <div className="annotation">Solution</div>
              </>
            )}
          </div>
          <div className="notebook-footer">
            <button className="hint-button" type="button" onClick={() => setTutorOpen(true)}>
              <Lightbulb aria-hidden />
              Need a hint?
            </button>
            <button className="check-button" disabled={pending || lessonComplete} type="button" onClick={checkReasoning}>
              {pending ? "Checking…" : lessonComplete ? (
                <>
                  <Check aria-hidden />
                  Lesson complete
                </>
              ) : (
                <>
                  Check my reasoning
                  <ArrowRight aria-hidden />
                </>
              )}
            </button>
            <div className="craft-actions">
              <SealCheck size={58} aria-hidden />
              <Link href={lessonComplete ? "/practice/linear-equations" : "#lesson-step"} aria-disabled={!lessonComplete}>
                <FloppyDisk aria-hidden />
                {lessonComplete ? "Continue to practice" : "Save best solution"}
              </Link>
            </div>
          </div>
          {lessonComplete && (
            <div className="success-toast">
              <Check aria-hidden />
              Nice work. Your mastery evidence was updated.
              <button type="button" onClick={() => setSolved(false)} aria-label="Dismiss success message">
                <X aria-hidden />
              </button>
            </div>
          )}
        </section>
      </section>
      <ContextualTutor open={tutorOpen} solved={solved} equationStep={equationStep} onOpenChange={setTutorOpen} />
    </>
  );
}
