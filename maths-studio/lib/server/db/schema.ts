import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";

export const educationLevelEnum = pgEnum("education_level", ["secondary", "university"]);
export const masteryStateEnum = pgEnum("mastery_state", [
  "not_started",
  "exploring",
  "developing",
  "proficient",
  "mastered",
]);
export const reviewStatusEnum = pgEnum("review_status", ["draft", "review", "published"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique(),
  email: text("email"),
  role: text("role").notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  preferredName: text("preferred_name").notNull(),
  ageBand: text("age_band").notNull().default("14-16"),
  educationLevel: educationLevelEnum("education_level").notNull().default("secondary"),
  classLevel: text("class_level").notNull(),
  curriculum: text("curriculum").notNull(),
  institution: text("institution"),
  programme: text("programme"),
  goal: text("goal").notNull(),
  onboarded: boolean("onboarded").notNull().default(false),
  diagnosticScore: integer("diagnostic_score").notNull().default(0),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(1),
  lastActiveDate: text("last_active_date"),
  lessonComplete: boolean("lesson_complete").notNull().default(false),
  practiceCorrect: integer("practice_correct").notNull().default(0),
  weakConcepts: jsonb("weak_concepts").$type<string[]>().default([]),
  accessibilityPreferences: jsonb("accessibility_preferences").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const concepts = pgTable("concepts", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  subjectId: text("subject_id").notNull(),
  prerequisites: jsonb("prerequisites").$type<string[]>().default([]),
  difficulty: integer("difficulty").notNull().default(1),
});

export const masteryEvidence = pgTable("mastery_evidence", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .references(() => studentProfiles.id)
    .notNull(),
  conceptId: text("concept_id").notNull(),
  correct: boolean("correct").notNull(),
  attempts: integer("attempts").notNull().default(1),
  hintsUsed: integer("hints_used").notNull().default(0),
  difficulty: integer("difficulty").notNull().default(1),
  scoreDelta: real("score_delta").notNull(),
  scoreAfter: real("score_after").notNull(),
  source: text("source").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const masteryEstimates = pgTable("mastery_estimates", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .references(() => studentProfiles.id)
    .notNull(),
  conceptId: text("concept_id").notNull(),
  score: real("score").notNull().default(0),
  state: masteryStateEnum("state").notNull().default("not_started"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const learningSessions = pgTable("learning_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .references(() => studentProfiles.id)
    .notNull(),
  lessonId: text("lesson_id").notNull(),
  currentStep: integer("current_step").notNull().default(0),
  equationStep: integer("equation_step").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  state: jsonb("state").$type<Record<string, unknown>>(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const attempts = pgTable("attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .references(() => studentProfiles.id)
    .notNull(),
  questionId: text("question_id").notNull(),
  conceptId: text("concept_id").notNull(),
  correct: boolean("correct").notNull(),
  selectedAnswer: text("selected_answer"),
  hintsUsed: integer("hints_used").notNull().default(0),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tutorTurns = pgTable("tutor_turns", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .references(() => studentProfiles.id)
    .notNull(),
  lessonId: text("lesson_id"),
  userMessage: text("user_message"),
  tutorResponse: text("tutor_response").notNull(),
  strategy: text("strategy").notNull(),
  promptVersion: text("prompt_version").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const curriculumPackages = pgTable("curriculum_packages", {
  id: text("id").primaryKey(),
  version: text("version").notNull(),
  educationLevel: educationLevelEnum("education_level").notNull(),
  educationSystem: text("education_system").notNull(),
  subject: text("subject").notNull(),
  reviewStatus: reviewStatusEnum("review_status").notNull().default("draft"),
  content: jsonb("content").$type<Record<string, unknown>>().notNull(),
  sources: jsonb("sources").$type<Record<string, unknown>[]>(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const guardianLinks = pgTable("guardian_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  guardianUserId: uuid("guardian_user_id")
    .references(() => users.id)
    .notNull(),
  studentId: uuid("student_id")
    .references(() => studentProfiles.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teacherClasses = pgTable("teacher_classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  teacherUserId: uuid("teacher_user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
