"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateStudentProfile } from "@/features/learning/server/actions";
import {
  subjectsForClass,
  type SelectableSubject,
} from "@/features/onboarding/lib/selectable-subjects";
import {
  SECONDARY_CLASS_LEVELS,
  UNDERGRADUATE_CLASS_LEVELS,
  type AgeBand,
  type EducationLevel,
  type ExamTarget,
  type LearningGoal,
  type StudentProfile,
} from "@/lib/domain/student/types";
import type { Programme } from "@/lib/content/schema";

const EXAM_TARGETS: ExamTarget[] = ["WAEC", "NECO", "JAMB"];

interface ProfileFormProps {
  profile: StudentProfile;
  subjects: SelectableSubject[];
  programmes: Programme[];
}

export function ProfileForm({ profile, subjects, programmes }: ProfileFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [level, setLevel] = useState<EducationLevel>(profile.educationLevel);
  const [classLevel, setClassLevel] = useState(profile.classLevel);
  const [ageBand, setAgeBand] = useState<AgeBand>(profile.ageBand);
  const [goal, setGoal] = useState<LearningGoal>(profile.goal);
  const [programmeId, setProgrammeId] = useState<string>(profile.programmeId ?? programmes[0]?.slug ?? "");
  const [semester, setSemester] = useState<1 | 2>(profile.currentSemester ?? 1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(profile.selectedSubjectIds);
  const [examTargets, setExamTargets] = useState<ExamTarget[]>(
    profile.examTargets.filter((target) => target !== "none"),
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function handleLevelChange(nextLevel: EducationLevel) {
    setLevel(nextLevel);
    setSaved(false);
    const nextClassLevels: readonly string[] =
      nextLevel === "secondary" ? SECONDARY_CLASS_LEVELS : UNDERGRADUATE_CLASS_LEVELS;
    const nextClass = nextClassLevels.includes(classLevel) ? classLevel : nextClassLevels[0];
    setClassLevel(nextClass);
    setSelectedSubjects((current) => pruneSelection(nextLevel, nextClass, current));
    if (nextLevel === "undergraduate") {
      setExamTargets([]);
      if (goal === "exam") setGoal("school");
    } else if (goal === "research") {
      setGoal("school");
    }
  }

  function handleClassChange(nextClass: string) {
    setClassLevel(nextClass);
    setSaved(false);
    setSelectedSubjects((current) => pruneSelection(level, nextClass, current));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const visibleSelected = selectedSubjects.filter((id) => availableIds.has(id));
    if (visibleSelected.length === 0) {
      setError("Choose at least one subject available for your class.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const programme = programmes.find((p) => p.slug === programmeId);
    startTransition(async () => {
      const result = await updateStudentProfile({
        preferredName: String(form.get("preferredName") ?? ""),
        ageBand,
        educationLevel: level,
        classLevel,
        institution: String(form.get("institution") ?? "") || undefined,
        programme: programme?.name,
        programmeId: level === "undergraduate" ? programmeId || undefined : undefined,
        currentSemester: level === "undergraduate" ? semester : undefined,
        examTargets: examTargets.length > 0 ? examTargets : ["none"],
        selectedSubjectIds: visibleSelected,
        goal,
      });

      if (!result.ok) {
        setError("Please complete the required fields.");
        return;
      }

      setSelectedSubjects(visibleSelected);
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <fieldset className="field-group">
        <legend>About you</legend>
        <label>
          Preferred name
          <input
            name="preferredName"
            required
            defaultValue={profile.preferredName}
            placeholder="Your name"
            autoComplete="given-name"
            onChange={() => setSaved(false)}
          />
        </label>

        <label>
          Education level
          <select
            name="educationLevel"
            value={level}
            onChange={(event) => handleLevelChange(event.target.value as EducationLevel)}
          >
            <option value="secondary">Secondary school</option>
            <option value="undergraduate">Undergraduate</option>
          </select>
        </label>

        <label>
          {level === "secondary" ? "Class" : "Year"}
          <select name="classLevel" value={classLevel} onChange={(event) => handleClassChange(event.target.value)}>
            {classLevels.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label>
          Age band
          <select
            name="ageBand"
            value={ageBand}
            onChange={(event) => {
              setAgeBand(event.target.value as AgeBand);
              setSaved(false);
            }}
          >
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
              <input
                name="institution"
                defaultValue={profile.institution ?? ""}
                placeholder="University name"
                onChange={() => setSaved(false)}
              />
            </label>
            <label>
              Programme
              <select
                value={programmeId}
                onChange={(event) => {
                  setProgrammeId(event.target.value);
                  setSaved(false);
                }}
              >
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
              <select
                value={semester}
                onChange={(event) => {
                  setSemester(Number(event.target.value) as 1 | 2);
                  setSaved(false);
                }}
              >
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
                onClick={() => {
                  toggle(examTargets, target, setExamTargets);
                  setSaved(false);
                }}
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
                  onClick={() => {
                    toggle(selectedSubjects, subject.id, setSelectedSubjects);
                    setSaved(false);
                  }}
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
            ? `${selectedSubjects.filter((id) => availableIds.has(id)).length} courses selected · ${totalUnits} units`
            : `${selectedSubjects.filter((id) => availableIds.has(id)).length} selected for ${classLevel}`}
        </p>
      </fieldset>

      <fieldset className="field-group">
        <legend>What is your main goal?</legend>
        <label className="sr-only" htmlFor="profile-goal">
          Learning goal
        </label>
        <select
          id="profile-goal"
          name="goal"
          value={goal}
          onChange={(event) => {
            setGoal(event.target.value as LearningGoal);
            setSaved(false);
          }}
        >
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
      {saved && !error && (
        <p className="form-success" role="status">
          Profile saved.
        </p>
      )}

      <button className="primary-action" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
