import "server-only";

export type ProductEvent =
  | "diagnostic_completed"
  | "lesson_step_attempt"
  | "practice_completed"
  | "tutor_turn"
  | "mastery_updated"
  | "sync_batch"
  | "quest_completed";

export function trackEvent(event: ProductEvent, properties: Record<string, unknown> = {}) {
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event, properties);
  }
  // Production: forward to Vercel Analytics / structured logging pipeline
}

export function trackError(error: Error, context: Record<string, unknown> = {}) {
  console.error("[error]", error.message, context);
  // Production: Sentry.captureException(error, { extra: context })
}
