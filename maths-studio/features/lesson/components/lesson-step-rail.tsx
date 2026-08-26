import { Check } from "@phosphor-icons/react/dist/ssr";

interface LessonStepRailProps {
  currentStep: number;
  solved: boolean;
}

const STEPS = ["Understand", "Watch", "Solve", "Reflect"];

export function LessonStepRail({ currentStep, solved }: LessonStepRailProps) {
  return (
    <div className="step-rail">
      {STEPS.map((label, index) => {
        const done = index < 2 || (solved && index === 2) || (solved && index === 3);
        const active = index === currentStep;
        return (
          <div className={`step ${done ? "done" : ""} ${active ? "active" : ""}`} key={label}>
            <span className="step-dot">{done ? <Check aria-hidden /> : index + 1}</span>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
