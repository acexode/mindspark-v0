import { getProgrammes, getSubjects } from "@/lib/content/loader";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { toSelectableSubjects } from "@/features/onboarding/lib/selectable-subjects";

export const metadata = { title: "Get started — Mindspark" };

// Programmes and courses come from content.db, which can be restored after `next build`.
// Without this the page is prerendered at build time and goes stale.
export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  const subjects = toSelectableSubjects(getSubjects());
  const programmes = getProgrammes();

  return <OnboardingForm subjects={subjects} programmes={programmes} />;
}
