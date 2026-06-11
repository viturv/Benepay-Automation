import { test, expect } from '../utils/adminFixture.js';
import 'dotenv/config';
import { BASE_URL } from '../utils/config.js';
import {
  approvePendingSupplier
} from '../utils/approvalActions.js';
import * as fs from 'fs';

const APPROVER_AUTH_FILE = '.auth/approver-auth.json';

test('Supplier no legal name ', async ({  page,
  browser, }) => {

  const approverContext = await browser.newContext();
  const approverPage = await approverContext.newPage();
  await injectApproverSessionStorage(approverPage);

  // Approver approves invoice
  await approvePendingSupplier(approverPage);

  await page.goto(BASE_URL + '/suppliers');

  // await page.getByRole('link', { name: 'Suppliers' }).click();
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByRole('textbox', { name: 'Legal Name *' }).click();
  await page.getByRole('textbox', { name: 'Legal Name *' }).fill('');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Validation failed. Please').click();
  await page.waitForTimeout(5000);
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