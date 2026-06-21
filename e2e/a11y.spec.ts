import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("accessibility", () => {
  test("has no serious or critical axe violations", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    // Attach the full report so any nit (e.g. moderate contrast) is reviewable.
    await testInfo.attach("axe-results.json", {
      body: JSON.stringify(results.violations, null, 2),
      contentType: "application/json",
    });

    expect(
      blocking,
      blocking.map((v) => `${v.id} (${v.impact}): ${v.help}`).join("\n")
    ).toEqual([]);
  });

  test("decorative canvases and the grain layer are hidden from the a11y tree", async ({ page }) => {
    await page.goto("/");
    for (const canvas of await page.locator("canvas").all()) {
      await expect(canvas).toHaveAttribute("aria-hidden", "true");
    }
    await expect(page.locator(".hue-grain")).toHaveAttribute("aria-hidden", "true");
  });

  test("the theme toggle has an accessible name", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Toggle light or dark theme" })
    ).toBeVisible();
  });
});
