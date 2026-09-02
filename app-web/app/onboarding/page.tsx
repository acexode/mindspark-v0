import { getProgrammes, getSubjects } from "@/lib/content/loader";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { toSelectableSubjects } from "@/features/onboarding/lib/selectable-subjects";

export const metadata = { title: "Get started — Mindspark" };

export default function OnboardingPage() {
  const subjects = toSelectableSubjects(getSubjects());
  const programmes = getProgrammes();

  return <OnboardingForm subjects={subjects} programmes={programmes} />;
}
