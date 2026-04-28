import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('shows validation error when Accounts fields are empty', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');

  await page.getByRole('button', { name: 'Edit' }).click();
  await page.waitForLoadState('networkidle');

  // Navigate to Accounts tab
  await page.getByRole('tab', { name: 'Accounts' }).click();
  await page.waitForLoadState('networkidle');

  // Type then clear each field to mark it as dirty and trigger validation
  await page.getByRole('textbox', { name: 'Enter parent account ID' }).fill('x');
  await page.getByRole('textbox', { name: 'Enter parent account ID' }).fill('');
  await page.getByRole('textbox', { name: 'Enter parent account ID' }).press('Tab');

  await page.getByRole('textbox', { name: 'Login Id' }).fill('x');
  await page.getByRole('textbox', { name: 'Login Id' }).fill('');
  await page.getByRole('textbox', { name: 'Login Id' }).press('Tab');

  await page.getByRole('textbox', { name: 'Api Key' }).fill('x');
  await page.getByRole('textbox', { name: 'Api Key' }).fill('');
  await page.getByRole('textbox', { name: 'Api Key' }).press('Tab');

  await page.getByRole('textbox', { name: 'Base Url' }).fill('x');
  await page.getByRole('textbox', { name: 'Base Url' }).fill('');
  await page.getByRole('textbox', { name: 'Base Url' }).press('Tab');

  await page.getByRole('textbox', { name: 'Webhook Secret' }).fill('x');
  await page.getByRole('textbox', { name: 'Webhook Secret' }).fill('');
  await page.getByRole('textbox', { name: 'Webhook Secret' }).press('Tab');

  // Start watching for the alert BEFORE clicking Next
  const alertPromise = page.waitForSelector('[role="alert"]', {
    state: 'attached',
    timeout: 10000
  });

  // Click Next to trigger validation
  await page.getByRole('button', { name: 'Next' }).click();

  // Wait for alert to appear in DOM
  const alertElement = await alertPromise;

  // ⏸️ Pause 5 seconds so you can visually see the error banner
  await page.waitForTimeout(5000);

  // Grab text before it auto-dismisses
  const alertText = await alertElement.innerText();

  // Assert the correct error message
  expect(alertText).toContain('Please fix the following');
  expect(alertText).toContain('is required');
});