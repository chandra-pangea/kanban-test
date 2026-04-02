import { expect, test } from "@playwright/test";

test.describe("Login", () => {
  test("Sign in button shows validation errors when fields are empty", async ({ page }) => {
    await page.goto("/");

    const signInButton = page.getByRole("button", { name: "Sign in", exact: true });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();

    await test.step("User clicks Sign in without filling the form", async () => {
      await signInButton.click();
    });

    await expect(page.getByRole("alert").filter({ hasText: "Email is required" })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: "Password is required" })).toBeVisible();
    await expect(page).toHaveURL(/\/$|\/#?$/);
  });

  test("Sign in button submits valid credentials and reaches dashboard", async ({ page }) => {
    await page.goto("/");

    const signInButton = page.getByRole("button", { name: "Sign in", exact: true });

    await test.step("User fills email and password", async () => {
      await page.getByRole("textbox", { name: "Email" }).fill("dev@example.com");
      await page.getByRole("textbox", { name: "Password" }).fill("password123");
    });

    await test.step("User clicks Sign in", async () => {
      await expect(signInButton).toBeEnabled();
      await signInButton.click();
    });

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: "You are logged in" })).toBeVisible();
    await expect(page.getByText("Signed in as dev@example.com")).toBeVisible();
  });

  test("Sign out button returns to login after successful sign-in", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("textbox", { name: "Email" }).fill("dev@example.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    await expect(page).toHaveURL(/\/dashboard$/);

    const signOutButton = page.getByRole("button", { name: "Sign out", exact: true });
    await expect(signOutButton).toBeVisible();
    await expect(signOutButton).toBeEnabled();

    await test.step("User clicks Sign out", async () => {
      await signOutButton.click();
    });

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  });
});
