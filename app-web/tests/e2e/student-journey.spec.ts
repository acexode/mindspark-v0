import { test, expect, type Locator, type Page } from "@playwright/test";
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
  await page.waitForURL("**/home", { timeout: 45_000 });
  await expect(page.getByRole("heading", { name: new RegExp(name) })).toBeVisible();
}

/** Practice only covers what has been studied, so the real path is: open a lesson, then practise from it. */
async function practiseFirstLesson(page: Page) {
  await page.getByLabel("Main").getByRole("link", { name: "Library" }).click();
  await page.locator(".library-card, .library-others a").first().click();
  await page.locator(".outline-row h2 a").first().click();
  await page.getByRole("link", { name: "Learn" }).first().click();
  await expect(page.locator(".lesson-body")).toBeVisible();
  await page.getByRole("link", { name: /^Practise / }).last().click();
  await expect(page.locator(".question-card")).toBeVisible();
}

/** A click that lands before hydration selects nothing, so retry until "Check answer" is enabled. */
async function chooseFirstOption(page: Page) {
  await expect(async () => {
    await page.locator(".question-card .option").first().click();
    await expect(page.getByRole("button", { name: /Check answer/i })).toBeEnabled({ timeout: 1000 });
  }).toPass({ timeout: 20_000 });
}

test.describe("Onboarding", () => {
  test("requires at least one subject before continuing", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByPlaceholder("Your name").fill("No Subjects");
    await page.getByRole("button", { name: /Start learning/i }).click();
    await expect(page.locator(".form-error")).toContainText(/at least one subject/i);
    await expect(page).toHaveURL(/onboarding/);
  });

  test("lets a student pick subjects and reach a personalised home", async ({ page }) => {
    await onboard(page, "Ada Student", 2);
    await expect(page.getByRole("heading", { name: /Ada Student/ })).toBeVisible();
    await expect(page.getByText(/Up next/i)).toBeVisible();
  });
});

test.describe("Library navigation", () => {
  test("browses subject to topic to subtopic entirely through the UI", async ({ page }) => {
    await onboard(page, "Browser Student", 3);

    await page.getByLabel("Main").getByRole("link", { name: "Library" }).click();
    await page.waitForURL("**/library");

    const subjectCards = page.locator(".library-card, .library-others a");
    await expect(subjectCards.first()).toBeVisible();

    await subjectCards.first().click();
    await expect(page.locator(".outline-row").first()).toBeVisible();

    await page.locator(".outline-row h2 a").first().click();
    await expect(page.locator(".lesson-row").first()).toBeVisible();
    await expect(page.locator(".lesson-row").first().getByText(/learning objectives/i)).toBeVisible();
  });

  test("shows no empty subject: every listed subject opens to real topics", async ({ page }) => {
    await onboard(page, "Coverage Student", 8);
    await page.getByLabel("Main").getByRole("link", { name: "Library" }).click();
    await page.waitForURL("**/library");

    const count = await page.locator(".library-card, .library-others a").count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await page.getByLabel("Main").getByRole("link", { name: "Library" }).click();
      await page.waitForURL("**/library");
      await page.locator(".library-card, .library-others a").nth(i).click();
      await expect(page.locator(".outline-row").first()).toBeVisible();
    }
  });
});

test.describe("Learn then practise", () => {
  test("completes a lesson and starts scoped practice from it", async ({ page }) => {
    await onboard(page, "Lesson Student", 3);

    await page.getByLabel("Main").getByRole("link", { name: "Library" }).click();
    await page.locator(".library-card, .library-others a").first().click();
    await page.locator(".outline-row h2 a").first().click();

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
    await practiseFirstLesson(page);
    await chooseFirstOption(page);
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
    await page.getByLabel("Main").getByRole("link", { name: "Practice" }).click();

    await expect(page.getByRole("heading", { name: /What would you like to practise/i })).toBeVisible();
    await expect(page.locator(".question-card")).toHaveCount(0);
    await expect(page.locator(".practice-subject").first()).toBeVisible();
  });

  test("sends a fresh topic to its first lesson, then opens practice once it is studied", async ({ page }) => {
    await onboard(page, "Fresh Student", 1);
    await page.getByLabel("Main").getByRole("link", { name: "Practice" }).click();
    const card = page.locator(".practice-subject").first();
    await expect(card.getByRole("link", { name: "Start the first lesson" })).toBeVisible();
    await expect(card.locator(".practice-locked")).toBeVisible();

    await card.getByRole("link", { name: "Start the first lesson" }).click();
    await page.getByRole("link", { name: "Learn" }).first().click();
    await expect(page.locator(".lesson-body")).toBeVisible();

    await page.getByLabel("Main").getByRole("link", { name: "Practice" }).click();
    await expect(page.locator(".practice-subject").first().getByRole("link", { name: "Practise this topic" })).toBeVisible();
  });
});

