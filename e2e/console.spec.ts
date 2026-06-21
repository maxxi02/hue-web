import { expect, test } from "@playwright/test";
import { collectPageProblems, scrollThroughPage } from "./helpers";

test.describe("runtime health", () => {
  test("loads and scrolls with no console errors, exceptions, or failed requests", async ({
    page,
  }) => {
    const problems = collectPageProblems(page);

    await page.goto("/", { waitUntil: "networkidle" });
    await scrollThroughPage(page);

    expect(problems, problems.join("\n")).toEqual([]);
  });
});
