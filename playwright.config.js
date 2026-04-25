// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',

 use: {
    trace: 'on-first-retry',
    headless: false,
    storageState: 'auth.json',  // ✅ Use saved session every time
  },

  projects: [
    {
      name: 'chrome-persistent',
      use: {
        channel: 'chrome',
      },
    },
  ],
});