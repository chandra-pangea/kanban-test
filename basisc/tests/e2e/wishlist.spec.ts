import { expect, test } from "@playwright/test";
import { clearBrowserStorage } from "./helpers";

test.describe("Wishlist E2E", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test("add product, remove product, refresh persists wishlist", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("wishlist-toggle-1").click();
    await expect(page.getByTestId("wishlist-badge-count")).toHaveText("1");

    await page.getByTestId("nav-wishlist").click();
    await expect(page).toHaveURL(/\/wishlist$/);
    await expect(page.getByTestId("wishlist-page")).toBeVisible();
    await expect(page.getByTestId("wishlist-item-1")).toBeVisible();
    await expect(page.getByText("Wireless Headphones")).toBeVisible();

    await page.getByTestId("wishlist-toggle-1").click();
    await expect(page.getByTestId("wishlist-empty")).toBeVisible();

    await page.goto("/");
    await page.getByTestId("wishlist-toggle-2").click();
    await expect(page.getByTestId("wishlist-badge-count")).toHaveText("1");

    await page.reload();
    await expect(page.getByTestId("wishlist-badge-count")).toHaveText("1");
    await expect(page.getByTestId("wishlist-toggle-2")).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.getByTestId("nav-wishlist").click();
    await expect(page.getByTestId("wishlist-item-2")).toBeVisible();
  });
});
