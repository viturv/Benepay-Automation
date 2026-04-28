import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('textbox', { name: 'Client Name *' }).click();
  await page.getByRole('textbox', { name: 'Client Name *' }).fill('');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Please fix the following').click();

  await page.waitForTimeout(5000);
});