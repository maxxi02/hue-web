import { expect, test } from "@playwright/test";

test.describe("theme toggle", () => {
  test("switches between dark and light and updates the icon", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.locator("#themeToggle");
    const icon = page.locator("#themeIcon");

    // Ships in dark mode.
    await expect(html).toHaveClass(/dark/);
    await expect(icon).toHaveText("☾");

    await toggle.click();
    await expect(html).not.toHaveClass(/dark/);
    await expect(icon).toHaveText("☀");

    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    await expect(icon).toHaveText("☾");
  });
});

test.describe("in-page navigation", () => {
  test('"How it works" anchors to the how-it-works section', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 821, "nav links collapse on mobile");
    await page.goto("/");
    // Scope to the nav — "How it works" is repeated in the footer.
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "How it works", exact: true })
      .click();
    await expect(page).toHaveURL(/#how$/);
    await expect(page.locator("#how")).toBeVisible();
  });
});
