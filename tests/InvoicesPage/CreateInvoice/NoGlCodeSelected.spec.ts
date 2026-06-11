import { test, expect } from '../../utils/adminFixture.js';
import 'dotenv/config';
import { BASE_URL } from '../../utils/config.js';

test('CReating Invoice Without GL Code', async ({ page }) => {
  await page.goto(BASE_URL + '/invoices');
  await page.getByRole('button', { name: 'Create Invoice' }).click();

  await page.waitForLoadState('networkidle');

  await page.getByRole('textbox', { name: 'Supplier Invoice Number' }).click();
  await page.getByRole('textbox', { name: 'Supplier Invoice Number' }).fill('235');
  const invoiceTypeDropdown = page
    .locator("text=Invoice Type *")
    .locator('xpath=following::button[@role="combobox"][1]');

  await invoiceTypeDropdown.click();
  await page.getByRole("option", { name: "Credit Transfers" }).click();
  await page.getByRole('combobox').filter({ hasText: '545' }).click();
  await page.getByRole('option', { name: 'HealthEquip Solutions Ltd' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'Enter item description' }).click();
  await page.getByRole('textbox', { name: 'Enter item description' }).fill('Sample');
  await page.getByPlaceholder('Enter item description').fill('Test Item');
  await page.locator('tr').locator('input').nth(1).fill('100');
  await page.locator('input[value="1"]').fill('2');
  const TaxDropdown = page
    .locator("text=None")
    .locator('xpath=following::button[@role="combobox"][1]');

  await TaxDropdown.click();
  await page.getByRole('option', { name: 'ZERORATEDINPUT' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('Please select GL Code at invoice level or for each line item.✕').click();

  await page.waitForTimeout(5000);
});