import { expect, test } from "@playwright/test";
import { horizontalOverflow } from "./helpers";

test.describe("responsive layout", () => {
  test("no horizontal overflow at the configured viewport", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test("primary CTA stays inside the viewport", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /Get Hue — Android/i }).first();
    await expect(cta).toBeInViewport();
    const box = await cta.boundingBox();
    const vw = page.viewportSize()?.width ?? 0;
    expect(box).not.toBeNull();
    if (box) expect(box.x + box.width).toBeLessThanOrEqual(vw + 1);
  });
});
