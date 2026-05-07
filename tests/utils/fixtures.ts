import { test as base, Page } from '@playwright/test';
import * as fs from 'fs';

const AUTH_FILE = 'auth.json';

async function injectSessionStorage(page: Page) {
  if (!fs.existsSync(AUTH_FILE)) {
    throw new Error(
      `auth.json not found. Run: npx ts-node tests/utils/saveSession.ts`
    );
  }

  const auth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
  const sessionData: Record<string, string> = auth.sessionStorage ?? {};

  if (Object.keys(sessionData).length === 0) {
    console.warn('⚠️  auth.json has no sessionStorage data. Re-run saveSession.ts');
    return;
  }

  // Navigate to the origin first so sessionStorage can be set on the right domain
  await page.goto('https://uat-payouts.benepay.io/');

  // Inject all sessionStorage keys
  await page.evaluate((data) => {
    for (const [key, value] of Object.entries(data)) {
      sessionStorage.setItem(key, value);
    }
  }, sessionData);
}

// Export a custom `test` with session pre-injected
export const test = base.extend<{ authenticatedPage: Page }>({
  // Override the default `page` fixture to auto-inject session
  page: async ({ page }, use) => {
    await injectSessionStorage(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';