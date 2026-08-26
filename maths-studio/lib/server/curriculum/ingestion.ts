import "server-only";
import { loadCurriculumPackage } from "./loader";

export interface IngestionJob {
  id: string;
  sourceUrl: string;
  status: "pending" | "processing" | "review" | "published" | "failed";
}

const jobQueue: IngestionJob[] = [];

export function queueCurriculumIngestion(sourceUrl: string): IngestionJob {
  const job: IngestionJob = {
    id: crypto.randomUUID(),
    sourceUrl,
    status: "pending",
  };
  jobQueue.push(job);
  return job;
}

export async function processIngestionJob(jobId: string): Promise<IngestionJob | null> {
  const job = jobQueue.find((j) => j.id === jobId);
  if (!job) return null;
  job.status = "processing";
  // AI-assisted normalization would run here via Inngest in production
  const existing = loadCurriculumPackage("waec-neco-algebra-linear-equations");
  job.status = existing.reviewStatus === "published" ? "published" : "review";
  return job;
}

export function listIngestionJobs(): IngestionJob[] {
  return [...jobQueue];
}
