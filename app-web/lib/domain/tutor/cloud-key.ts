/** Defaults for a student's own online-tutor key. Groq is OpenAI-compatible and has a free tier. */
export const STUDENT_CLOUD_BASE_URL = "https://api.groq.com/openai/v1";
export const STUDENT_CLOUD_MODEL = "llama-3.3-70b-versatile";

/** Letters, digits, underscore and dash only, long enough to be a real key. Rejects pasted sentences and spaces. */
export function isPlausibleApiKey(value: string): boolean {
  return /^[A-Za-z0-9_-]{20,200}$/.test(value);
}

/** Shows only the last 4 characters, so the profile page can confirm a key is saved without revealing it. */
export function maskApiKey(key: string): string {
  return `••••••••${key.slice(-4)}`;
}

/** Best first. Plain chat models: the reasoning models spend the reply budget thinking and can come back empty. */
export const PREFERRED_CLOUD_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "openai/gpt-oss-20b"];

/** Speech, safety and embedding models that are listed beside the chat models but cannot answer a question. */
const NOT_A_CHAT_MODEL = /whisper|tts|orpheus|guard|safeguard|embed|moderation|transcri/i;

/**
 * Picks the model to ask from what the student's key can actually use. The operator's configured model wins when it is
 * available; otherwise the first preferred chat model; otherwise any chat model. Null when the list has nothing usable.
 */
export function chooseCloudModel(available: string[], configured?: string): string | null {
  if (configured && available.includes(configured)) return configured;
  const chat = available.filter((id) => !NOT_A_CHAT_MODEL.test(id));
  return PREFERRED_CLOUD_MODELS.find((id) => chat.includes(id)) ?? chat[0] ?? null;
}
