import { test, expect } from '@playwright/test'

test('critical login path renders and submits', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  await page.getByLabel('Email address').fill('user@example.com')
  await page.getByLabel('Password').fill('securepass')
  await page.getByRole('button', { name: 'Log in' }).click()

  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
})
