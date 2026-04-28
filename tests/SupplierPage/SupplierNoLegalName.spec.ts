import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('link', { name: 'Suppliers' }).click();
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByRole('textbox', { name: 'Legal Name *' }).click();
  await page.getByRole('textbox', { name: 'Legal Name *' }).fill('');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Validation failed. Please').click();
  await page.waitForTimeout(5000);
});