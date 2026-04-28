import { test, expect } from '@playwright/test';
import path from 'path/win32';

test.use({
  storageState: 'auth.json'
});

const filePath = path.join(
  "C:\\Users\\vitur\\Downloads",
  "missing_line_items.pdf",
);

test('test', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByText('InvoicesManage and track all invoicesCreate InvoiceUpload New Invoice').click();
  await page.getByRole('button', { name: 'Upload New Invoice' }).click();
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.getByRole('combobox').filter({ hasText: 'Select supplier (Acme' }).click();
  await page.getByRole('option', { name: 'Suppl' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('At least one line item is required✕').click();

  await page.waitForTimeout(5000);
});