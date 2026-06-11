import type { Page } from '@playwright/test';
import { test, expect } from '../../utils/adminFixture.js';
import { BASE_URL } from '../../utils/config.js';

test('create payment batch', async ({ page }) => {
  await page.goto(`${BASE_URL}/payment-batches`);

  await page.getByRole('button', { name: 'Create Batch' }).click();

  const dialog = page.getByRole('dialog');

  await dialog.getByRole('combobox').filter({ hasText: 'Choose a client' }).click();
  await page.getByRole('option', { name: 'GreenLife Hospitals' }).click();

  await dialog.getByRole('combobox').filter({ hasText: 'Choose debit account' }).click();
  await page.getByText(/benepay.*GBP/i).click();

  await dialog.locator('tbody tr').first().getByRole('checkbox').check();

  await selectReleaseDate(page);

  const createBatchBtn = dialog.getByRole('button', { name: 'Create Batch' });
  await expect(createBatchBtn).toBeEnabled({ timeout: 10_000 });
  await createBatchBtn.click();
});

async function selectReleaseDate(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Select a date' }).click();

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const days = await page
      .getByRole('gridcell', { name: String(date.getDate()), exact: true })
      .all();

    for (const day of days) {
      if ((await day.isVisible()) && (await day.isEnabled())) {
        await day.click();
        return;
      }
    }
  }

  throw new Error('No enabled release date found within next 7 days.');
}