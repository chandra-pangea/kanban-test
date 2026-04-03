import type { Page } from "@playwright/test";

const USERS_KEY = "basisc-users";
const SESSION_KEY = "basisc-auth-session";

export async function clearBrowserStorage(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
}

export async function seedLoggedInUser(
  page: Page,
  user: { name: string; email: string; password: string },
) {
  const email = user.email.trim().toLowerCase();
  await page.goto("/");
  await page.evaluate(
    (payload) => {
      localStorage.setItem(
        payload.usersKey,
        JSON.stringify([
          {
            name: payload.name,
            email: payload.email,
            password: payload.password,
          },
        ]),
      );
      localStorage.setItem(
        payload.sessionKey,
        JSON.stringify({
          name: payload.name,
          email: payload.email,
        }),
      );
    },
    {
      usersKey: USERS_KEY,
      sessionKey: SESSION_KEY,
      name: user.name,
      email,
      password: user.password,
    },
  );
  await page.reload();
}

/** Stores a user record without a session so the login page can be exercised. */
export async function seedUserOnlyNoSession(
  page: Page,
  user: { name: string; email: string; password: string },
) {
  const email = user.email.trim().toLowerCase();
  await page.goto("/");
  await page.evaluate(
    (payload) => {
      localStorage.setItem(
        payload.usersKey,
        JSON.stringify([
          {
            name: payload.name,
            email: payload.email,
            password: payload.password,
          },
        ]),
      );
      localStorage.removeItem(payload.sessionKey);
    },
    {
      usersKey: USERS_KEY,
      sessionKey: SESSION_KEY,
      name: user.name,
      email,
      password: user.password,
    },
  );
}
