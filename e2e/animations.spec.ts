import { expect, test } from "@playwright/test";
import { scrollThroughPage } from "./helpers";

/** Computed opacity of every split-text reveal letter on the page. */
async function revealOpacities(page: import("@playwright/test").Page) {
  return page.$$eval("[data-split] .w > span", (els) =>
    els.map((el) => Number(getComputedStyle(el as HTMLElement).opacity))
  );
}

test.describe("scroll-triggered reveals", () => {
  test("all split-text content is revealed after scrolling through the page", async ({ page }) => {
    await page.goto("/");
    await scrollThroughPage(page);

    const opacities = await revealOpacities(page);
    expect(opacities.length).toBeGreaterThan(0);
    // Every revealed letter should have animated to fully opaque.
    expect(Math.min(...opacities)).toBeGreaterThan(0.95);
  });

  test("scroll-revealed section cards settle at full opacity", async ({ page }) => {
    await page.goto("/");
    await scrollThroughPage(page);

    // Stats, patterns, flows, actions, and how-it-works all opt into the shared
    // [data-cell] fade-up. After scrolling the whole page every card should have
    // animated in.
    const cells = page.locator("[data-cell]");
    expect(await cells.count()).toBeGreaterThan(0);
    for (const cell of await cells.all()) {
      const opacity = await cell.evaluate((el) => Number(getComputedStyle(el).opacity));
      expect(opacity).toBeGreaterThan(0.9);
    }
  });
});

test.describe("reduced motion", () => {
  test("content is fully visible without any scrolling", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(400);

    // With reduced motion, reveals are set to opacity 1 up front — no scroll needed.
    const opacities = await revealOpacities(page);
    expect(opacities.length).toBeGreaterThan(0);
    expect(Math.min(...opacities)).toBe(1);
  });
});
