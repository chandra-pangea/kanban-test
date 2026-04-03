import { defineConfig, devices } from "@playwright/test";

const slowMoMs = process.env.PW_SLOW_MO ? Number(process.env.PW_SLOW_MO) : 0;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    launchOptions:
      Number.isFinite(slowMoMs) && slowMoMs > 0
        ? {
            slowMo: slowMoMs,
          }
        : {},
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
