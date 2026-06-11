import { expect, type Locator, type Page } from '@playwright/test';
import { BASE_URL } from './config.js';

export async function approvePendingInvoice(page: Page): Promise<void> {
  await approvePendingApprovalSection(page, /^Invoice\s*\(\d+\)$/i);
}

export async function approvePendingSupplier(page: Page): Promise<void> {
  await approvePendingApprovalSection(page, /^Supplier\s*\(\d+\)$/i);
}

export async function approvePendingSupplierBankAccount(page: Page): Promise<void> {
  await approvePendingApprovalSection(page, /^Supplier Bank Account\s*\(\d+\)$/i);
}

export async function approvePendingPaymentBatch(page: Page): Promise<void> {
  await approvePendingApprovalSection(page, /^Payment Batch\s*\(\d+\)$/i);
}

export async function approvePendingBulkPayment(page: Page): Promise<void> {
  await approvePendingApprovalSection(page, /^Bulk Payment\s*\(\d+\)$/i);
}


async function approvePendingApprovalSection(
  page: Page,
  sectionTitle: RegExp
): Promise<void> {
  await page.goto(`${BASE_URL}/approvals`);

  if (/login|signin|sign-in/i.test(page.url())) {
    throw new Error(
      'Approver session is not logged in. Check approver-auth.json sessionStorage.'
    );
  }

  await expect(
    page.getByRole('heading', { name: /Approval Management/i })
  ).toBeVisible({ timeout: 30_000 });

  const section = getApprovalSection(page, sectionTitle);

  await expect(section).toBeVisible({ timeout: 30_000 });

  const pendingRow = section
    .locator('tbody tr')
    .filter({ has: page.getByText(/Pending Approval/i) })
    .filter({ has: page.getByRole('button', { name: /^Approve$/i }) })
    .first();

  await expect(pendingRow).toBeVisible({ timeout: 60_000 });

  await pendingRow.getByRole('button', { name: /^Approve$/i }).click();

  const confirmButton = page
    .getByRole('dialog')
    .getByRole('button', { name: /^(Confirm Approval|Approve)$/i });

  await expect(confirmButton).toBeVisible({ timeout: 15_000 });
  await confirmButton.click();

  await expectApprovedTab(page);
}

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