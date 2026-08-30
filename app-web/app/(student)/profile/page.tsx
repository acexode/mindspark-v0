import { getSubjects } from "@/lib/content/loader";
import { toSelectableSubjects } from "@/features/onboarding/lib/selectable-subjects";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export const metadata = { title: "Profile — Mindspark" };

export default async function ProfilePage() {
  const profile = await readProfileOrDefault();
  const subjects = toSelectableSubjects(getSubjects());

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Profile</span>
          <h1>{profile.preferredName ? profile.preferredName : "Your profile"}</h1>
          <p>Update the details you shared when you started learning.</p>
        </div>
        <div className="header-stats">
          <div>
            <span>XP</span>
            <strong>{profile.xp}</strong>
          </div>
          <div>
            <span>Streak</span>
            <strong>{profile.streak} days</strong>
          </div>
        </div>
      </header>

      <article className="profile-card profile-edit-card">
        <ProfileForm profile={profile} subjects={subjects} />
      </article>
    </section>
  );
}
