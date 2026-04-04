import { expect, test } from "@playwright/test";
import { clearBrowserStorage, seedUserOnlyNoSession } from "./helpers";

/** Matches DEFAULT_TOAST_DURATION_MS (4000) plus buffer for timers and rendering. */
const TOAST_DISMISS_TIMEOUT_MS = 6500;

test.describe("Toast notifications", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test("add to cart shows a toast with product name", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("add-to-cart-1").click();
    const toast = page.getByTestId("app-toast");
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/Headphones/i);
    await expect(page.getByTestId("toast-region")).toBeVisible();
  });

  test("add-to-cart toast auto-dismisses", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("add-to-cart-5").click();
    const toast = page.getByTestId("app-toast");
    await expect(toast).toBeVisible();
    await expect(toast).toBeHidden({ timeout: TOAST_DISMISS_TIMEOUT_MS });
  });

  test("login success shows a toast after redirect", async ({ page }) => {
    const email = `toast-ok-${Date.now()}@e2e.test`;
    await page.goto("/register");
    await page.getByTestId("register-name").fill("Toast OK");
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill("secret1");
    await page.getByTestId("register-submit").click();
    await expect(page).toHaveURL(/\/login$/, { timeout: 8000 });

    await page.getByTestId("login-email").fill(email);
    await page.getByTestId("login-password").fill("secret1");
    await page.getByTestId("login-submit").click();

    await expect(page).toHaveURL(/\//);
    const toast = page.getByTestId("app-toast");
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/signed in successfully/i);
  });

  test("login failure shows an error toast", async ({ page }) => {
    await seedUserOnlyNoSession(page, {
      name: "Toast Fail",
      email: "toast-fail@e2e.test",
      password: "rightpass1",
    });
    await page.goto("/login");
    await page.getByTestId("login-email").fill("toast-fail@e2e.test");
    await page.getByTestId("login-password").fill("wrongpass");
    await page.getByTestId("login-submit").click();

    const toast = page.getByTestId("app-toast");
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute("data-variant", "error");
    await expect(toast).toContainText(/invalid email or password/i);
  });

  test("registration duplicate email shows an error toast", async ({ page }) => {
    const email = `dup-toast-${Date.now()}@e2e.test`;
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

    const toast = page.getByTestId("app-toast");
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute("data-variant", "error");
    await expect(toast).toContainText(/already exists/i);
  });

  test("login error toast auto-dismisses", async ({ page }) => {
    await seedUserOnlyNoSession(page, {
      name: "Toast Auto",
      email: "toast-auto@e2e.test",
      password: "pw123456",
    });
    await page.goto("/login");
    await page.getByTestId("login-email").fill("toast-auto@e2e.test");
    await page.getByTestId("login-password").fill("bad");
    await page.getByTestId("login-submit").click();

    const toast = page.getByTestId("app-toast");
    await expect(toast).toBeVisible();
    await expect(toast).toBeHidden({ timeout: TOAST_DISMISS_TIMEOUT_MS });
  });
});
