import { test, expect } from '../../utils/adminFixture.js';
import 'dotenv/config';
import { BASE_URL } from '../../utils/config.js';

test('Create Invoice without selecting required fields', async ({ page }) => {
await page.goto(BASE_URL + '/invoices');
  await page.getByRole('button', { name: 'Create Invoice' }).click();

  await expect(page.getByRole('heading', { name: 'Create New Invoice' })).toBeVisible();

  // ✅ FIX: locate combobox via nearby text
  const invoiceTypeDropdown = page
    .locator('text=Invoice Type *')
    .locator('xpath=following::button[@role="combobox"][1]');

  await invoiceTypeDropdown.click();

  await page.getByRole('option', { name: 'Credit Transfers' }).click();

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(
    page.getByText('Please enter a supplier invoice number.')
  ).toBeVisible();

  await page.waitForTimeout(5000);
});