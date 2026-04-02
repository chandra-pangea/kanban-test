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
