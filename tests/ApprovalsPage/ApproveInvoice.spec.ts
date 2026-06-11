import { test, expect } from '../utils/approverFixture.js';
import { BASE_URL } from '../utils/config.js';
import type { Page, Locator } from '@playwright/test';

test('approve invoice', async ({ page }) => {
  await page.goto(`${BASE_URL}/approvals`);

  await expect(
    page.getByRole('heading', { name: /Approval Management/i })
  ).toBeVisible({ timeout: 30_000 });

  const invoiceSection = getApprovalSection(page, /Invoice\s*\(\d+\)/i);

  const pendingInvoiceRow = invoiceSection
    .locator('tbody tr')
    .filter({ has: page.getByText(/Pending Approval/i) })
    .filter({ has: page.getByRole('button', { name: /^Approve$/i }) })
    .first();

  await expect(pendingInvoiceRow).toBeVisible({ timeout: 30_000 });

  await pendingInvoiceRow
    .getByRole('button', { name: /^Approve$/i })
    .click();

  await page.getByRole('button', { name: /Confirm Approval/i }).click();

  await expectApprovedTab(page);

  await page.getByRole('button', { name: 'Refresh' }).click();
});

async function expectApprovedTab(page: Page): Promise<void> {
  const approvedTab = page.getByRole('tab', { name: /^Approved$/i });

  await expect(approvedTab).toBeVisible({ timeout: 30_000 });

  await expect(approvedTab).toHaveAttribute('aria-selected', 'true', {
    timeout: 30_000,
  });
}

function getApprovalSection(page: Page, sectionTitle: RegExp): Locator {
  return page
    .getByText(sectionTitle)
    .locator('xpath=ancestor::*[.//table][1]');
}