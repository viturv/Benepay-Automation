import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/approvals');

  await page.waitForSelector('h1:has-text("Approval Management")');

  // Bulk Payment is the 3rd table (0=Invoice, 1=Supplier Bank Account, 2=Bulk Payment)
  const bulkPaymentTable = page.locator('table').nth(2);

  // Click the Approve button scoped to the first row of the Bulk Payment table
  await bulkPaymentTable.locator('tbody tr').first().getByRole('button', { name: 'Approve' }).click();

  // Confirm the approval in the dialog
  await page.getByRole('button', { name: 'Confirm Approval' }).click();

  await page.getByRole('button', { name: 'Refresh' }).click();
});