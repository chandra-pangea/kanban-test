import { expect, test } from "@playwright/test";

test("critical login flow works", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Email is required")).toBeVisible();
  await expect(page.getByText("Password is required")).toBeVisible();

  await page.getByLabel("Email").fill("dev@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "You are logged in" })).toBeVisible();
});
