import { test, expect } from '../utils/approverFixture.js';
import { BASE_URL } from '../utils/config.js';
import type { Page, Locator } from '@playwright/test';

test('approve supplier bank account', async ({ page }) => {
  await page.goto(`${BASE_URL}/approvals`);

  await expect(
    page.getByRole('heading', { name: /Approval Management/i })
  ).toBeVisible({ timeout: 30_000 });

  const supplierBankAccountSection = getApprovalSection(
    page,
    /Supplier Bank Account\s*\(\d+\)/i
  );

  const pendingBankAccountRow = supplierBankAccountSection
    .locator('tbody tr')
    .filter({ has: page.getByText(/Pending Approval/i) })
    .filter({ has: page.getByRole('checkbox') })
    .first();

  await expect(pendingBankAccountRow).toBeVisible({ timeout: 30_000 });

  await pendingBankAccountRow.getByRole('checkbox').check();

  const approveSelectedButton = page.getByRole('button', {
    name: /Approve Selected/i,
  });

  await expect(approveSelectedButton).toBeEnabled({ timeout: 15_000 });
  await approveSelectedButton.click();

  await page.getByRole('button', { name: /Confirm Approval/i }).click();

  await expectApprovedTab(page);
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