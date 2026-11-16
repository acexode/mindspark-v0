import type { ModuleDraft } from "../undergrad-course";

/** Shared builders for the MBBS clinical-years (4-6) catalogue files. */
type Objectives = [string, string, string];

export const unit = (slug: string, name: string, summary: string, objectives: Objectives) => ({
  slug,
  name,
  summary,
  objectives,
});

export const mod = (
  slug: string,
  name: string,
  summary: string,
  units: ModuleDraft["units"],
): ModuleDraft => ({ slug, name, summary, units });
