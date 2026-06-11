// @ts-check
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

const AUTH_FILE = 'auth.json';

if (!fs.existsSync(AUTH_FILE)) {
  console.warn(
    '\n⚠️  auth.json not found. Run: npx ts-node tests/utils/saveSession.ts\n'
  );
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
  ['html', {
      open: 'never',
      outputFolder: 'playwright-report'
  }], 
  ['json', {
      outputFile: 'test-results/results.json'
  }]
],
  use: {
    trace: 'on-first-retry',
    headless: true,
    // No storageState here — sessionStorage is injected via fixtures.ts
  },

  projects: [
    {
      name: 'chrome-persistent',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});