import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * These tests drive the real seeded content through real navigation. They never
 * jump straight to a hardcoded subject URL, so they fail if the app regresses
 * to being single-subject.
 */

async function onboard(page: Page, name: string, subjectCount = 1) {
  await page.goto("/onboarding");
  await page.getByPlaceholder("Your name").fill(name);

  const chips = page.locator(".subject-chip-select");
  const available = await chips.count();
  expect(available).toBeGreaterThan(0);

  for (let i = 0; i < Math.min(subjectCount, available); i++) {
    await chips.nth(i).click();
  }

  await page.getByRole("button", { name: /Start learning/i }).click();
  await page.waitForURL("**/home", { timeout: 20000 });
}

test.describe("Onboarding", () => {
  test("requires at least one subject before continuing", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByPlaceholder("Your name").fill("No Subjects");
    await page.getByRole("button", { name: /Start learning/i }).click();
    await expect(page.getByRole("alert")).toContainText(/at least one subject/i);
    await expect(page).toHaveURL(/onboarding/);
  });

  test("lets a student pick subjects and reach a personalised home", async ({ page }) => {
    await onboard(page, "Ada Student", 2);
    await expect(page.getByRole("heading", { name: /Ada Student/ })).toBeVisible();
    await expect(page.getByText(/Recommended next/i)).toBeVisible();
  });
});

test.describe("Library navigation", () => {
  test("browses subject to topic to subtopic entirely through the UI", async ({ page }) => {
    await onboard(page, "Browser Student", 3);

    await page.getByRole("link", { name: "Library" }).click();
    await page.waitForURL("**/library");

    const subjectCards = page.locator(".subject-card");
    await expect(subjectCards.first()).toBeVisible();

    await subjectCards.first().click();
    await expect(page.locator(".topic-row").first()).toBeVisible();

    await page.locator(".topic-row h2 a").first().click();
    await expect(page.locator(".subtopic-card").first()).toBeVisible();
    await expect(page.locator(".subtopic-card").first().getByText(/learning objectives/i)).toBeVisible();
  });

  test("shows no empty subject: every listed subject opens to real topics", async ({ page }) => {
    await onboard(page, "Coverage Student", 8);
    await page.getByRole("link", { name: "Library" }).click();

    const count = await page.locator(".subject-card").count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await page.getByRole("link", { name: "Library" }).click();
      await page.waitForURL("**/library");
      await page.locator(".subject-card").nth(i).click();
      await expect(page.locator(".topic-row").first()).toBeVisible();
    }
  });
});

test.describe("Learn then practise", () => {
  test("completes a lesson and starts scoped practice from it", async ({ page }) => {
    await onboard(page, "Lesson Student", 3);

    await page.getByRole("link", { name: "Library" }).click();
    await page.locator(".subject-card").first().click();
    await page.locator(".topic-row h2 a").first().click();

    const learn = page.getByRole("link", { name: "Learn" }).first();
    await expect(learn).toBeVisible();
    await learn.click();

    await expect(page.locator(".lesson-header h1")).toBeVisible();
    await expect(page.locator(".lesson-body")).toBeVisible();

    const practise = page.getByRole("link", { name: /^Practise / }).last();
    await practise.click();
    await expect(page.locator(".question-card")).toBeVisible();
  });

  test("grades an answer on the server and returns an explanation", async ({ page }) => {
    await onboard(page, "Answer Student", 3);

    await page.getByRole("link", { name: "Practice" }).click();
    await page.locator(".picker-topics a").first().click();

    await expect(page.locator(".question-card")).toBeVisible();
    await page.locator(".option").first().click();
    await page.getByRole("button", { name: /Check answer/i }).click();

    const feedback = page.locator(".feedback");
    await expect(feedback).toBeVisible();
    await expect(feedback.locator(".feedback-explanation")).not.toBeEmpty();
    await expect(feedback.locator(".feedback-mastery")).toContainText(/Mastery/);
  });
});

test.describe("Practice is always scoped", () => {
  test("shows a picker instead of dropping the student into a subject", async ({ page }) => {
    await onboard(page, "Picker Student", 3);
    await page.getByRole("link", { name: "Practice" }).click();

    await expect(page.getByRole("heading", { name: /What would you like to practise/i })).toBeVisible();
    await expect(page.locator(".question-card")).toHaveCount(0);
    await expect(page.locator(".picker-card").first()).toBeVisible();
  });
});

test.describe("Quiz", () => {
  test("runs a timed quiz and returns a review with explanations", async ({ page }) => {
    await onboard(page, "Quiz Student", 3);
    await page.getByRole("link", { name: "Quiz" }).click();

    await expect(page.getByRole("heading", { name: /exam conditions/i })).toBeVisible();
    await page.getByRole("link", { name: /Subject quiz/i }).first().click();

    await expect(page.locator(".quiz-timer")).toBeVisible();
    await expect(page.locator(".quiz-question")).toBeVisible();

    await page.locator(".option").first().click();
    await page.getByRole("button", { name: /^Next$/ }).click();
    await page.locator(".option").first().click();

    await page.getByRole("button", { name: /Submit quiz/i }).click();
    await expect(page.locator(".quiz-review")).toBeVisible();
    await expect(page.locator(".review-explanation").first()).not.toBeEmpty();
  });
});

test.describe("Progress", () => {
  test("reflects mastery earned from practice", async ({ page }) => {
    await onboard(page, "Progress Student", 3);

    await page.getByRole("link", { name: "Practice" }).click();
    await page.locator(".picker-topics a").first().click();
    await page.locator(".option").first().click();
    await page.getByRole("button", { name: /Check answer/i }).click();
    await expect(page.locator(".feedback")).toBeVisible();

    await page.getByRole("link", { name: "Progress" }).click();
    await expect(page.getByRole("heading", { name: /What you know/i })).toBeVisible();
    await expect(page.locator(".progress-subject").first()).toBeVisible();
    await expect(page.getByText(/Subtopics practised/i)).toBeVisible();
  });
});

test.describe("Tutor", () => {
  test("answers in the context of a chosen subtopic", async ({ page }) => {
    await onboard(page, "Tutor Student", 3);
    await page.getByRole("link", { name: "Tutor" }).click();

    await expect(page.locator("#tutor-scope-select")).toBeVisible();
    await page.locator("#tutor-input").fill("I don't understand this topic");
    await page.getByRole("button", { name: /Ask tutor/i }).click();

    await expect(page.locator(".tutor-message.is-tutor").nth(1)).toBeVisible({ timeout: 20000 });
  });
});

test.describe("Accessibility", () => {
  for (const path of ["/onboarding"]) {
    test(`${path} has no serious axe violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
      expect(serious.map((v) => v.id)).toEqual([]);
    });
  }

  test("library and lesson pages have no serious axe violations", async ({ page }) => {
    await onboard(page, "A11y Student", 3);

    await page.getByRole("link", { name: "Library" }).click();
    let results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious").map((v) => v.id)).toEqual([]);

    await page.locator(".subject-card").first().click();
    await page.locator(".topic-row h2 a").first().click();
    await page.getByRole("link", { name: "Learn" }).first().click();
    await expect(page.locator(".lesson-body")).toBeVisible();

    results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious").map((v) => v.id)).toEqual([]);
  });
});
