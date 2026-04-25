import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  const invoiceNumber = `INV-${Date.now()}`;

  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByRole('button', { name: 'Create Invoice' }).click();

  // Supplier Invoice Number - unique every run
  await page.getByRole('textbox', { name: 'Supplier Invoice Number' }).fill(invoiceNumber);

  // Invoice Type dropdown - scoped to label to avoid strict mode violation
  const invoiceTypeCombobox = page.locator('text=Invoice Type *')
    .locator('..')
    .getByRole('combobox');
  await invoiceTypeCombobox.click();
  await page.getByRole('listbox').waitFor({ state: 'visible' });
  await page.getByRole('option', { name: 'Direct Debit' }).click();

  // Line item - Description
  await page.getByRole('textbox', { name: 'Enter item description' }).fill('Sample');

  // Line item - Unit Price
  await page.getByRole('cell', { name: '0.00', exact: true }).getByRole('textbox').fill('100');

  // Line item - Quantity
  await page.getByRole('cell', { name: '1', exact: true }).getByRole('textbox').fill('10');

  // GL Code dropdown
  await page.getByRole('combobox').filter({ hasText: 'Select GL code' }).click();
  await page.getByRole('listbox').waitFor({ state: 'visible' });
  await page.getByRole('option', { name: '200 - Income from any normal' }).click();

  await page.waitForTimeout(5000); 
  // Submit
  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait for success and refresh
  await page.getByRole('button', { name: 'Refresh' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Refresh' }).click();
});