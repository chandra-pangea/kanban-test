import { expect, test } from "@playwright/test";
import { clearBrowserStorage, seedLoggedInUser } from "./helpers";

const ORDER_USER = {
  name: "Order Tester",
  email: "order-tester@e2e.test",
  password: "orderpass1",
};

test.describe("Order history and details", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test("place order → appears in history → details match → survives refresh", async ({
    page,
  }) => {
    await seedLoggedInUser(page, ORDER_USER);
    await page.goto("/");

    await page.getByTestId("add-to-cart-3").click();
    await page.getByTestId("nav-cart").click();
    await page.getByTestId("checkout-link").click();
    await expect(page.getByTestId("checkout-form")).toBeVisible();

    await page.getByTestId("checkout-name").fill("Pat Example");
    await page.getByTestId("checkout-address").fill("99 Test Lane");
    await page.getByTestId("checkout-payment").selectOption("card");
    await page.getByTestId("checkout-submit").click();

    await expect(page.getByTestId("checkout-success")).toBeVisible();
    const orderIdLocator = page.getByTestId("order-placed-id");
    await expect(orderIdLocator).toBeVisible();
    const orderId = (await orderIdLocator.textContent())?.trim() ?? "";
    expect(orderId.length).toBeGreaterThan(0);

    await page.getByTestId("order-success-history-link").click();
    await expect(page).toHaveURL(/\/orders$/);
    await expect(page.getByRole("heading", { name: "Order history" })).toBeVisible();

    const rows = page.getByTestId("order-history-row");
    await expect(rows).toHaveCount(1);
    await expect(page.getByTestId("order-history-status").first()).toHaveText("Completed");
    await expect(rows.first()).toContainText("$45.50");

    await rows.first().click();
    await expect(page).toHaveURL(new RegExp(`/orders/${orderId}$`));

    await expect(page.getByTestId("order-detail")).toBeVisible();
    await expect(page.getByTestId("order-detail-status")).toHaveText("Completed");
    await expect(page.getByTestId("order-detail-total")).toHaveText("$45.50");

    const lines = page.getByTestId("order-line-item");
    await expect(lines).toHaveCount(1);
    await expect(lines.first()).toContainText("USB-C Hub");
    await expect(page.getByTestId("order-line-subtotal-3")).toHaveText("$45.50");

    await page.reload();

    await expect(page.getByTestId("order-detail")).toBeVisible();
    await expect(page.getByTestId("order-detail-total")).toHaveText("$45.50");
    await expect(page.getByTestId("order-line-item").first()).toContainText("USB-C Hub");
    await expect(page).toHaveURL(new RegExp(`/orders/${orderId}$`));
  });
});
