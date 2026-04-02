import { expect, test } from "@playwright/test";

test("register flow creates session and reaches dashboard", async ({ page }) => {
  await page.goto("/register");

  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Username is required")).toBeVisible();

  await page.getByLabel("Username").fill("janedoe");
  await page.getByLabel("Email").fill("jane@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByLabel("Confirm password").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "You are logged in" })).toBeVisible();
});

test("register blocks submit when passwords do not match", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("Username").fill("janedoe");
  await page.getByLabel("Email").fill("jane@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByLabel("Confirm password").fill("other-password");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Passwords do not match")).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
});

test("sign-in page links to register", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Create an account" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
});

test("register page links back to sign-in", async ({ page }) => {
  await page.goto("/register");
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page).not.toHaveURL(/register/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
