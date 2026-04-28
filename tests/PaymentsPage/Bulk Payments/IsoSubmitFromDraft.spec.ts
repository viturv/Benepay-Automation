import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('button', { name: 'Payments' }).click();
  await page.getByRole('link', { name: 'Bulk Payments' }).click();
  await page.getByRole('combobox').filter({ hasText: 'All Types' }).click();
  await page.locator('span').filter({ hasText: 'International ISO' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Filter by status' }).click();
  await page.getByRole('option', { name: 'Validation Passed' }).click();
  await page.getByRole('button', { name: 'Apply Filters' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('cell', { name: 'ISO20022SampleFIle.xml' }).first().click();
  await page.getByRole('button', { name: 'Proceed' }).click();
  await page.getByRole('button', { name: 'Refresh' }).click();
});