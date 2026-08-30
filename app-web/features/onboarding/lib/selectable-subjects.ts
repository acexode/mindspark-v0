import { filterSubjectForClass } from "@/lib/content/class-visibility";
import type { Subject } from "@/lib/content/schema";
import {
  SECONDARY_CLASS_LEVELS,
  UNDERGRADUATE_CLASS_LEVELS,
  type EducationLevel,
} from "@/lib/domain/student/types";

export interface SelectableSubject {
  id: string;
  name: string;
  level: EducationLevel;
  accentColor: string;
  /** Class/year values that have at least one topic for this subject. */
  visibleForClasses: string[];
}

export function toSelectableSubjects(subjects: Subject[]): SelectableSubject[] {
  return subjects.map((subject) => {
    const classPool =
      subject.level === "secondary" ? SECONDARY_CLASS_LEVELS : UNDERGRADUATE_CLASS_LEVELS;

    return {
      id: subject.id,
      name: subject.name,
      level: subject.level,
      accentColor: subject.accentColor,
      visibleForClasses: classPool.filter(
        (classLevel) => filterSubjectForClass(subject, classLevel).topics.length > 0,
      ),
    };
  });
}

export function subjectsForClass(
  subjects: SelectableSubject[],
  educationLevel: EducationLevel,
  classLevel: string,
): SelectableSubject[] {
  return subjects.filter(
    (subject) => subject.level === educationLevel && subject.visibleForClasses.includes(classLevel),
  );
}
