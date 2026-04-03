import { expect, test } from "@playwright/test";
import { clearBrowserStorage, seedLoggedInUser } from "./helpers";

const SHOP_USER = {
  name: "Cart Tester",
  email: "cart-tester@e2e.test",
  password: "cartpass1",
};

test.describe("Demo shop E2E", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test("Scenario 1: product browsing — products are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    const cards = page.getByTestId("product-card");
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(8);
  });

  test("Scenario 2: filtering — category, search, and results", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("filter-category").selectOption("Audio");
    let names = page.getByTestId("product-name");
    await expect(names).toHaveCount(2);

    await page.getByTestId("filter-search").fill("Headphones");
    names = page.getByTestId("product-name");
    await expect(names).toHaveCount(1);
    await expect(names.first()).toContainText("Wireless Headphones");

    await page.getByTestId("filter-search").fill("");
    await page.getByTestId("filter-category").selectOption("");
    await page.getByTestId("filter-price-min").fill("140");
    await page.getByTestId("filter-price-max").fill("210");
    names = page.getByTestId("product-name");
    await expect(names).toHaveCount(2);
    await expect(names.filter({ hasText: "Smart Watch" })).toHaveCount(1);
    await expect(names.filter({ hasText: "Studio Microphone" })).toHaveCount(1);
  });

  test("Scenario 3: add to cart — badge updates and persists on refresh", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("add-to-cart-1").click();
    await page.getByTestId("add-to-cart-1").click();
    await expect(page.getByTestId("cart-badge-count")).toHaveText("2");

    await page.reload();
    await expect(page.getByTestId("cart-badge-count")).toHaveText("2");
  });

  test("Scenario 4: cart page — lines, quantity, total", async ({ page }) => {
    await seedLoggedInUser(page, SHOP_USER);
    await page.goto("/");
    await page.getByTestId("add-to-cart-2").click();
    await page.getByTestId("nav-cart").click();
    await expect(page).toHaveURL(/\/cart$/);

    await expect(page.getByTestId("cart-line")).toHaveCount(1);
    await expect(page.getByTestId("cart-total")).toContainText("$129.00");

    await page.getByTestId("qty-inc-2").click();
    await expect(page.getByTestId("qty-input-2")).toHaveValue("2");
    await expect(page.getByTestId("cart-total")).toContainText("$258.00");

    await page.getByTestId("qty-input-2").fill("1");
    await page.getByTestId("qty-input-2").blur();
    await expect(page.getByTestId("cart-total")).toContainText("$129.00");
  });

  test("Scenario 5: checkout — success and cart cleared", async ({ page }) => {
    await seedLoggedInUser(page, SHOP_USER);
    await page.goto("/");
    await page.getByTestId("add-to-cart-3").click();
    await page.getByTestId("nav-cart").click();
    await page.getByTestId("checkout-link").click();
    await expect(page.getByTestId("checkout-form")).toBeVisible();

    await page.getByTestId("checkout-name").fill("Alex Demo");
    await page.getByTestId("checkout-address").fill("123 Mock St");
    await page.getByTestId("checkout-payment").selectOption("paypal");
    await page.getByTestId("checkout-submit").click();

    await expect(page.getByTestId("checkout-success")).toBeVisible();
    await expect(page.getByText(/Order placed/)).toBeVisible();

    await page.getByRole("link", { name: "Cart" }).click();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
  });

  test("Scenario 6a: unauthenticated cart URL redirects to login", async ({ page }) => {
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("Scenario 6a-auth: empty cart UI when logged in", async ({ page }) => {
    await seedLoggedInUser(page, SHOP_USER);
    await page.goto("/cart");
    await expect(page.getByTestId("cart-empty")).toBeVisible();
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });

  test("Scenario 6b: invalid filter shows no products message", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("filter-search").fill("zzzznonexistent");
    await expect(page.getByTestId("no-products")).toBeVisible();
    await expect(page.getByText("No products found")).toBeVisible();
  });

  test("Scenario 6c: removing all items empties cart", async ({ page }) => {
    await seedLoggedInUser(page, SHOP_USER);
    await page.goto("/");
    await page.getByTestId("add-to-cart-4").click();
    await page.getByTestId("nav-cart").click();
    await page.getByTestId("remove-4").click();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
  });
});
