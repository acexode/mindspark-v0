/** Plain-language reason a model provider failed, safe to show a student. Never includes the request, the key or the raw body. */
export function describeProviderFailure(error: unknown): string {
  const e = (error ?? {}) as { statusCode?: number; status?: number; name?: string; message?: string; cause?: { code?: string } };
  const status = e.statusCode ?? e.status;
  if (status === 401 || status === 403) return "the key was rejected";
  if (status === 404) return "the model was not found";
  if (status === 429) return "the free usage limit was reached";
  if (status === 413) return "the request was too large for this plan";
  if (status !== undefined && status >= 500) return "the service had a problem";
  if (status !== undefined && status >= 400) return `the request was refused (${status})`;
  if (e.name === "AbortError" || e.name === "TimeoutError") return "it did not reply in time";
  const text = `${e.message ?? ""} ${e.cause?.code ?? ""}`;
  if (/ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed|Cannot connect|ECONNRESET/i.test(text)) return "it could not be reached";
  return "it returned an error";
}

const LABELS = { ollama: "The model on this laptop", cloud: "The online model", ai: "OpenAI" } as const;

export function failureNote(provider: keyof typeof LABELS, error: unknown): string {
  return `${LABELS[provider]} is unavailable: ${describeProviderFailure(error)}.`;
}
