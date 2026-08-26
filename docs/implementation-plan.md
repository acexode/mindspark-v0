# Mindspark implementation plan

## 1. Product boundary

Build the first production-quality adaptive-learning vertical slice for one primary persona:

- Nigerian secondary-school student, age 12–16
- Initial curriculum: WAEC/NECO Mathematics
- Initial strand: Algebra
- Initial topic: Linear Equations
- Primary surface: desktop/laptop web application at 1440 × 900, responsive down to smaller laptop widths
- Product success metric: learning gained per unit of meaningful effort, not time spent

The first release must make one end-to-end journey trustworthy and useful:

Onboarding → Diagnostic → Home → Lesson → Tutor Help → Practice → Mastery Update → Reward → Knowledge Map → Next Recommendation

The selected visual direction is Maths Studio: a calm, notebook-like study environment with a slim desktop rail, wide interactive workspace, contextual margin tutor, evidence-based mastery, and restrained rewards.

## 2. What the draft branch establishes

The branch provides a useful interaction prototype:

- connected screens for onboarding, a three-question diagnostic, Today, lesson, practice, progress, and map;
- local demo persistence;
- a coherent desktop visual language based on the selected direction;
- a working lesson-to-practice-to-progress loop;
- Sites-compatible build output.

It does not yet provide curriculum identity, real adaptivity, reliable assessment, a tutor service, mastery evidence, durable accounts, content provenance, offline synchronization, safety controls, or product-level automated tests.

## 3. MVP capabilities

### 3.1 Student identity and onboarding

Collect only the inputs needed to personalize the first path:

- first name or preferred name;
- age band;
- class level: JSS/SSS and year;
- exam track: WAEC, NECO, or both;
- Mathematics goal: build foundations, improve school performance, or exam preparation;
- optional diagnostic consent and accessibility preferences.

Do not collect a long learning-style questionnaire. Infer useful preferences from behavior and allow the student to change presentation options explicitly.

### 3.2 Curriculum-backed content

Create a small reviewed curriculum package for Algebra and Linear Equations:

- canonical concepts and stable identifiers;
- WAEC/NECO curriculum mappings;
- learning objectives;
- prerequisite graph;
- worked examples and misconceptions;
- question bank tagged by objective, difficulty, format, and misconception;
- source provenance, review status, version, and publication state.

Initial concept graph:

Number operations → Variables and expressions → Equality and inverse operations → One-step equations → Two-step linear equations → Variables on both sides → Simultaneous equations

### 3.3 Adaptive diagnostic

Use a short branching diagnostic, initially 6–10 questions with an early-stop rule:

- start near the expected class-level difficulty;
- move up after confident success;
- probe a prerequisite after an error;
- distinguish slips from repeated misconceptions;
- produce concept-level evidence, not one overall percentage;
- explain the result in student language and recommend the first activity.

### 3.4 Lesson runtime

Represent lessons as structured sequences rather than hard-coded pages:

- hook;
- concept explanation;
- visual/manipulative interaction;
- worked example;
- student attempt;
- tutor feedback;
- challenge;
- recap and reflection.

The Linear Equations lesson should support an equation-state model. Every student operation must transform both sides, be validated mathematically, and produce targeted feedback. Wrong moves remain visible long enough to diagnose and correct.

### 3.5 Contextual tutor

The tutor receives a constrained learning context:

- student age band and class;
- curriculum and active objective;
- current equation state;
- recent attempts, hint use, and detected misconception;
- mastered prerequisites;
- approved explanation strategies and content sources.

Tutor behavior:

- ask a Socratic question first when appropriate;
- offer progressive hints rather than immediately revealing an answer;
- provide a genuinely different representation for “I still don’t understand”;
- never invent curriculum claims;
- disclose uncertainty and fall back to reviewed content;
- log safety and quality signals without storing unnecessary free-form data.

### 3.6 Practice and assessment

Support numerical and multiple-choice answers in the first release, with equation-entry as the next format. Each question records:

- objective and difficulty;
- answer correctness;
- attempt count and response time band;
- hints requested;
- misconception classification;
- explanation shown;
- mastery impact.

Practice adapts within the session: reinforce a prerequisite after repeated errors and increase complexity after consistent independent success.

### 3.7 Mastery and recommendation

Store mastery per student and concept. Initial states:

Not Started → Exploring → Developing → Proficient → Mastered

The first mastery model should be deterministic and explainable. Inputs include correctness, difficulty, attempts, hint use, independent transfer, and retention checks. Completion alone never advances mastery. Record immutable evidence events and derive the current mastery estimate from them.

The recommendation service chooses one primary next action and explains why: continue the lesson, repair a prerequisite, practise, or revisit for retention.