test.describe("Quiz", () => {
  test("runs a timed quiz and returns a review with explanations", async ({ page }) => {
    test.setTimeout(120_000);
    await onboard(page, "Quiz Student", 3);
    await page.getByLabel("Main").getByRole("link", { name: "Quiz" }).click();

    await expect(page.getByRole("heading", { name: /exam conditions/i })).toBeVisible();
    await page.locator(".quiz-pace").first().click();

    await expect(page.locator(".quiz-timer")).toBeVisible();
    await expect(page.locator(".quiz-question")).toBeVisible();

    async function answerCurrent() {
      const option = page.locator(".option").first();
      if (await option.isVisible()) {
        await option.click();
        return;
      }
      await page.getByLabel("Your answer").fill("plant cell");
    }

    while (await page.getByRole("button", { name: /^Next$/ }).isVisible()) {
      await answerCurrent();
      await page.getByRole("button", { name: /^Next$/ }).click();
    }
    await answerCurrent();
    await page.getByRole("button", { name: /Submit quiz/i }).click();
    await expect(page.locator(".quiz-review")).toBeVisible();
    await expect(page.locator(".review-explanation").first()).not.toBeEmpty();
  });
});

test.describe("Progress", () => {
  test("reflects mastery earned from practice", async ({ page }) => {
    await onboard(page, "Progress Student", 3);
    await practiseFirstLesson(page);
    await chooseFirstOption(page);
    await page.getByRole("button", { name: /Check answer/i }).click();
    await expect(page.locator(".feedback")).toBeVisible();

    await page.getByLabel("Main").getByRole("link", { name: "Progress" }).click();
    await expect(page.getByRole("heading", { name: /What you know/i })).toBeVisible();
    await expect(page.locator(".progress-subject:not(.is-untouched)").first()).toBeVisible();
    await expect(page.locator(".progress-highlights")).toBeVisible();
    await expect(page.locator(".header-stats").getByText(/Subtopics practised/i)).toBeVisible();
  });
});

test.describe("Tutor", () => {
  test("answers in the context of a chosen subtopic", async ({ page }) => {
    const asked: { subtopicId?: string; mode?: string }[] = [];
    await page.route("**/api/v1/tutor/stream", async (route) => {
      asked.push(route.request().postDataJSON());
      await route.fulfill({ status: 200, contentType: "text/plain", headers: { "x-tutor-source": "ollama" }, body: "Here is how it works." });
    });
    await onboard(page, "Tutor Student", 3);
    await page.getByLabel("Main").getByRole("link", { name: "Tutor" }).click();

    // The context panel names the unit, and starters are built from its objectives.
    const unitName = await page.locator(".tutor-context h2").innerText();
    await expect(page.locator(".tutor-notebook-head h1")).toHaveText(unitName);
    await expect(page.locator(".tutor-starters button").first()).toBeVisible();

    // Switching unit through the picker re-scopes the notebook and the URL.
    const other = page.locator(".tutor-picker-topic button:not([aria-current])").first();
    const otherName = await other.innerText();
    await other.click();
    await expect(page.locator(".tutor-notebook-head h1")).toHaveText(otherName);
    await expect(page).toHaveURL(/\/tutor\?subtopic=/);

    await page.locator(".ask-tutor-compose textarea").fill("I don't understand this topic");
    await page.getByRole("button", { name: "Ask", exact: true }).click();

    await expect(page.locator(".tutor-message.is-tutor")).toContainText("Here is how it works.");
    expect(asked[0]?.subtopicId).toBeTruthy();
    expect(asked[0]?.mode).toBe("explain");
  });
});

