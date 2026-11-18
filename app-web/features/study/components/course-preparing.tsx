import type { CourseAvailability } from "@/lib/content/availability";

/** Shown on a course page while some units have not been generated yet. Ready units stay openable below. */
export function CoursePreparing({ availability }: { availability: CourseAvailability }) {
  if (availability.missing.length === 0) return null;
  return (
    <aside className="course-preparing" role="status">
      <strong>This course is being prepared</strong>
      <p>
        {availability.ready} of {availability.total} units are ready to study now. The rest are queued and will appear
        here as soon as they are written.
      </p>
    </aside>
  );
}
