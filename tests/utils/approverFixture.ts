import { test as base, Page } from '@playwright/test';
import * as fs from 'fs';
import { BASE_URL } from './config.js';

const AUTH_FILE = '.auth/approver-auth.json';

async function injectSessionStorage(page: Page) {
  if (!fs.existsSync(AUTH_FILE)) {
    throw new Error(
      `Approver auth file not found: ${AUTH_FILE}`
    );
  }

  const auth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
  const sessionData: Record<string, string> = auth.sessionStorage ?? {};

  if (Object.keys(sessionData).length === 0) {
    throw new Error(
      'Approver auth file contains no sessionStorage data'
    );
  }

  await page.goto(BASE_URL);

  await page.evaluate((data) => {
    for (const [key, value] of Object.entries(data)) {
      sessionStorage.setItem(key, value);
    }
  }, sessionData);
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await injectSessionStorage(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';