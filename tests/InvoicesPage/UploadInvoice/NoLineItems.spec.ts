import { test, expect } from '../../utils/adminFixture.js';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import { BASE_URL } from '../../utils/config.js';

const filePath = path.resolve('invoices', 'NoLineItems', 'NoLineItems.pdf');

if (!fs.existsSync(filePath)) {
  throw new Error(`Invoice PDF not found: ${filePath}`);
}

test.describe('Invoices', () => {
  test.setTimeout(120_000);

  test('Invoice Without Line Items', async ({ page }) => {
    await page.goto(`${BASE_URL}/invoices`);

    await page.getByRole('button', { name: 'Upload New Invoice' }).click();

    await page.locator('input[type="file"]').setInputFiles(filePath);

    await expect(
      page.getByText('Invoice scanned successfully.')
    ).toBeVisible({
      timeout: 90_000,
    });

    await expect(
      page.getByRole('heading', { name: /Invoice Information/i })
    ).toBeVisible({
      timeout: 30_000,
    });

    await page.waitForTimeout(1000);
    const submitButton = page.getByRole('button', { name: 'Submit' });

    await expect(submitButton).toBeEnabled({
      timeout: 15_000,
    });

    await submitButton.click();

    await expect(
      page.getByText(/At least one line item is required/i)
    ).toBeVisible({
      timeout: 15_000,
    });
  });
});