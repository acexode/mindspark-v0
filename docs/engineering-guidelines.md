# Mindspark engineering guidelines

These rules govern implementation unless a later architecture decision record explicitly replaces them.

## 1. Architectural principles

1. Build a Next.js modular monolith. Keep deployment simple while enforcing domain boundaries in code.
2. Organize by product feature and domain, not by generic file type alone.
3. Use Server Components by default. Add `"use client"` only at the smallest interactive boundary.
4. Keep authoritative learning rules server-only. Clients may request an action but may not assign mastery, XP, completion, rewards, or unlocks.
5. Keep domain logic framework-independent and deterministic wherever possible.
6. Prefer explicit data flow and composition over global mutable state.
7. Do not introduce abstractions until at least two real consumers justify them.

## 2. Repository structure

```text
app/                    Next.js routes, layouts, loading and error boundaries
components/
  ui/                   reusable product-agnostic primitives
  layout/               application shell and navigation
features/
  <feature>/
    components/         feature-specific UI
    data/               fixtures and data access for the feature
    hooks/              feature-specific client hooks
    server/             server actions and orchestration
    types.ts            public feature contracts
lib/
  domain/               pure learning-domain logic
  server/               database, auth, queues and server-only integrations
  utils/                small cross-cutting utilities
public/                 static assets only
tests/                  cross-feature and end-to-end tests
```

Routes compose features; they do not contain business rules or large UI implementations.

## 3. Components

- One clear responsibility per component.
- Use semantic HTML before adding ARIA.
- Define typed props and keep public props minimal.
- Use composition instead of large boolean-driven components.
- Place a component in `components/ui` only when it is product-agnostic and reused.
- Place learning-specific components beside their feature.
- Avoid files larger than roughly 250 lines; split by responsibility before they become difficult to review.
- Do not duplicate interaction, loading, empty, error, or feedback patterns.
- Every interactive control must have visible hover, focus, disabled, and success/error states where relevant.

## 4. State and data

- Treat the URL as the source of truth for navigation.
- Keep transient interaction state local to the owning component.
- Use context only for truly cross-route client concerns.
- Use server data as the source of truth for durable student state.
- During Phase 0, browser persistence is a development adapter behind a typed interface, never mixed into UI components.
- Record attempts as immutable evidence events; derive mastery and rewards from evidence.
- Validate all external input at the server boundary.

## 5. Domain logic

- Equation transformations, diagnostic branching, mastery updates, recommendations, and reward rules live in `lib/domain`.
- Domain functions accept typed values and return typed results without reading browser, network, database, or framework state.
- Use stable curriculum and concept identifiers rather than display labels as keys.
- Make decisions explainable: every mastery or recommendation result includes contributing evidence and a reason.

## 6. Styling and design

- Preserve the approved Maths Studio visual direction.
- Use design tokens for color, typography, spacing, borders, and motion.
- Avoid one-off inline style values except for genuinely dynamic values such as progress percentages.
- Desktop is primary; support smaller laptop widths without converting the interface into a native-mobile pattern.
- Respect reduced motion, keyboard navigation, zoom, and high-contrast needs.

## 7. TypeScript and code quality

- Enable strict TypeScript.
- Avoid `any`; use `unknown` plus narrowing at trust boundaries.
- Use named exports for reusable modules.
- Prefer small pure functions and early returns.
- Name by domain meaning, not implementation detail.
- Comments explain why or constraints, not what readable code already says.
- Formatting and linting must pass before commit.

## 8. Testing

- Unit-test every domain rule, including incorrect and boundary cases.
- Component-test meaningful interaction and accessibility states.
- End-to-end-test the primary student journey and failure recovery.
- Hosting/build tests do not replace product behavior tests.
- A bug fix includes a regression test when practical.
- Tests use stable roles, labels, and test IDs only when semantic queries are insufficient.

## 9. Security, privacy and AI safety

- Minimize data collected from minors.
- Never expose secrets or server-only policy in client bundles.
- Do not trust client-calculated learning outcomes.
- Ground tutor responses in reviewed curriculum content and record prompt/model/content versions.
- Add deterministic fallbacks for AI unavailability or low-confidence output.
- Do not log sensitive free-form student content by default.

## 10. Definition of done

A change is done when:

- architecture boundaries remain intact;
- types, lint, unit tests and production build pass;
- the primary interaction works in a real browser;
- keyboard and visible focus behavior are verified;
- loading, empty, error and success states are considered;
- relevant documentation and fixtures are updated;
- no unrelated files or generated artifacts are committed.
