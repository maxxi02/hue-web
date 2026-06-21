import { expect, test } from "@playwright/test";

test.describe("landing page smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has the correct document title and meta", async ({ page }) => {
    await expect(page).toHaveTitle(/Hue — Your real-time interview copilot/);
  });

  test("renders the hero headline", async ({ page }) => {
    const h1 = page.locator("h1.hue-hero__title");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("real-time");
    await expect(h1).toContainText("interview");
    await expect(h1).toContainText("copilot");
  });

  test("renders all nine content sections", async ({ page }) => {
    // hero · showcase · stats · patterns · flows · actions · how-it-works ·
    // providers · CTA
    await expect(page.locator("section")).toHaveCount(9);
  });

  test("exposes the primary CTA", async ({ page }) => {
    // "Get Hue" appears in nav and hero; at least one is always visible.
    await expect(page.getByRole("link", { name: /Get Hue/i }).first()).toBeVisible();
  });

  test("exposes the desktop navigation links", async ({ page }) => {
    // Nav links collapse (display:none) at <=820px — desktop only.
    test.skip((page.viewportSize()?.width ?? 0) < 821, "nav links collapse on mobile");
    // Scope to the nav — these labels are repeated in the footer.
    const nav = page.getByRole("navigation");
    await expect(
      nav.getByRole("link", { name: "How it works", exact: true })
    ).toHaveAttribute("href", "#how");
    await expect(
      nav.getByRole("link", { name: "Privacy", exact: true })
    ).toHaveAttribute("href", "#privacy");
  });

  test("provider marquee lists the supported models", async ({ page }) => {
    const marquee = page.locator(".hue-marquee");
    await expect(marquee).toContainText("Anthropic");
    await expect(marquee).toContainText("Deepgram");
    await expect(marquee).toContainText("Mistral");
  });
});
