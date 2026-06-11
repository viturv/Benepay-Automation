import { test, expect } from '../../utils/adminFixture.js';
import type { Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import { BASE_URL } from '../../utils/config.js';


async function fillFieldByLabel(
  page: Page,
  label: string,
  value: string
) {
  await page
    .locator(`text=${label}`)
    .locator('..')
    .getByRole('textbox')
    .fill(value);
}

const invoiceFolder = path.resolve('invoices');

const pdfFile = fs
  .readdirSync(invoiceFolder)
  .find(file => file.toLowerCase().endsWith('.pdf'));

if (!pdfFile) {
  throw new Error(`No PDF found in ${invoiceFolder}`);
}

const filePath = path.join(invoiceFolder, pdfFile);

test.describe('Invoices', () => {
  test.setTimeout(100_000);

  test('Save Invoice In Draft', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;

    await page.goto(`${BASE_URL}/invoices`);

    await page.getByRole('button', { name: 'Upload New Invoice' }).click();
    await page.locator('input[type="file"]').setInputFiles(filePath);

    await expect(page.getByText('Scanning document...')).toBeHidden({
      timeout: 90_000,
    });

    await expect(
      page.getByRole('heading', { name: /Invoice Information/i })
    ).toBeVisible({
      timeout: 30_000,
    });

    await page
      .getByRole('textbox', { name: 'Supplier Invoice Number *' })
      .fill(invoiceNumber);

    const glCodeCombobox = page
      .getByRole('combobox')
      .filter({ hasText: 'Select GL code' });

    if (await glCodeCombobox.isVisible()) {
      await glCodeCombobox.click();
      await page.getByRole('option', { name: '310 - Cost of Goods Sold' }).click();
    }

    await page
      .locator('text=Tax Type')
      .locator('..')
      .getByRole('combobox')
      .click();

    await page.getByRole('option', { name: 'ZERORATEDINPUT' }).click();

    await fillFieldByLabel(page, 'Commission / Discount:', '100.00');
    await fillFieldByLabel(page, 'VAT / Tax Amount (as read from invoice):', '10.00');
    await fillFieldByLabel(page, 'Advance Paid:', '10.00');

    const saveButton = page.getByRole('button', { name: 'Save as Draft' });

    await expect(saveButton).toBeEnabled({
      timeout: 15_000,
    });

    await saveButton.click();

    const refreshButton = page.getByRole('button', { name: 'Refresh' });

    await expect(refreshButton).toBeVisible({
      timeout: 15_000,
    });

    await refreshButton.click();
  });
});

