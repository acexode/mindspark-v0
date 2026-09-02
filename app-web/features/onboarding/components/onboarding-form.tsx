"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveOnboarding } from "@/features/learning/server/actions";
import {
  subjectsForClass,
  type SelectableSubject,
} from "@/features/onboarding/lib/selectable-subjects";
import {
  SECONDARY_CLASS_LEVELS,
  UNDERGRADUATE_CLASS_LEVELS,
  type EducationLevel,
  type ExamTarget,
} from "@/lib/domain/student/types";
import type { Programme } from "@/lib/content/schema";

export type { SelectableSubject };

const EXAM_TARGETS: ExamTarget[] = ["WAEC", "NECO", "JAMB"];

export function OnboardingForm({ subjects, programmes }: { subjects: SelectableSubject[]; programmes: Programme[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [level, setLevel] = useState<EducationLevel>("secondary");
  const [classLevel, setClassLevel] = useState<string>("SS2");
  const [programmeId, setProgrammeId] = useState<string>(programmes[0]?.slug ?? "");
  const [semester, setSemester] = useState<1 | 2>(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [examTargets, setExamTargets] = useState<ExamTarget[]>([]);
  const [error, setError] = useState<string | null>(null);

  const available = subjectsForClass(subjects, level, classLevel).filter(
    (subject) => level !== "undergraduate" || !programmeId || subject.programmes.includes(programmeId),
  );
  const availableIds = new Set(available.map((subject) => subject.id));
  const classLevels = level === "secondary" ? SECONDARY_CLASS_LEVELS : UNDERGRADUATE_CLASS_LEVELS;
  const totalUnits = selectedSubjects
    .map((id) => subjects.find((s) => s.id === id))
    .reduce((sum, s) => sum + (s?.creditUnits ?? 0), 0);

  function pruneSelection(nextLevel: EducationLevel, nextClass: string, current: string[]) {
    const nextAvailable = subjectsForClass(subjects, nextLevel, nextClass);
    const ids = new Set(nextAvailable.map((subject) => subject.id));
    return current.filter((id) => ids.has(id));
  }

  function toggle<T>(list: T[], value: T, setter: (next: T[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function handleLevelChange(nextLevel: EducationLevel) {
    setLevel(nextLevel);
    const nextClass = nextLevel === "secondary" ? "SS2" : "Year1";
    setClassLevel(nextClass);
    setSelectedSubjects((current) => pruneSelection(nextLevel, nextClass, current));
  }

  function handleClassChange(nextClass: string) {
    setClassLevel(nextClass);
    setSelectedSubjects((current) => pruneSelection(level, nextClass, current));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const visibleSelected = selectedSubjects.filter((id) => availableIds.has(id));
    if (visibleSelected.length === 0) {
      setError("Choose at least one subject available for your class.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const programme = programmes.find((p) => p.slug === programmeId);
    startTransition(async () => {
      const result = await saveOnboarding({
        preferredName: String(form.get("preferredName") ?? ""),
        ageBand: String(form.get("ageBand") ?? "14-16") as "12-13" | "14-16" | "17-20" | "21+",
        educationLevel: level,
        classLevel,
        institution: String(form.get("institution") ?? "") || undefined,
        programme: programme?.name,
        programmeId: level === "undergraduate" ? programmeId || undefined : undefined,
        currentSemester: level === "undergraduate" ? semester : undefined,
        examTargets: examTargets.length > 0 ? examTargets : ["none"],
        selectedSubjectIds: visibleSelected,
        goal: String(form.get("goal") ?? "school") as "foundations" | "school" | "exam" | "research",
      });

      if (!result.ok) {
        setError("Please complete the required fields.");
        return;
      }
      router.push("/home");
      router.refresh();
    });
  }

  return (
    <main className="onboarding-page">
      <form className="onboarding-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Welcome to Mindspark</span>
        <h1>Learn it. Practise it. Prove it.</h1>
        <p className="onboarding-intro">
          Tell us what you study and we will build a learning path across your subjects.
        </p>

        <fieldset className="field-group">
          <legend>About you</legend>
          <label>
            Preferred name
            <input name="preferredName" required placeholder="Your name" autoComplete="given-name" />
          </label>

          <label>
            Education level
            <select
              name="educationLevel"
              value={level}
              onChange={(e) => handleLevelChange(e.target.value as EducationLevel)}
            >
              <option value="secondary">Secondary school</option>
              <option value="undergraduate">Undergraduate</option>
            </select>
          </label>

          <label>
            {level === "secondary" ? "Class" : "Year"}
            <select name="classLevel" value={classLevel} onChange={(e) => handleClassChange(e.target.value)}>
              {classLevels.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label>
            Age band
            <select name="ageBand" defaultValue={level === "secondary" ? "14-16" : "17-20"}>
              <option value="12-13">12–13</option>
              <option value="14-16">14–16</option>
              <option value="17-20">17–20</option>
              <option value="21+">21+</option>
            </select>
          </label>

          {level === "undergraduate" && (
            <>
              <label>
                Institution
                <input name="institution" placeholder="University name" />
              </label>
              <label>
                Programme
                <select value={programmeId} onChange={(e) => setProgrammeId(e.target.value)}>
                  {programmes.length === 0 && <option value="">No programmes published yet</option>}
                  {programmes.map((programme) => (
                    <option key={programme.slug} value={programme.slug}>
                      {programme.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Semester
                <select value={semester} onChange={(e) => setSemester(Number(e.target.value) as 1 | 2)}>
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </label>
            </>
          )}
        </fieldset>

        {level === "secondary" && (
          <fieldset className="field-group">
            <legend>Which exams are you preparing for?</legend>
            <div className="chip-row">
              {EXAM_TARGETS.map((target) => (
                <button
                  key={target}
                  type="button"
                  aria-pressed={examTargets.includes(target)}
                  className={`chip ${examTargets.includes(target) ? "is-selected" : ""}`}
                  onClick={() => toggle(examTargets, target, setExamTargets)}
                >
                  {target}
                </button>
              ))}
            </div>
            <p className="field-hint">Optional. Leave blank if you are studying for school only.</p>
          </fieldset>
        )}

        <fieldset className="field-group">
          <legend>{level === "undergraduate" ? "Which courses are you enrolled in?" : "Which subjects do you study?"}</legend>
          {available.length === 0 ? (
            <p className="field-hint">
              {level === "undergraduate" ? "No courses published for this programme yet." : `No subjects published for ${classLevel} yet.`}
            </p>
          ) : (
            <div className="subject-chip-grid">
              {available.map((subject) => {
                const selected = selectedSubjects.includes(subject.id);
                return (
                  <button
                    key={subject.id}
                    type="button"
                    aria-pressed={selected}
                    className={`subject-chip-select ${selected ? "is-selected" : ""}`}
                    style={{ ["--accent" as string]: subject.accentColor }}
                    onClick={() => toggle(selectedSubjects, subject.id, setSelectedSubjects)}
                  >
                    {subject.courseCode ? `${subject.courseCode} · ${subject.name}` : subject.name}
                    {subject.creditUnits ? ` (${subject.creditUnits}u)` : ""}
                  </button>
                );
              })}
            </div>
          )}
          <p className="field-hint">
            {level === "undergraduate"
              ? `${selectedSubjects.filter((id) => availableIds.has(id)).length} courses selected · ${totalUnits} units · you can add more later.`
              : `${selectedSubjects.filter((id) => availableIds.has(id)).length} selected for ${classLevel} · you can add more later.`}
          </p>
        </fieldset>

        <fieldset className="field-group">
          <legend>What is your main goal?</legend>
          <label className="sr-only" htmlFor="goal">
            Learning goal
          </label>
          <select id="goal" name="goal" defaultValue="school">
            <option value="foundations">Build strong foundations</option>
            <option value="school">Improve school performance</option>
            <option value="exam">Prepare for an exam</option>
            {level === "undergraduate" && <option value="research">Go deeper for research</option>}
          </select>
        </fieldset>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="primary-action" type="submit" disabled={pending}>
          {pending ? "Setting up…" : "Start learning"}
        </button>
      </form>
    </main>
  );
}
