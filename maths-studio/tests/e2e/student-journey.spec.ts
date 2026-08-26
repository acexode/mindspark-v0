import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Student journey", () => {
  test("onboarding to home happy path", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.getByRole("heading", { name: /Learn maths by doing/i })).toBeVisible();

    await page.getByPlaceholder("Your name").fill("Test Student");
    await page.getByRole("button", { name: /Start my diagnostic/i }).click();

    await expect(page.getByRole("heading", { name: /Find your starting point/i })).toBeVisible({ timeout: 10000 });

    for (let i = 0; i < 6; i++) {
      const options = page.locator(".answer-list button");
      if ((await options.count()) === 0) break;
      await options.first().click();
    }

    await page.waitForURL("**/home", { timeout: 15000 });
    await expect(page.getByRole("heading", { name: /Good to see you/i })).toBeVisible();
  });

  test("lesson page loads after onboarding", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByPlaceholder("Your name").fill("Lesson Tester");
    await page.getByRole("button", { name: /Start my diagnostic/i }).click();
    await expect(page.getByRole("heading", { name: /Find your starting point/i })).toBeVisible({ timeout: 10000 });

    for (let i = 0; i < 6; i++) {
      const options = page.locator(".answer-list button");
      if ((await options.count()) === 0) break;
      await options.first().click();
    }

    await page.waitForURL("**/home", { timeout: 15000 });
    await page.getByRole("link", { name: "Lessons" }).click();
    await expect(page.getByRole("heading", { name: /Solving Linear Equations/i })).toBeVisible({ timeout: 10000 });
  });

  test("onboarding passes critical axe accessibility checks", async ({ page }) => {
    await page.goto("/onboarding");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(["region", "landmark-one-main"])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(serious).toEqual([]);
  });
});
