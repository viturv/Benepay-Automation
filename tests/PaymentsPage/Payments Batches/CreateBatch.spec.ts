import { test, expect } from '../../utils/fixtures';

test('test', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('button', { name: 'Payments' }).click();
  await page.getByRole('link', { name: 'Bulk Payments' }).click();
  await page.getByRole('link', { name: 'Payment Batches' }).click();
  await page.getByRole('button', { name: 'Create Batch' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Choose a client' }).click();
  await page.getByRole('option', { name: 'Nexa' }).click();
  await page.getByRole('row', { name: 'INV-1776770161367 Nextera £29' }).getByRole('checkbox').click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('500');
  await page.getByRole('combobox').filter({ hasText: 'Choose debit account' }).click();
  await page.getByText('benepay – USD').click();
  await page.getByRole('button', { name: 'Select a date' }).click();
  await page.getByRole('gridcell', { name: '29' }).nth(1).click();
  await page.getByRole('button', { name: 'Create Batch' }).click();
  await page.getByRole('button', { name: 'Refresh' }).click();
});