import { NextResponse } from "next/server";
import { getSubjects, getSubjectStats, idSlug } from "@/lib/content/loader";
import { aggregateMastery } from "@/lib/domain/mastery/mastery";
import { allSubtopicIds } from "@/lib/content/navigation";
import { readProfileOrDefault } from "@/lib/server/profile/store";
import type { EducationLevel } from "@/lib/content/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") as EducationLevel | null;
  const profile = await readProfileOrDefault();

  const subjects = getSubjects(level ?? undefined).map((subject) => {
    const stats = getSubjectStats(subject);
    const mastery = aggregateMastery(profile.mastery, allSubtopicIds(subject));
    return {
      id: subject.id,
      slug: idSlug(subject.id),
      name: subject.name,
      shortName: subject.shortName,
      description: subject.description,
      level: subject.level,
      accentColor: subject.accentColor,
      icon: subject.icon,
      curricula: subject.curricula,
      stats,
      mastery,
      selected: profile.selectedSubjectIds.includes(subject.id),
    };
  });

  return NextResponse.json({ subjects });
}