### 3.8 Meaningful rewards and knowledge map

Reward demonstrated learning:

- XP based on difficulty and independence;
- daily learning consistency with humane streak protection;
- “clean solve,” “recovered from a misconception,” and concept-mastery achievements;
- map nodes unlocked through evidence, not page visits.

The first map shows the Algebra prerequisite chain, current mastery state, why a node is locked, and the recommended route forward.

## 4. Technical architecture

Use a Next.js modular monolith for the MVP, with clear domain boundaries inside one deployable application. Avoid premature microservices and a separately deployed backend.

### 4.1 Suggested stack

- Application: Next.js App Router + React + TypeScript, with route groups for student experiences and server-only domain modules for trusted learning logic.
- UI/data access: Server Components by default, Client Components only for interactive lesson surfaces, Server Actions for tightly scoped mutations, Route Handlers for public or reusable HTTP contracts, accessible component primitives, and KaTeX/MathLive for mathematics.
- Domain layer: framework-independent TypeScript modules for diagnostics, equation validation, mastery, recommendations, rewards, tutor orchestration, and curriculum rules. UI components must not calculate authoritative XP, mastery, completion, or unlocks.
- Database and data access: PostgreSQL through a typed ORM, with migrations and explicit transaction boundaries.
- Queue/background work: PostgreSQL-backed job queue initially; introduce Redis only when operationally justified.
- Object storage: curriculum source documents and generated assets.
- AI: provider abstraction with structured outputs, prompt/version registry, retrieval from reviewed curriculum content, evaluation fixtures, and cost/latency telemetry.
- Authentication: managed identity provider with age-aware flows and optional guardian linkage; no custom password system.
- Observability: structured logs, traces, product events, error monitoring, and AI quality events.

### 4.2 Domain modules

- Identity and Student Profile
- Curriculum and Provenance
- Content and Lesson Runtime
- Assessment and Attempts
- Mastery and Evidence
- Recommendations
- Tutor Orchestration
- Gamification
- Offline Sync
- Safety and Moderation
- Analytics and Audit

### 4.3 Core data model

Key entities:

- StudentProfile, GuardianLink, AccessibilityPreference
- Curriculum, CurriculumSource, CurriculumVersion, CurriculumMapping
- Subject, Module, Topic, Concept, Prerequisite, LearningObjective
- Lesson, LessonVersion, LessonStep, LearningAsset
- Question, QuestionVersion, QuestionObjective, Misconception
- LearningSession, Attempt, HintEvent, TutorTurn
- MasteryEvidence, MasteryEstimate, RetentionSchedule
- Recommendation, RewardEvent, Streak, Achievement
- ContentReview, SafetyFlag, AuditEvent

All curriculum and generated content must retain source, version, review status, and publication status.

### 4.4 Application and API seams

Use direct server-side domain calls from Server Components when no external contract is needed. Expose Route Handlers for interactive clients, offline synchronization, AI streaming, and future first-party consumers. Keep these contracts versionable even though they initially live in the same Next.js repository.

- `POST /onboarding`
- `POST /diagnostics` and `POST /diagnostics/:id/attempts`
- `GET /home/recommendation`
- `GET /lessons/:lessonId`
- `POST /sessions/:sessionId/steps/:stepId/attempts`
- `POST /tutor/turns`
- `GET /practice/next`
- `GET /mastery`
- `GET /knowledge-map`
- `GET /rewards`
- `POST /sync/batch`

Return structured domain results; do not allow the client to set XP, mastery, completion, or unlocks directly.

## 5. Delivery phases

### Phase 0 — Stabilize the prototype foundation

- Migrate the Vite prototype into a Next.js App Router application without visually redesigning the selected Maths Studio direction.
- Reformat and decompose the single-file prototype into route, feature, UI, and server-domain modules.
- Add TypeScript, route groups, layouts, loading/error boundaries, and a typed state model.
- Establish server-only module guards so curriculum, scoring, mastery, reward, and tutor authority cannot be imported into client bundles.
- Add unit, component, accessibility, and end-to-end test infrastructure.
- Preserve the selected Maths Studio visual language and capture baseline screenshots.
- Replace demo reset and localStorage authority with a development-only fixture layer.

Exit criteria: all current screens render through routes, the current journey has an automated happy-path test, and visual regression baselines exist.

### Phase 1 — Curriculum package and student identity

- Define the canonical Algebra graph and WAEC/NECO mappings.
- Ingest and record authoritative source documents.
- Add review/version/publish workflow for the initial content package.
- Implement age/class/curriculum/goal onboarding and authentication.

Exit criteria: a student profile selects a published, source-linked Linear Equations pathway.

### Phase 2 — Diagnostic and recommendation

