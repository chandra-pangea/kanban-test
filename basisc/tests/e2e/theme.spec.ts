import { expect, test, type Page } from "@playwright/test";
import { clearBrowserStorage } from "./helpers";

async function readCssPageColor(page: Page) {
  return page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-page").trim(),
  );
}

test.describe("Theme (light / dark)", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test("toggle switches appearance and button label", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).not.toHaveClass(/(?:^|\s)dark(?:\s|$)/);
    const lightPage = await readCssPageColor(page);
    expect(lightPage.toLowerCase()).toBe("#f5f7ff");

    await page.getByTestId("theme-toggle").click();

    await expect(page.locator("html")).toHaveClass(/(?:^|\s)dark(?:\s|$)/);
    const darkPage = await readCssPageColor(page);
    expect(darkPage.toLowerCase()).toBe("#0c0e14");

    await expect(page.getByTestId("theme-toggle")).toHaveText("Light");

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).not.toHaveClass(/(?:^|\s)dark(?:\s|$)/);
    await expect(page.getByTestId("theme-toggle")).toHaveText("Dark");
    const backToLight = await readCssPageColor(page);
    expect(backToLight.toLowerCase()).toBe("#f5f7ff");
  });

  test("dark mode persists across refresh", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveClass(/(?:^|\s)dark(?:\s|$)/);
    expect(await page.evaluate(() => localStorage.getItem("basisc-theme"))).toBe("dark");

    await page.reload();

    await expect(page.locator("html")).toHaveClass(/(?:^|\s)dark(?:\s|$)/);
    await expect(page.getByTestId("theme-toggle")).toHaveText("Light");
    const darkPage = await readCssPageColor(page);
    expect(darkPage.toLowerCase()).toBe("#0c0e14");
  });
});
