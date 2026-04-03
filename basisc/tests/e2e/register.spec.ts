import { expect, test } from "@playwright/test";

test.describe("Register", () => {
  test("Create account button shows validation errors when fields are empty", async ({ page }) => {
    await page.goto("/register");

    const createAccountButton = page.getByRole("button", { name: "Create account", exact: true });
    await expect(createAccountButton).toBeVisible();
    await expect(createAccountButton).toBeEnabled();

    await test.step("User clicks Create account without filling the form", async () => {
      await createAccountButton.click();
    });

    await expect(page.getByRole("alert").filter({ hasText: "Username is required" })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "Email is required" })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "Password is required" })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "Please confirm your password" })).toBeVisible();
  });

  test("Create account button submits valid data and reaches dashboard", async ({ page }) => {
    await page.goto("/register");

    const createAccountButton = page.getByRole("button", { name: "Create account", exact: true });

    await test.step("User fills all required fields", async () => {
      await page.getByRole("textbox", { name: "Username" }).fill("janedoe");
      await page.getByRole("textbox", { name: "Email" }).fill("jane@example.com");
      await page.getByRole("textbox", { name: "Password", exact: true }).fill("password123");
      await page.getByRole("textbox", { name: "Confirm password" }).fill("password123");
    });

    await test.step("User clicks Create account", async () => {
      await expect(createAccountButton).toBeEnabled();
      await createAccountButton.click();
    });

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: "You are logged in" })).toBeVisible();
    await expect(page.getByText("Signed in as jane@example.com")).toBeVisible();
  });

  test("Create account button does not navigate when passwords do not match", async ({ page }) => {
    await page.goto("/register");

    const createAccountButton = page.getByRole("button", { name: "Create account", exact: true });

    await page.getByRole("textbox", { name: "Username" }).fill("janedoe");
    await page.getByRole("textbox", { name: "Email" }).fill("jane@example.com");
    await page.getByRole("textbox", { name: "Password", exact: true }).fill("password123");
    await page.getByRole("textbox", { name: "Confirm password" }).fill("other-password");

    await test.step("User clicks Create account with mismatched passwords", async () => {
      await expect(createAccountButton).toBeEnabled();
      await createAccountButton.click();
    });

    await expect(page.getByRole("alert").filter({ hasText: "Passwords do not match" })).toBeVisible();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("Create an account link navigates to register (heading + primary button)", async ({ page }) => {
    await page.goto("/");

    await test.step("User clicks marketing link to registration", async () => {
      const registerLink = page.getByRole("link", { name: "Create an account", exact: true });
      await expect(registerLink).toBeVisible();
      await registerLink.click();
    });

    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account", exact: true })).toBeVisible();
  });

  test("Sign in link navigates back to login (heading + Sign in button)", async ({ page }) => {
    await page.goto("/register");

    await test.step("User clicks Sign in from register footer", async () => {
      const signInLink = page.getByRole("link", { name: "Sign in", exact: true });
      await expect(signInLink).toBeVisible();
      await signInLink.click();
    });

    await expect(page).not.toHaveURL(/register/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  });
});
