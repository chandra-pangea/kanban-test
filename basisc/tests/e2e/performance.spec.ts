import { expect, test } from "@playwright/test";
import { clearBrowserStorage } from "./helpers";

test.describe("Performance optimizations", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test("search responsiveness: rapid sequential typing resolves to correct results", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("product-card")).toHaveCount(8);

    const search = page.getByTestId("filter-search");
    await search.clear();
    await search.pressSequentially("Headphones", { delay: 20 });

    const names = page.getByTestId("product-name");
    await expect(names).toHaveCount(1);
    await expect(names.first()).toContainText("Wireless Headphones");
  });

  test("UI integrity: filters and product grid stay usable after debounced search", async ({
    page,
  }) => {
    await page.goto("/");

    const filters = page.getByTestId("product-filters");
    const grid = page.locator("ul").filter({ has: page.getByTestId("product-card") });

    await expect(filters).toBeVisible();
    await expect(page.getByTestId("product-card").first()).toBeVisible();
    const boxBefore = await grid.boundingBox();
    expect(boxBefore?.width).toBeGreaterThan(200);

    await page.getByTestId("filter-search").pressSequentially("Watch", { delay: 25 });

    await expect(filters).toBeVisible();
    await expect(page.getByTestId("filter-category")).toBeVisible();
    await expect(page.getByTestId("filter-price-min")).toBeVisible();

    const cards = page.getByTestId("product-card");
    await expect(cards).toHaveCount(1, { timeout: 5000 });
    await expect(cards.first()).toBeVisible();

    const boxAfter = await grid.boundingBox();
    expect(boxAfter?.width).toBeGreaterThan(200);
  });

  test("lazy-loaded listing images expose loading hint without breaking layout", async ({
    page,
  }) => {
    await page.goto("/");
    const firstCardImg = page.getByTestId("product-card").first().locator("img");
    await expect(firstCardImg).toBeVisible();
    await expect(firstCardImg).toHaveAttribute("loading", "lazy");
    const box = await firstCardImg.boundingBox();
    expect(box?.height).toBeGreaterThan(40);
    expect(box?.width).toBeGreaterThan(40);
  });
});
