import { test, expect } from '../../utils/adminFixture.js';
import 'dotenv/config';
import path from 'path/win32';
import { BASE_URL } from '../../utils/config.js';

const filePath = path.resolve(
  'invoices',
  'NoSupplier',
  'NoSupplier.pdf'
);


function randNum(digits: number) {
  return Math.floor(Math.random() * 9 * 10 ** (digits - 1) + 10 ** (digits - 1)).toString();
}

test('Creating Supplier From Upload Invoice', async ({ page }) => {

  await page.goto(BASE_URL + '/invoices');
  await page.getByRole('button', { name: 'Upload New Invoice' }).click();
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.getByRole('button', { name: 'Add Supplier' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('9878');
  await page.getByRole('textbox').nth(4).click();
  await page.getByRole('textbox').nth(4).fill('SAmpleS');
  await page.getByRole('textbox').nth(5).click();
  await page.getByRole('textbox').nth(5).fill('London');
  await page.locator('div:nth-child(8) > .flex').click();
  await page.locator('div:nth-child(8) > .flex').fill('395004');
  await page.locator('div:nth-child(10) > .flex').click();
  await page.locator('div:nth-child(10) > .flex').fill('9664904998');
  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').fill('quantm@gmail.com');
  await page.getByRole('textbox', { name: 'Account Number *' }).click();
  await page.getByRole('textbox', { name: 'Account Number *' }).fill(randNum(8));
  await page.getByRole('textbox', { name: 'Recipient City *' }).click();
  await page.getByRole('textbox', { name: 'Recipient City *' }).fill('London');
  await page.getByRole('combobox').filter({ hasText: 'Select type...' }).click();
  await page.getByRole('option', { name: 'Individual' }).click();
  await page.getByRole('textbox', { name: 'Branch Code (Sort Code) *' }).click();
  await page.getByRole('textbox', { name: 'Branch Code (Sort Code) *' }).fill('110011');
  await page.getByRole('textbox', { name: 'Recipient Street *' }).click();
  await page.getByRole('textbox', { name: 'Recipient Street *' }).fill('STST');
  await page.getByRole('button', { name: 'Create & Activate Supplier' }).click();
  await page.getByRole('link', { name: 'Suppliers' }).click();
  await page.getByRole('button', { name: 'Refresh' }).click();
});