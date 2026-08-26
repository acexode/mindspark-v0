import type { StudentProfile } from "@/lib/domain/student/types";

export interface StudentProfileRepository {
  get(): Promise<StudentProfile | null>;
  save(profile: StudentProfile): Promise<StudentProfile>;
  update(updater: (current: StudentProfile) => StudentProfile): Promise<StudentProfile>;
  reset(): Promise<void>;
}

export interface MasteryEvidenceRecord {
  studentId: string;
  conceptId: string;
  correct: boolean;
  attempts: number;
  hintsUsed: number;
  difficulty: 1 | 2 | 3;
  scoreDelta: number;
  scoreAfter: number;
  source: string;
}

export interface MasteryRepository {
  recordEvidence(record: MasteryEvidenceRecord): Promise<number>;
  getScore(conceptId: string): Promise<number>;
  getAllScores(): Promise<Record<string, number>>;
}

export interface LearningSessionRecord {
  id: string;
  lessonId: string;
  currentStep: number;
  equationStep: number;
  completed: boolean;
}

export interface SessionRepository {
  getActive(lessonId: string): Promise<LearningSessionRecord | null>;
  save(session: Omit<LearningSessionRecord, "id"> & { id?: string }): Promise<LearningSessionRecord>;
}
