"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, Brain, Target, Trophy } from "@phosphor-icons/react";
import { saveOnboarding } from "@/features/learning/server/actions";
import { useStudentProfile } from "@/features/student-profile/profile-provider";

export function OnboardingForm() {
  const router = useRouter();
  const { updateProfile } = useStudentProfile();
  const [pending, startTransition] = useTransition();
  const [educationLevel, setEducationLevel] = useState<"secondary" | "university">("secondary");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      const data = {
        preferredName: String(form.get("preferredName")),
        ageBand: String(form.get("ageBand")),
        educationLevel: String(form.get("educationLevel")),
        classLevel: String(form.get("classLevel")),
        curriculum: String(form.get("curriculum")),
        institution: String(form.get("institution") || ""),
        programme: String(form.get("programme") || ""),
        goal: String(form.get("goal")),
      };

      await saveOnboarding(data);
      updateProfile((current) => ({
        ...current,
        preferredName: data.preferredName,
        ageBand: data.ageBand as "12-13" | "14-16" | "17-20" | "21+",
        educationLevel: data.educationLevel as "secondary" | "university",
        classLevel: data.classLevel,
        curriculum: data.curriculum as "WAEC" | "NECO" | "WAEC_AND_NECO",
        institution: data.institution || undefined,
        programme: data.programme || undefined,
        goal: data.goal as "foundations" | "school" | "exam" | "research",
      }));
      router.push("/diagnostic");
    });
  }

  return (
    <main className="flow-page onboarding">
      <div className="flow-card">
        <span className="eyebrow">Welcome to Maths Studio</span>
        <h1>Learn maths by doing, not memorising.</h1>
        <p className="flow-intro">
          Answer a few quick questions and we&apos;ll build a learning path around what you already understand.
        </p>
        <div className="benefit-grid">
          <div>
            <Target aria-hidden />
            <strong>A path made for you</strong>
            <span>Lessons adapt as mastery grows.</span>
          </div>
          <div>
            <Brain aria-hidden />
            <strong>Hints that help you think</strong>
            <span>Guidance without giving answers away.</span>
          </div>
          <div>
            <Trophy aria-hidden />
            <strong>Progress you can prove</strong>
            <span>See skills you genuinely master.</span>
          </div>
        </div>
        <form className="onboarding-form" onSubmit={handleSubmit}>
          <label>
            Preferred name
            <input name="preferredName" required placeholder="Your name" />
          </label>
          <label>
            Education level
            <select
              name="educationLevel"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as "secondary" | "university")}
            >
              <option value="secondary">Secondary school</option>
              <option value="university">University</option>
            </select>
          </label>
          <label>
            Age band
            <select name="ageBand" defaultValue="14-16">
              <option value="12-13">12–13</option>
              <option value="14-16">14–16</option>
              <option value="17-20">17–20</option>
              <option value="21+">21+</option>
            </select>
          </label>
          {educationLevel === "secondary" ? (
            <>
              <label>
                Class level
                <select name="classLevel" defaultValue="SS2">
                  <option value="JSS3">JSS 3</option>
                  <option value="SS1">SS 1</option>
                  <option value="SS2">SS 2</option>
                  <option value="SS3">SS 3</option>
                </select>
              </label>
              <label>
                Exam track
                <select name="curriculum" defaultValue="WAEC_AND_NECO">
                  <option value="WAEC">WAEC</option>
                  <option value="NECO">NECO</option>
                  <option value="WAEC_AND_NECO">WAEC & NECO</option>
                </select>
              </label>
            </>
          ) : (
            <>
              <label>
                Institution
                <input name="institution" placeholder="University name" />
              </label>
              <label>
                Programme
                <select name="programme" defaultValue="Computer Science">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Business">Business</option>
                </select>
              </label>
              <input type="hidden" name="classLevel" value="Year 2" />
              <input type="hidden" name="curriculum" value="WAEC_AND_NECO" />
            </>
          )}
          <label>
            Learning goal
            <select name="goal" defaultValue="school">
              <option value="foundations">Build foundations</option>
              <option value="school">Improve school performance</option>
              <option value="exam">Exam preparation</option>
              {educationLevel === "university" && <option value="research">Research depth</option>}
            </select>
          </label>
          <button className="primary-action" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Start my diagnostic"}
            <ArrowRight aria-hidden />
          </button>
        </form>
        <small className="flow-footnote">About 2 minutes · No grades</small>
      </div>
    </main>
  );
}
