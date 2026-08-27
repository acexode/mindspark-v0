"use server";

import { getLesson, getSubtopic } from "@/lib/content/loader";
import { generateTutorTurn, type TutorReply } from "@/lib/server/ai/tutor";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export interface TutorRequest {
  subjectName: string;
  subtopicId?: string;
  userMessage?: string;
  alternateExplanation?: boolean;
}

export async function askTutor(request: TutorRequest): Promise<TutorReply> {
  const profile = await readProfileOrDefault();
  const entry = request.subtopicId ? getSubtopic(request.subtopicId) : null;
  const lesson = request.subtopicId ? getLesson(request.subtopicId) : null;

  const groundingText = lesson?.blocks
    .map((block) =>
      block.type === "text"
        ? block.markdown
        : block.type === "callout"
          ? `${block.title}: ${block.text}`
          : block.type === "summary"
            ? block.points.join(" ")
            : "",
    )
    .filter(Boolean)
    .join("\n\n");

  return generateTutorTurn({
    ageBand: profile.ageBand,
    educationLevel: profile.educationLevel,
    subjectName: entry?.subject.name ?? request.subjectName,
    topicName: entry?.topic.name,
    subtopicName: entry?.subtopic.name,
    objectives: entry?.subtopic.objectives.map((o) => o.text) ?? [],
    groundingText,
    alternateExplanation: request.alternateExplanation ?? false,
    userMessage: request.userMessage,
  });
}
