import type { Page } from "@playwright/test";

/**
 * Attach listeners that collect anything that should never happen on a healthy
 * page: console errors, uncaught exceptions, and failed network requests.
 * Returns the live array so a test can assert on it after exercising the page.
 */
export function collectPageProblems(page: Page): string[] {
  const problems: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    problems.push(`pageerror: ${err.message}`);
  });
  page.on("requestfailed", (req) => {
    // Aborted requests (e.g. cancelled navigations) are not real failures.
    const failure = req.failure()?.errorText ?? "";
    if (failure.includes("ERR_ABORTED")) return;
    problems.push(`requestfailed: ${req.url()} (${failure})`);
  });

  return problems;
}

/**
 * Smoothly scroll from top to bottom so every ScrollTrigger reveal fires, then
 * settle. Mirrors how a real visitor moves through the page.
 */
export async function scrollThroughPage(page: Page, steps = 40): Promise<void> {
  const docHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((docHeight * i) / steps);
    await page.evaluate((target) => {
      window.scrollTo(0, target);
      window.dispatchEvent(new Event("scroll"));
    }, y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(500);
}

/** Largest horizontal overflow on the page, in CSS pixels (0 = none). */
export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}
