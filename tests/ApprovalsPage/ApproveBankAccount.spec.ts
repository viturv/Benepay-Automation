import { test, expect } from '../utils/fixtures';

test('test', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/approvals');

  // Wait for the page to fully load
  await page.waitForSelector('h1:has-text("Approval Management")');

  // Supplier Bank Account is the 2nd table (0=Invoice, 1=Supplier Bank Account, 2=Bulk Payment)
  const supplierTable = page.locator('table').nth(1);

  // Click the first row checkbox in the Supplier Bank Account table body
  await supplierTable.locator('tbody tr').first().getByRole('checkbox').click();

  // Click the bulk approve button that appears after selection
  await page.getByRole('button', { name: 'Approve Selected' }).click();
});