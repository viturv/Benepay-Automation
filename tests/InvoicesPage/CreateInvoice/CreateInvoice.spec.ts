import { test, expect } from '../../utils/adminFixture.js';
import 'dotenv/config';
import { BASE_URL } from '../../utils/config.js';

test('CreatingInvoice', async ({ page }) => {
  const invoiceNumber = `INV-${Date.now()}`;
  await page.goto(BASE_URL + '/invoices');
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

  await page.getByRole('combobox').filter({ hasText: '545' }).click();
  await page.getByRole('option', { name: 'HealthEquip Solutions Ltd' }).click();

  // Line item - Description
  await page.getByPlaceholder('Enter item description').fill('Test Item');
  await page.locator('tr').locator('input').nth(1).fill('100');

  await page.locator('input[value="1"]').fill('2');
  // GL Code dropdown

  //   const GlCodeDropdown = page
  //   .locator("text=GL Code")
  //   .locator('xpath=following::button[@role="combobox"][0]');

  // await GlCodeDropdown.click();

  // await page.getByRole('option', { name: 'GBP - Pound Sterling' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Select GL code' }).click();

  await page.getByRole('listbox').waitFor({ state: 'visible' });
  await page.getByRole('option', { name: '310 - Cost of Goods Sold' }).click();

  const TaxDropdown = page
    .locator("text=None")
    .locator('xpath=following::button[@role="combobox"][1]');

  await TaxDropdown.click();
  await page.getByRole('option', { name: 'ZERORATEDINPUT' }).click();

  await page.waitForTimeout(5000);
  // Submit
  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait for success and refresh
  await page.getByRole('button', { name: 'Refresh' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Refresh' }).click();
});