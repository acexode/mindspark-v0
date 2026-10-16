import type { TutorRequest } from "@/features/tutor/server/request";

export type TutorSource = "ollama" | "ai" | "fallback";

const OFFLINE_TEXT = "I can't reach the tutor right now. Check your connection and try again.";

/**
 * Posts to the streaming route and reports the growing reply through `onText`.
 * Resolves with the provider that answered; a network failure resolves as "fallback"
 * with a plain message so the panel never throws.
 */
export async function streamReply(request: TutorRequest, onText: (text: string) => void): Promise<TutorSource> {
  try {
    const response = await fetch("/api/v1/tutor/stream", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok || !response.body) throw new Error("tutor request failed");

    const source = (response.headers.get("x-tutor-source") as TutorSource | null) ?? "fallback";
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      text += value;
      onText(text);
    }
    return source;
  } catch {
    onText(OFFLINE_TEXT);
    return "fallback";
  }
}
