import { test, expect } from '../../utils/adminFixture.js';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import { BASE_URL } from '../../utils/config.js';

const invoiceFolder = 'invoices';

const pdfFile = fs
  .readdirSync(invoiceFolder)
  .find(file => file.endsWith('.pdf'));

if (!pdfFile) {
  throw new Error('No PDF found');
}

const filePath = path.join(invoiceFolder, pdfFile);

test('Upload new invoice', async ({ page }) => {
  test.setTimeout(120000); // correct way to extend timeout inside test body

  const invoiceNumber = `INV-${Date.now()}`;

  await page.goto(BASE_URL + '/invoices');
  await page.getByRole('button', { name: 'Upload New Invoice' }).click();

  // Upload file 
  await page.locator('input[type="file"]').setInputFiles(filePath);

  // Wait for "Scanning document..." to disappear first
  await page.locator('text=Scanning document...').waitFor({ state: 'hidden', timeout: 90000 });

  // Then wait for the invoice form to appear
  await page.getByRole('heading', { name: /Invoice Information/ }).waitFor({ state: 'visible', timeout: 30000 });

  // Fill invoice number
  await page.getByRole('textbox', { name: 'Supplier Invoice Number *' }).fill(invoiceNumber);

  // GL Code - select only if not already pre-filled
  const glCodeCombobox = page.getByRole('combobox').filter({ hasText: 'Select GL code' });
  if (await glCodeCombobox.isVisible()) {
    await glCodeCombobox.click();
    await page.getByRole('listbox').waitFor({ state: 'visible' });
    await page.getByRole('option', { name: '270 - Interest income' }).click();
  }

  // Commission / Discount - scoped by label
  await page.locator('text=Commission / Discount:')
    .locator('..')
    .getByRole('textbox')
    .fill('11450.00');

  // VAT / Tax Amount - scoped by label
  await page.locator('text=VAT / Tax Amount (as read from invoice):')
    .locator('..')
    .getByRole('textbox')
    .fill('10.00');

  // Advance Paid - scoped by label
  await page.locator('text=Advance Paid:')
    .locator('..')
    .getByRole('textbox')
    .fill('10000.00');

  // Wait before submitting to ensure all fields are settled
  await page.waitForTimeout(5000);

  // Submit
  await page.getByRole('button', { name: 'Submit' }).click();

  // // Wait for success confirmation then refresh
  // await page.getByRole('button', { name: 'Refresh' }).waitFor({ state: 'visible', timeout: 15000 });
  // await page.getByRole('button', { name: 'Refresh' }).click();
});