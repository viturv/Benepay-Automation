import { test, expect } from '../../utils/fixtures';

test('Create Invoice without selecting required fields', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');

  await page.getByRole('link', { name: 'Invoices' }).click();
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