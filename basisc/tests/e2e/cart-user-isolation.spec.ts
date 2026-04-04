import { expect, test } from "@playwright/test";
import { cartLocalStorageKeyForUser } from "../../src/lib/cartStorage";
import { clearBrowserStorage } from "./helpers";

async function registerUser(
  page: import("@playwright/test").Page,
  name: string,
  email: string,
  password: string,
) {
  await page.goto("/register");
  await page.getByTestId("register-name").fill(name);
  await page.getByTestId("register-email").fill(email);
  await page.getByTestId("register-password").fill(password);
  await page.getByTestId("register-submit").click();
  await expect(page).toHaveURL(/\/login$/, { timeout: 8000 });
}

async function loginUser(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
) {
  // Visit home first so a subsequent /login navigation always reloads the app
  // (avoids React Router keeping `state.from` when already on /login after a protected-route redirect).
  await page.goto("/");
  await page.goto("/login");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL(/\/$/);
}

test.describe("User-specific cart E2E", () => {
  test("Scenarios 1–3: user A cart, user B isolation, restore user A", async ({ page }) => {
    const stamp = Date.now();
    const emailA = `cart-user-a-${stamp}@e2e.test`;
    const emailB = `cart-user-b-${stamp}@e2e.test`;
    const password = "secret123";

    await clearBrowserStorage(page);

    // Scenario 1: User A — register, login, add product, verify cart
    await registerUser(page, "User A", emailA, password);
    await loginUser(page, emailA, password);

    await page.getByTestId("add-to-cart-1").click();
    await expect(page.getByTestId("cart-badge-count")).toHaveText("1");

    await page.getByTestId("nav-cart").click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByTestId("cart-line")).toHaveCount(1);

    await expect
      .poll(() =>
        page.evaluate(
          (key) => localStorage.getItem(key),
          cartLocalStorageKeyForUser(emailA),
        ),
      )
      .toContain("Wireless Headphones");

    // Scenario 2: Logout, User B — empty cart
    await page.getByTestId("logout-button").click();
    await expect(page).toHaveURL(/\/login$/);

    await registerUser(page, "User B", emailB, password);
    await loginUser(page, emailB, password);

    await expect(page.locator('[data-testid="cart-badge-count"]')).toHaveCount(0);
    await page.getByTestId("nav-cart").click();
    await expect(page.getByTestId("cart-empty")).toBeVisible();

    const rawB = await page.evaluate(
      (key) => localStorage.getItem(key),
      cartLocalStorageKeyForUser(emailB),
    );
    expect(rawB).toBeTruthy();
    expect(JSON.parse(rawB!).items).toEqual([]);

    // Scenario 3: User A again — previous cart restored
    await page.getByTestId("logout-button").click();
    await expect(page).toHaveURL(/\/login$/);

    await loginUser(page, emailA, password);
    await expect(page.getByTestId("cart-badge-count")).toHaveText("1");
    await page.getByTestId("nav-cart").click();
    await expect(page.getByTestId("cart-line")).toHaveCount(1);
    await expect(page.getByTestId("cart-line").first()).toContainText(/Wireless Headphones/i);
  });

  test("Scenario 4: persistence — add item, refresh, cart survives for same user", async ({
    page,
  }) => {
    const stamp = Date.now();
    const email = `cart-persist-${stamp}@e2e.test`;
    const password = "secret123";

    await clearBrowserStorage(page);
    await registerUser(page, "Persist User", email, password);
    await loginUser(page, email, password);

    await page.getByTestId("add-to-cart-2").click();
    await expect(page.getByTestId("cart-badge-count")).toHaveText("1");

    await page.reload();

    await expect(page.getByTestId("cart-badge-count")).toHaveText("1");
    await expect
      .poll(() =>
        page.evaluate(
          (key) => localStorage.getItem(key),
          cartLocalStorageKeyForUser(email),
        ),
      )
      .toContain("Mechanical Keyboard");
  });
});
