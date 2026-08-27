import { getSubjects } from "@/lib/content/loader";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";

export const metadata = { title: "Get started — Mindspark" };

export default function OnboardingPage() {
  const subjects = getSubjects().map((subject) => ({
    id: subject.id,
    name: subject.name,
    level: subject.level,
    accentColor: subject.accentColor,
  }));

  return <OnboardingForm subjects={subjects} />;
}
