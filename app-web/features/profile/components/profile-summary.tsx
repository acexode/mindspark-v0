import Link from "next/link";
import type { Route } from "next";
import { idSlug } from "@/lib/content/loader";
import type { Subject } from "@/lib/content/schema";
import type { StudentProfile } from "@/lib/domain/student/types";

const GOAL_LABEL: Record<StudentProfile["goal"], string> = {
  foundations: "Building strong foundations",
  school: "Improving school performance",
  exam: "Preparing for an exam",
  research: "Going deeper for research",
};

interface ProfileSummaryProps {
  profile: StudentProfile;
  subjects: Subject[];
  answered: number;
  gamified: boolean;
}

/** Who the app thinks you are, at a glance, beside the form that changes it. */
export function ProfileSummary({ profile, subjects, answered, gamified }: ProfileSummaryProps) {
  const name = profile.preferredName || "Student";
  const isUndergraduate = profile.educationLevel === "undergraduate";
  const level = isUndergraduate
    ? [profile.programme, profile.classLevel.replace("Year", "Year "), profile.currentSemester ? `Semester ${profile.currentSemester}` : null]
        .filter(Boolean)
        .join(" · ")
    : `${profile.classLevel} · Secondary school`;
  const exams = profile.examTargets.filter((t) => t !== "none");

  return (
    <aside className="profile-summary">
      <div className="profile-id">
        <span className="profile-avatar" aria-hidden>
          {name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h2>{name}</h2>
          <p>{level}</p>
        </div>
      </div>

      <dl className="profile-facts">
        {gamified && (
          <div>
            <dt>XP</dt>
            <dd>{profile.xp}</dd>
          </div>
        )}
        {gamified && (
          <div>
            <dt>Streak</dt>
            <dd>
              {profile.streak} {profile.streak === 1 ? "day" : "days"}
            </dd>
          </div>
        )}
        <div>
          <dt>Answered</dt>
          <dd>{answered}</dd>
        </div>
        <div>
          <dt>{isUndergraduate ? "Courses" : "Subjects"}</dt>
          <dd>{subjects.length}</dd>
        </div>
      </dl>

      <section>
        <h3>Goal</h3>
        <p>{GOAL_LABEL[profile.goal]}</p>
        {!isUndergraduate && (
          <p className="profile-exams">
            {exams.length > 0 ? exams.map((exam) => <span key={exam} className="tag">{exam}</span>) : "No exam selected"}
          </p>
        )}
      </section>

      {subjects.length > 0 && (
        <section>
          <h3>{isUndergraduate ? "Your courses" : "Your subjects"}</h3>
          <ul className="profile-subjects">
            {subjects.map((subject) => (
              <li key={subject.id} style={{ ["--accent" as string]: subject.accentColor }}>
                <Link href={`/library/${idSlug(subject.id)}` as Route}>{subject.courseCode ?? subject.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
