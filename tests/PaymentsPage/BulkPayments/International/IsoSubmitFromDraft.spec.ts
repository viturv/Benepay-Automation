import { test, expect } from '../../../utils/adminFixture.js';
import 'dotenv/config';
import { BASE_URL } from '../../../utils/config.js';

test.setTimeout(90_000);

test('Submit Bulk File From Draft', async ({ page }) => {
  await page.goto(`${BASE_URL}/bulk-payments`);

  await page.getByRole('combobox').filter({ hasText: 'All Types' }).click();
  await page.locator('span').filter({ hasText: 'International ISO' }).click();

  await page.getByRole('combobox').filter({ hasText: 'Filter by status' }).click();
  await page.getByRole('option', { name: 'Validation Passed' }).click();

  await page.getByRole('button', { name: 'Apply Filters' }).click();
  await page.waitForLoadState('networkidle');

  const firstRow = page.locator('tbody tr').first();
  await expect(firstRow).toBeVisible({ timeout: 30_000 });

  // Open 3 dots action menu from first row
  await firstRow.locator('button').last().click();

  // Click View Details
  await page.getByRole('menuitem', { name: 'View Details' }).click();

  // Wait for details screen/modal
  await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible({
    timeout: 30_000,
  });

  await page.getByRole('button', { name: 'Proceed' }).click();

  // After proceed, check success/validation status
  await expect(
    page.getByText(/Validation Passed|Validation Successful|Success|Submitted successfully/i).last()
  ).toBeVisible({
    timeout: 30_000,
  });
});