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
