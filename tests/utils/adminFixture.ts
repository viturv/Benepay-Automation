import {test as base, expect} from '@playwright/test';
import * as fs from 'fs';
import { BASE_URL } from './config.js';
import type { Page } from 'playwright';

const AUTH_FILE = '.auth/admin-auth.json';

async function injectSessionStorage(page: Page) {
  if (!fs.existsSync(AUTH_FILE)) {
    throw new Error(
      `Admin auth file not found: ${AUTH_FILE}`
    );
  }

  const auth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
  const sessionData: Record<string, string> = auth.sessionStorage ?? {};

  if (Object.keys(sessionData).length === 0) {
    throw new Error(
      'Admin auth file contains no sessionStorage data'
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