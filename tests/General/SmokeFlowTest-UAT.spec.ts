import type { Page } from '@playwright/test';
import { test, expect } from '../utils/adminFixture.js';
import { generateInvoicePdf } from '../utils/generateInvoicePdf.js';
import { BASE_URL } from '../utils/config.js';
import {
  approvePendingInvoice,
  approvePendingPaymentBatch,
} from '../utils/approvalActions.js';
import * as fs from 'fs';

const APPROVER_AUTH_FILE = '.auth/approver-auth.json';

test.setTimeout(180_000);

test('Upload invoice + approve invoice + create batch + approve batch + release batch', async ({
  page,
  browser,
}) => {
  const approverContext = await browser.newContext();
  const approverPage = await approverContext.newPage();

  await injectApproverSessionStorage(approverPage);

  try {
    await page.goto(`${BASE_URL}/invoices`);

    await page.getByRole('button', { name: 'Upload New Invoice' }).click();

    const invoiceData = await generateInvoicePdf();

    await page.setInputFiles('input[type="file"]', invoiceData.filePath);

    await expect(page.getByText('Scanning document...')).not.toBeVisible({
      timeout: 120_000,
    });

    await expect(page.getByRole('combobox').first()).toBeVisible({
      timeout: 60_000,
    });

    await page
      .getByRole('combobox')
      .filter({ hasText: 'Select GL code' })
      .click();

    await page
      .getByRole('listbox')
      .getByRole('option', { name: '310 - Cost of Goods Sold' })
      .click();

    const taxCount = await page
      .getByRole('combobox')
      .filter({ hasText: 'Select type' })
      .count();

    for (let i = 0; i < taxCount; i++) {
      await page
        .getByRole('combobox')
        .filter({ hasText: 'Select type' })
        .first()
        .click();

      await page.getByRole('option', { name: 'ZERORATEDINPUT' }).click();
    }

    await page.getByRole('button', { name: 'Submit' }).click();

    await page.waitForURL('**/invoices');
    await expect(page.getByText('All Invoices')).toBeVisible();

    // Approver approves invoice
    await approvePendingInvoice(approverPage);

    // Admin creates batch
    await page.goto(`${BASE_URL}/payment-batches`);

    await page.getByRole('button', { name: 'Create Batch' }).click();

    await page
      .getByRole('combobox')
      .filter({ hasText: 'Choose a client' })
      .click();

    await page.getByRole('option', { name: 'GreenLife Hospitals' }).click();

    await page
      .getByRole('combobox')
      .filter({ hasText: 'Choose debit account' })
      .click();

    await page.getByText(/benepay.*GBP/i).click();

    await page
      .getByRole('dialog')
      .getByRole('row')
      .nth(1)
      .getByRole('checkbox')
      .click();

    await selectReleaseDate(page);

    const createBatchBtn = page
      .getByRole('dialog')
      .getByRole('button', { name: 'Create Batch' });

    await expect(createBatchBtn).toBeEnabled({ timeout: 10_000 });
    await createBatchBtn.click();

    // Approver approves batch
    await approvePendingPaymentBatch(approverPage);

    // Admin releases batch
    // await page.goto(`${BASE_URL}/payment-batches`);

    // await page.getByRole('combobox').nth(1).click();
    // await page.getByRole('option', { name: 'Awaiting Release' }).click();
    // await page.getByRole('button', { name: 'Apply Filters' }).click();

    // await page.getByRole('cell', { name: '1' }).nth(2).dblclick();

    // await page.getByRole('button', { name: 'Release Payment Batch' }).click();

    // await page.getByRole('button', { name: 'Close' }).nth(1).click();
  } finally {
    await approverContext.close();
  }
});

async function injectApproverSessionStorage(page: Page): Promise<void> {
  if (!fs.existsSync(APPROVER_AUTH_FILE)) {
    throw new Error(`Approver auth file not found: ${APPROVER_AUTH_FILE}`);
  }

  const auth = JSON.parse(fs.readFileSync(APPROVER_AUTH_FILE, 'utf-8'));
  const sessionData: Record<string, string> = auth.sessionStorage ?? {};

  if (Object.keys(sessionData).length === 0) {
    throw new Error('Approver auth file contains no sessionStorage data');
  }

  await page.goto(BASE_URL);

  await page.evaluate((data) => {
    for (const [key, value] of Object.entries(data)) {
      sessionStorage.setItem(key, value);
    }
  }, sessionData);
}

async function selectReleaseDate(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Select a date' }).click();

  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + i);

    const targetDay = targetDate.getDate().toString();

    const dayButtons = await page
      .getByRole('gridcell', { name: targetDay, exact: true })
      .all();

    for (const dayButton of dayButtons) {
      if ((await dayButton.isVisible()) && (await dayButton.isEnabled())) {
        await dayButton.click();
        return;
      }
    }
  }

  throw new Error(
    'Could not find any enabled release date within the next 7 days.'
  );
}