- Build concept-tagged diagnostic items and branching logic.
- Persist attempts and initial mastery evidence.
- Generate the first explainable Home recommendation.
- Add diagnostic result and prerequisite-repair states.

Exit criteria: different answer patterns lead to different mastery maps and next activities.

### Phase 3 — Interactive Linear Equations lesson

- Build the lesson schema and renderer.
- Implement the equation-state engine and balance/inverse-operation interactions.
- Add misconception-aware feedback and progressive hints.
- Persist resumable lesson sessions.

Exit criteria: invalid operations cannot earn completion; the lesson resumes safely after refresh or reconnection.

### Phase 4 — Tutor vertical slice

- Implement grounded tutor orchestration using reviewed curriculum context.
- Add Socratic, hint-ladder, alternative-representation, and escalation behaviors.
- Add age-appropriate safety policy, moderation, traceability, and evaluation cases.
- Measure latency and provide deterministic fallback guidance when AI is unavailable.

Exit criteria: tutor responses pass a curated Linear Equations accuracy, pedagogy, age-appropriateness, and safety evaluation suite.

### Phase 5 — Practice, mastery, rewards, and map

- Implement adaptive practice selection and immediate feedback.
- Add immutable mastery evidence and explainable estimates.
- Add retention scheduling and transfer questions.
- Connect rewards and node unlocks to validated evidence.
- Complete the Algebra knowledge-map interaction.

Exit criteria: lesson and practice evidence update mastery consistently, unlock the correct map state, and generate a justified next recommendation.

### Phase 6 — Offline, accessibility, and production hardening

- Add PWA manifest, service worker, downloadable lesson packages, queued attempts, conflict-safe sync, and data-saver controls.
- Test keyboard navigation, screen-reader flow, zoom, contrast, reduced motion, captions, and dyslexia-friendly settings.
- Add rate limiting, privacy controls for minors, backups, audit trails, content rollback, and operational dashboards.
- Run performance budgets on representative low-spec hardware and constrained networks.

Exit criteria: the core lesson is usable on intermittent connectivity, meets agreed WCAG criteria, and passes security/reliability readiness checks.

## 6. Testing strategy

- Unit: equation transformations, diagnostic branching, scoring, mastery updates, streak and reward rules.
- Contract: API schemas, content versions, tutor structured outputs, synchronization payloads.
- Component: every lesson step, hint state, error state, keyboard flow, and responsive layout.
- End-to-end: new student journey, weak-prerequisite journey, successful mastery journey, offline resume, and AI fallback.
- Curriculum quality: source mapping, mathematical correctness, misconception coverage, and review status.
- AI evaluation: factual accuracy, hint quality, non-repetition after “I still don’t understand,” age appropriateness, prompt injection resistance, and refusal/fallback behavior.
- Visual regression: 1440 × 900 primary viewport plus smaller laptop breakpoints.
- Performance: startup, lesson interaction latency, tutor response latency, cached startup, and sync recovery.

## 7. Analytics and success measures

Instrument meaningful events without invasive surveillance:

- diagnostic completion and abandonment;
- objective-level attempts and misconception recovery;
- independent success after hints;
- mastery gain per active learning minute;
- retention-check performance;
- next-recommendation acceptance;
- tutor helpfulness and alternative-explanation success;
- lesson resume and offline sync reliability.

Primary MVP outcome: measurable mastery gain on the Linear Equations objective after a short learning session, confirmed by an independent transfer question.

## 8. Immediate implementation backlog

1. Create the Next.js App Router foundation and migrate the current screens without changing their approved visual direction.
2. Split `App.jsx` into routed feature components and server-only domain modules using TypeScript.
3. Add Vitest, React Testing Library, axe, and Playwright.
4. Define shared types for student profile, concepts, lesson steps, attempts, mastery evidence, and recommendations.
5. Implement the equation-state engine with unit tests before expanding the lesson UI.
6. Create the reviewed Linear Equations curriculum fixture and provenance metadata.
7. Replace localStorage-owned mastery/XP with trusted Next.js server mutations, then PostgreSQL persistence.
8. Implement Nigerian class/curriculum/goal onboarding.
9. Replace the fixed diagnostic with a branching diagnostic state machine.
10. Connect lesson attempts to mastery evidence and a deterministic recommendation service.
11. Add grounded tutor orchestration only after content and attempt context are reliable.

## 9. Explicit non-goals for the first production slice

- University programmes or non-Mathematics subjects
- Parent, teacher, league, or admin product surfaces beyond the minimum content-review workflow
- Full national or international curriculum coverage
- Open-ended AI generation without reviewed sources
- Native mobile layouts
- Microservices, complex real-time infrastructure, or advanced competitive gamification

These remain future domains, but the data model and content identifiers should not prevent their later addition.
