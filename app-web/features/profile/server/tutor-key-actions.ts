"use server";

import { revalidatePath } from "next/cache";
import { chooseCloudModel, isPlausibleApiKey, STUDENT_CLOUD_BASE_URL } from "@/lib/domain/tutor/cloud-key";
import { clearTutorKey, setTutorKey } from "@/lib/server/profile/tutor-key-store";

export interface TutorKeyResult {
  ok: boolean;
  message: string;
}

/**
 * Checks the key against the provider's model list, so a typo is caught now and not on the student's
 * next question. A network failure still saves the key (the student may be offline right now).
 */
async function verify(key: string): Promise<TutorKeyResult> {
  const baseUrl = (process.env.CLOUD_AI_BASE_URL ?? STUDENT_CLOUD_BASE_URL).replace(/\/+$/, "");
  try {
    const response = await fetch(`${baseUrl}/models`, {
      headers: { authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (response.status === 401 || response.status === 403) {
      return { ok: false, message: "The provider rejected this key. Check that you copied all of it." };
    }
    if (!response.ok) {
      return { ok: true, message: "Key saved, but the provider could not confirm it right now. It will be tried on your next question." };
    }
    const body = (await response.json().catch(() => null)) as { data?: Array<{ id?: string }> } | null;
    const ids = body?.data?.map((m) => m.id) ?? [];
    const model = chooseCloudModel(ids as string[], process.env.CLOUD_AI_MODEL);
    if (ids.length > 0 && !model) {
      return { ok: true, message: "Key saved and accepted, but it has no chat model the tutor can use. The laptop's model will answer." };
    }
    return {
      ok: true,
      message: `Key saved. The tutor will use the online model${model ? ` (${model})` : ""} first, and this laptop's model if it is unavailable.`,
    };
  } catch {
    return { ok: true, message: "Key saved, but there was no internet to check it. It will be tried on your next question." };
  }
}

export async function saveTutorKey(_previous: TutorKeyResult | null, formData: FormData): Promise<TutorKeyResult> {
  const key = String(formData.get("apiKey") ?? "").trim();
  if (!isPlausibleApiKey(key)) {
    return { ok: false, message: "That does not look like an API key. Paste the whole key, with no spaces." };
  }
  const result = await verify(key);
  if (!result.ok) return result;
  if (!(await setTutorKey(key))) {
    return { ok: false, message: "Finish setting up your profile first, then add the key." };
  }
  revalidatePath("/profile");
  return result;
}

export async function removeTutorKey(): Promise<TutorKeyResult> {
  await clearTutorKey();
  revalidatePath("/profile");
  return { ok: true, message: "Key removed. The tutor now uses only the model on this laptop." };
}
