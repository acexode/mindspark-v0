import { getProgrammes, getSubject, getSubjects } from "@/lib/content/loader";
import { toSelectableSubjects } from "@/features/onboarding/lib/selectable-subjects";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ProfileSummary } from "@/features/profile/components/profile-summary";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import { experienceFor } from "@/lib/domain/student/experience";

export const metadata = { title: "Profile — Mindspark" };

export default async function ProfilePage() {
  const profile = await readProfileOrDefault();
  const subjects = toSelectableSubjects(getSubjects());
  const programmes = getProgrammes();
  const gamified = experienceFor(profile).gamification;
  const mySubjects = profile.selectedSubjectIds.map((id) => getSubject(id)).filter((s) => s !== null);
  const answered = Object.values(profile.answeredQuestionIds).reduce((sum, ids) => sum + ids.length, 0);

  return (
    <section className="page profile-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Profile</span>
          <h1>Your profile</h1>
          <p>What Mindspark knows about you. It decides which topics, lessons and questions you see.</p>
        </div>
      </header>

      <div className="profile-layout">
        <ProfileSummary profile={profile} subjects={mySubjects} answered={answered} gamified={gamified} />
        <article className="profile-card profile-edit-card">
          <ProfileForm profile={profile} subjects={subjects} programmes={programmes} />
        </article>
      </div>
    </section>
  );
}
