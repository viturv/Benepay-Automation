import { test, expect } from '../../utils/adminFixture.js';
import { BASE_URL } from '../../utils/config.js';

test('release first awaiting payment batch', async ({ page }) => {
  await page.goto(`${BASE_URL}/payment-batches`);

  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'Awaiting Release' }).click();
  await page.getByRole('button', { name: 'Apply Filters' }).click();

  const firstBatchRow = page.locator('table tbody tr').first();

  await expect(firstBatchRow).toBeVisible({ timeout: 30_000 });

  await firstBatchRow.dblclick();

  const releaseButton = page.getByRole('button', {
    name: 'Release Payment Batch',
  });

  await expect(releaseButton).toBeEnabled({ timeout: 15_000 });
  await releaseButton.click();

  const closeButton = page.getByRole('button', { name: 'Close' }).last();

  await expect(closeButton).toBeVisible({ timeout: 15_000 });
  await closeButton.click();
});