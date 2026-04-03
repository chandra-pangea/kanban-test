import { expect, test } from "@playwright/test";
import { clearBrowserStorage, seedLoggedInUser } from "./helpers";

const SHOP_USER = {
  name: "PDP Tester",
  email: "pdp-tester@e2e.test",
  password: "pdppass1",
};

test.describe("Product details page (PDP)", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test("Scenario 1: navigate to product details from listing", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("product-link-1").click();
    await expect(page).toHaveURL(/\/product\/1$/);
    await expect(page.getByTestId("product-detail")).toBeVisible();
    await expect(page.getByTestId("pdp-name")).toContainText(
      "Wireless Headphones",
    );
    await expect(page.getByTestId("pdp-price")).toContainText("$79.99");
    await expect(page.getByTestId("pdp-category")).toContainText("Audio");
    await expect(page.getByTestId("pdp-description")).toBeVisible();
    await expect(page.getByTestId("pdp-image")).toBeVisible();
  });

  test("Scenario 2: invalid product id shows not found", async ({ page }) => {
    await page.goto("/product/invalid-id");
    await expect(page.getByTestId("product-not-found")).toBeVisible();
    await expect(page.getByText("Product not found")).toBeVisible();
  });

  test("Scenario 3: add to cart from PDP updates badge and cart", async ({
    page,
  }) => {
    await seedLoggedInUser(page, SHOP_USER);
    await page.goto("/product/2");
    await page.getByTestId("pdp-add-to-cart").click();
    await expect(page.getByTestId("cart-badge-count")).toHaveText("1");
    await expect(page.getByTestId("cart-toast")).toContainText(
      "Mechanical Keyboard",
    );

    await page.getByTestId("nav-cart").click();
    await expect(page.getByTestId("cart-line")).toHaveCount(1);
    await expect(page.getByTestId("qty-input-2")).toHaveValue("1");
  });

  test("Scenario 4: quantity greater than one is added correctly", async ({
    page,
  }) => {
    await page.goto("/product/1");
    await page.getByTestId("pdp-quantity").fill("4");
    await page.getByTestId("pdp-quantity").blur();
    await page.getByTestId("pdp-add-to-cart").click();
    await expect(page.getByTestId("cart-badge-count")).toHaveText("4");
  });

  test("Scenario 5: cart persists after refresh when added from PDP", async ({
    page,
  }) => {
    await page.goto("/product/3");
    await page.getByTestId("pdp-add-to-cart").click();
    await expect(page.getByTestId("cart-badge-count")).toHaveText("1");
    await page.reload();
    await expect(page.getByTestId("cart-badge-count")).toHaveText("1");
  });

  test("Scenario 6: listing → PDP → cart shows correct line", async ({
    page,
  }) => {
    await seedLoggedInUser(page, SHOP_USER);
    await page.goto("/");
    await page.getByTestId("product-link-4").click();
    await expect(page).toHaveURL(/\/product\/4$/);
    await page.getByTestId("pdp-add-to-cart").click();
    await page.getByTestId("nav-cart").click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByTestId("cart-line")).toHaveCount(1);
    await expect(page.getByText("Laptop Stand")).toBeVisible();
    await expect(page.getByTestId("cart-total")).toContainText("$52.00");
  });
});
