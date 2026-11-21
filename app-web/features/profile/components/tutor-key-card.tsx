"use client";

import { useActionState, useState, useTransition } from "react";
import { removeTutorKey, saveTutorKey, type TutorKeyResult } from "@/features/profile/server/tutor-key-actions";

/** Lets a student add their own online-model key. The saved key is never sent back here, only its last 4 characters. */
export function TutorKeyCard({ maskedKey }: { maskedKey: string | null }) {
  const [result, save, saving] = useActionState<TutorKeyResult | null, FormData>(saveTutorKey, null);
  const [removing, startRemove] = useTransition();
  const [removedMessage, setRemovedMessage] = useState<string | null>(null);

  return (
    <article className="profile-card tutor-key-card">
      <h2>Faster online tutor (optional)</h2>
      <p>
        Add your own free API key (for example from Groq) and the tutor answers much faster. Your questions and the lesson text
        you are reading are sent to that provider under your own account, so read its privacy terms first. Leave this empty to
        keep everything on this laptop.
      </p>
      {maskedKey ? (
        <p role="status">
          Key saved: <code>{maskedKey}</code>
        </p>
      ) : (
        <p>No key saved.</p>
      )}
      <form
        action={(formData) => {
          setRemovedMessage(null);
          save(formData);
        }}
        className="tutor-key-form"
      >
        <label>
          {maskedKey ? "Replace key" : "API key"}
          <input name="apiKey" type="password" autoComplete="off" spellCheck={false} placeholder="Paste your key" />
        </label>
        <div className="tutor-key-actions">
          <button type="submit" className="primary-action" disabled={saving}>
            {saving ? "Checking…" : "Save key"}
          </button>
          {maskedKey && (
            <button
              type="button"
              className="secondary-action"
              disabled={removing}
              onClick={() => startRemove(async () => setRemovedMessage((await removeTutorKey()).message))}
            >
              Remove key
            </button>
          )}
        </div>
      </form>
      {(removedMessage || result) && (
        <p role="status" className={!removedMessage && result && !result.ok ? "form-error" : undefined}>
          {removedMessage ?? result?.message}
        </p>
      )}
    </article>
  );
}