test.describe("Ask the tutor", () => {
  async function openFirstLesson(page: Page, name: string) {
    await onboard(page, name, 3);
    await page.getByLabel("Main").getByRole("link", { name: "Library" }).click();
    await page.locator(".library-card, .library-others a").first().click();
    await page.locator(".outline-row h2 a").first().click();
    // The lesson records a visit once React has hydrated; interacting earlier lets hydration reset the drawer.
    const hydrated = page.waitForResponse((r) => r.request().method() === "POST" && r.url().includes("/learn/"));
    await page.getByRole("link", { name: "Learn" }).first().click();
    await expect(page.locator(".stuck-card")).toBeVisible();
    await hydrated;
  }

  async function openDrawer(page: Page, trigger: Locator) {
    await trigger.click();
    await expect(page.locator("dialog[open]")).toBeVisible();
  }

  /** The model is mocked: these tests cover the wiring, not Ollama's answer quality. */
  async function mockTutor(page: Page, source: "ollama" | "fallback", body: string) {
    await page.route("**/api/v1/tutor/stream", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/plain; charset=utf-8",
        headers: { "x-tutor-source": source },
        body,
      }),
    );
  }

  test("opens a drawer from the lesson and shows the tutor's reply", async ({ page }) => {
    await mockTutor(page, "ollama", "Think of a fraction as a part of a whole.");
    await openFirstLesson(page, "Drawer Student");

    await openDrawer(page, page.locator(".tutor-fab"));
    await page.locator("dialog[open] .tutor-chip").first().click();

    const drawer = page.locator("dialog[open]");
    await expect(drawer.locator(".tutor-message.is-tutor")).toContainText("part of a whole");
    await expect(drawer.locator(".tutor-source")).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });

  test("says so when the tutor is offline and falls back to built-in guidance", async ({ page }) => {
    await mockTutor(page, "fallback", "Let's start with this topic. What do you already know?");
    await openFirstLesson(page, "Offline Student");

    await openDrawer(page, page.locator(".tutor-fab"));
    await page.locator("dialog[open] textarea").fill("Help me");
    await page.locator("dialog[open]").getByRole("button", { name: "Ask", exact: true }).click();

    await expect(page.locator("dialog[open] .tutor-source")).toHaveText(/Offline guidance/i);
    await expect(page.locator("dialog[open] .ask-tutor-note")).toBeVisible();
  });

  test("treats what the student types after 'Quiz me' as an answer to check", async ({ page }) => {
    const modes: (string | undefined)[] = [];
    await page.route("**/api/v1/tutor/stream", async (route) => {
      modes.push(route.request().postDataJSON().mode);
      await route.fulfill({
        status: 200,
        contentType: "text/plain; charset=utf-8",
        headers: { "x-tutor-source": "ollama" },
        body: modes.length === 1 ? "Here's a question: what is 2/3 as a decimal?" : "Close! It is about 0.67.",
      });
    });
    await openFirstLesson(page, "Quiz Me Student");

    await openDrawer(page, page.locator(".tutor-fab"));
    await page.locator("dialog[open]").getByRole("button", { name: /Quiz me/ }).click();
    await expect(page.locator("dialog[open] .tutor-message.is-tutor")).toBeVisible();

    const drawer = page.locator("dialog[open]");
    await expect(drawer.getByRole("button", { name: "Check my answer" })).toBeVisible();
    await expect(drawer.getByRole("button", { name: /Show me the answer/ })).toBeVisible();
    await expect(drawer.getByRole("button", { name: /Just explain it/ })).toHaveCount(0);

    await drawer.locator("textarea").fill("0.66");
    await drawer.getByRole("button", { name: "Check my answer" }).click();
    await expect(drawer.locator(".tutor-message.is-student")).toHaveCount(2);

    expect(modes).toEqual(["hint", "check-my-thinking"]);
    await expect(drawer.getByRole("button", { name: "Ask", exact: true })).toBeVisible();
  });

  test("offers help on a lesson question only after it has been answered", async ({ page }) => {
    await mockTutor(page, "ollama", "Let's look closer. Can you work out 20% of 5,000?");
    await openFirstLesson(page, "Why Student");

    // Not every unit has a quick check, so walk forward until one does.
    for (let i = 0; i < 6 && (await page.locator(".lesson-check").count()) === 0; i++) {
      const next = page.locator(".lesson-unit-nav a").last();
      if (!(await next.isVisible()) || !(await next.textContent())?.includes("→")) break;
      await next.click();
      await expect(page.locator(".stuck-card")).toBeVisible();
    }
    test.skip((await page.locator(".lesson-check").count()) === 0, "no quick check in the first units");

    const card = page.locator(".lesson-check .question-card").first();
    await expect(card.locator(".question-help")).toHaveCount(0);

    await card.locator(".option").first().click();
    await card.getByRole("button", { name: /Check answer/i }).click();
    await expect(card.locator(".feedback")).toBeVisible();

    await card.locator(".question-help button").first().click();
    await expect(card.locator(".ask-tutor-chips .tutor-chip").first()).toBeVisible();

    // The hint ends in a question, so the buttons must now be about answering it.
    await card.locator(".ask-tutor-chips .tutor-chip").first().click();
    await expect(card.getByRole("button", { name: "Check my answer" })).toBeVisible();
    await expect(card.getByRole("button", { name: /Show me the answer/ })).toBeVisible();
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

    await page.getByLabel("Main").getByRole("link", { name: "Library" }).click();
    let results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious").map((v) => v.id)).toEqual([]);

    await page.locator(".library-card, .library-others a").first().click();
    await page.locator(".outline-row h2 a").first().click();
    await page.getByRole("link", { name: "Learn" }).first().click();
    await expect(page.locator(".lesson-body")).toBeVisible();

    results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "critical" || v.impact === "serious").map((v) => v.id)).toEqual([]);
  });
});
