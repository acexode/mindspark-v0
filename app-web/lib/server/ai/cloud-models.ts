import "server-only";
import { chooseCloudModel, STUDENT_CLOUD_BASE_URL } from "@/lib/domain/tutor/cloud-key";

const TTL_MS = 10 * 60_000;
const FAILURE_TTL_MS = 60_000;
const cache = new Map<string, { at: number; model: string | undefined }>();

/**
 * Asks the provider which models this key may use and picks one, so a model name that is retired or not enabled on the
 * student's account never leaves them with a dead online tutor. Cached per key; a failed lookup (offline) is remembered
 * for a minute so it never slows every question. Returns undefined to mean "use the configured default".
 */
export async function resolveCloudModel(apiKey: string, env: Record<string, string | undefined> = process.env): Promise<string | undefined> {
  const hit = cache.get(apiKey);
  if (hit && Date.now() - hit.at < (hit.model ? TTL_MS : FAILURE_TTL_MS)) return hit.model;

  const baseUrl = (env.CLOUD_AI_BASE_URL ?? STUDENT_CLOUD_BASE_URL).replace(/\/+$/, "");
  let model: string | undefined;
  try {
    const response = await fetch(`${baseUrl}/models`, {
      headers: { authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (response.ok) {
      const body = (await response.json()) as { data?: Array<{ id?: string }> };
      const ids = (body.data ?? []).map((m) => m.id).filter((id): id is string => typeof id === "string");
      model = chooseCloudModel(ids, env.CLOUD_AI_MODEL) ?? undefined;
    }
  } catch {
    // Offline or slow: fall back to the configured default.
  }
  if (cache.size > 200) cache.clear();
  cache.set(apiKey, { at: Date.now(), model });
  return model;
}
