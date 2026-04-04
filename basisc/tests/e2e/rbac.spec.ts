import { expect, test } from "@playwright/test";
import { clearBrowserStorage, seedLoggedInUser } from "./helpers";

test.describe("Role-based access E2E", () => {
  test.beforeEach(async ({ page }) => {
    await clearBrowserStorage(page);
  });

  test("Admin login — admin nav, manage products, add row", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-email").fill("admin@demo.shop");
    await page.getByTestId("login-password").fill("admin123");
    await page.getByTestId("login-submit").click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("nav-user-role")).toContainText("Admin");
    await expect(page.getByTestId("nav-admin-products")).toBeVisible();

    await page.getByTestId("nav-admin-products").click();
    await expect(page).toHaveURL(/\/admin\/products$/);
    await expect(page.getByTestId("admin-products-page")).toBeVisible();
    await expect(page.getByTestId("admin-product-table")).toBeVisible();

    const unique = `E2E Admin Item ${Date.now()}`;
    await page.getByTestId("admin-add-name").fill(unique);
    await page.getByTestId("admin-add-price").fill("12.5");
    await page.getByTestId("admin-add-category").fill("TestCat");
    await page.getByTestId("admin-add-image").fill("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop");
    await page.getByTestId("admin-add-description").fill("Added by Playwright.");
    await page.getByTestId("admin-add-submit").click();

    await expect(page.getByTestId("admin-product-table")).toContainText(unique);
  });

  test("User login — no admin link; /admin/products redirects home", async ({ page }) => {
    await seedLoggedInUser(page, {
      name: "Regular",
      email: `user-${Date.now()}@e2e.test`,
      password: "userpass1",
      role: "user",
    });

    await expect(page.getByTestId("nav-user-role")).toContainText("User");
    await expect(page.getByTestId("nav-admin-products")).toHaveCount(0);

    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });

  test("User can edit product row only as admin — table not reachable", async ({ page }) => {
    await seedLoggedInUser(page, {
      name: "Browse Only",
      email: `browse-${Date.now()}@e2e.test`,
      password: "browse1",
      role: "user",
    });
    await page.goto("/");
    await expect(page.getByTestId("product-card").first()).toBeVisible();
    await expect(page.getByTestId("admin-product-table")).toHaveCount(0);
  });
});
