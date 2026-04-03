import { expect, test } from "@playwright/test";
import { clearBrowserStorage, seedLoggedInUser, seedUserOnlyNoSession } from "./helpers";

test.describe("Authentication E2E", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test("Scenario 1: Registration flow — success message then redirect to login", async ({ page }) => {
    const email = `reg-${Date.now()}@e2e.test`;
    await page.goto("/register");
    await page.getByTestId("register-name").fill("E2E User");
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill("secret1");
    await page.getByTestId("register-submit").click();

    await expect(page.getByTestId("register-success")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/, { timeout: 8000 });
  });

  test("Scenario 2: Duplicate registration shows error", async ({ page }) => {
    const email = `dup-${Date.now()}@e2e.test`;
    await page.goto("/register");
    await page.getByTestId("register-name").fill("First");
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill("secret1");
    await page.getByTestId("register-submit").click();
    await expect(page).toHaveURL(/\/login$/, { timeout: 8000 });

    await page.goto("/register");
    await page.getByTestId("register-name").fill("Second");
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill("other12");
    await page.getByTestId("register-submit").click();

    await expect(page.getByTestId("register-error")).toBeVisible();
    await expect(page.getByTestId("register-error")).toContainText(/already exists/i);
  });

  test("Scenario 3: Login success — products page and logout visible", async ({ page }) => {
    const email = `ok-${Date.now()}@e2e.test`;
    await page.goto("/register");
    await page.getByTestId("register-name").fill("Login OK");
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill("secret1");
    await page.getByTestId("register-submit").click();
    await expect(page).toHaveURL(/\/login$/, { timeout: 8000 });

    await page.getByTestId("login-email").fill(email);
    await page.getByTestId("login-password").fill("secret1");
    await page.getByTestId("login-submit").click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.getByTestId("logout-button")).toBeVisible();
  });

  test("Scenario 4: Login failure — wrong password shows error", async ({ page }) => {
    await seedUserOnlyNoSession(page, {
      name: "Bad Pass",
      email: "badpass@e2e.test",
      password: "correct1",
    });
    await page.goto("/login");
    await page.getByTestId("login-email").fill("badpass@e2e.test");
    await page.getByTestId("login-password").fill("wrongxx");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("login-error")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("Scenario 5: Protected routes redirect to login", async ({ page }) => {
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("Scenario 6: Auth persistence after refresh", async ({ page }) => {
    await seedLoggedInUser(page, {
      name: "Persist",
      email: "persist@e2e.test",
      password: "persist1",
    });
    await expect(page.getByTestId("logout-button")).toBeVisible();

    await page.reload();

    await expect(page.getByTestId("logout-button")).toBeVisible();
    await expect(page.getByTestId("nav-user-email")).toContainText("persist@e2e.test");
  });

  test("Scenario 7: Logout clears session and redirects to login", async ({ page }) => {
    await seedLoggedInUser(page, {
      name: "Out",
      email: "out@e2e.test",
      password: "outpass1",
    });
    await page.getByTestId("logout-button").click();
    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/cart");
    await expect(page).toHaveURL(/\/login$/);
  });
});
