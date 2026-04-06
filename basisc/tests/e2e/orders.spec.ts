import { expect, test } from "@playwright/test";
import { clearBrowserStorage, seedLoggedInUser } from "./helpers";

const SESSION_KEY = "basisc-auth-session";

const ORDER_USER = {
  name: "Order Tester",
  email: "order-tester@e2e.test",
  password: "orderpass1",
};

const USER_A = {
  name: "Alice",
  email: "alice@isolation.test",
  password: "alicepass1",
};

const USER_B = {
  name: "Bob",
  email: "bob@isolation.test",
  password: "bobpass1",
};

async function placeOrder(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByTestId("add-to-cart-3").click();
  await page.getByTestId("nav-cart").click();
  await page.getByTestId("checkout-link").click();
  await expect(page.getByTestId("checkout-form")).toBeVisible();
  await page.getByTestId("checkout-name").fill("Test Buyer");
  await page.getByTestId("checkout-address").fill("99 Test Lane");
  await page.getByTestId("checkout-payment").selectOption("card");
  await page.getByTestId("checkout-submit").click();
  await expect(page.getByTestId("checkout-success")).toBeVisible();
}

test.describe("Order history and details", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  // Scenario 1 & 2 & 5: place order → appears in history → details match → survives refresh
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

    // Scenario 5: refresh → orders persist
    await page.reload();

    await expect(page.getByTestId("order-detail")).toBeVisible();
    await expect(page.getByTestId("order-detail-total")).toHaveText("$45.50");
    await expect(page.getByTestId("order-line-item").first()).toContainText("USB-C Hub");
    await expect(page).toHaveURL(new RegExp(`/orders/${orderId}$`));
  });

  // Scenarios 3 & 4: user isolation — different users see only their own orders
  test("user isolation: User B sees no orders, switching back restores User A orders", async ({
    page,
  }) => {
    // Scenario 1: Log in as User A and place an order
    await seedLoggedInUser(page, USER_A);
    await placeOrder(page);

    // Scenario 2: User A sees their order in history
    await page.goto("/orders");
    await expect(page.getByTestId("order-history-row")).toHaveCount(1);

    // Scenario 3: Switch to User B — should see empty state
    await page.evaluate(
      ({ key, userB }) => {
        localStorage.setItem(key, JSON.stringify({ name: userB.name, email: userB.email, role: "user" }));
      },
      { key: SESSION_KEY, userB: { name: USER_B.name, email: USER_B.email } },
    );
    await page.reload();
    await page.goto("/orders");
    await expect(page.getByTestId("orders-empty")).toBeVisible();

    // Scenario 4: Switch back to User A — previous orders still visible
    await page.evaluate(
      ({ key, userA }) => {
        localStorage.setItem(key, JSON.stringify({ name: userA.name, email: userA.email, role: "user" }));
      },
      { key: SESSION_KEY, userA: { name: USER_A.name, email: USER_A.email } },
    );
    await page.reload();
    await page.goto("/orders");
    await expect(page.getByTestId("order-history-row")).toHaveCount(1);
  });

  // Scenario 5 (standalone): orders persist across page refresh
  test("orders persist after browser refresh", async ({ page }) => {
    await seedLoggedInUser(page, ORDER_USER);
    await placeOrder(page);

    await page.goto("/orders");
    await expect(page.getByTestId("order-history-row")).toHaveCount(1);

    await page.reload();
    await expect(page.getByTestId("order-history-row")).toHaveCount(1);
  });
});
