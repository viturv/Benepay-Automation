import { test, expect } from '../../../utils/adminFixture.js';
import { BASE_URL } from '../../../utils/config.js';
import path from 'path';
import type { Page, Locator } from '@playwright/test';

test.setTimeout(90_000);

const filePath = path.resolve('BulkFile', 'BulkFile.xml');

const invalidStatusPattern =
  /Validation with Errors|Validation Failed|VALIDATION FAILED|Invalid/i;

const validStatusPattern =
  /Validation Passed|Validation Successful|VALIDATION SUCCESSFUL|Valid/i;

const submissionSuccessPattern =
  /Bulk payment file with \d+ valid payment\(s\) has been submitted for approval/i;

test('upload bulk payment file', async ({ page }) => {
  await page.goto(`${BASE_URL}/bulk-payments`);

  await page.getByRole('button', { name: 'Upload File' }).click();

  await page.getByRole('combobox').filter({ hasText: 'Select client...' }).click();
  await page.getByRole('option', { name: 'GreenLife Hospitals' }).click();

  await page.getByRole('combobox', { name: 'Select File Format *' }).click();
  await page.getByText('International ISO 20022 (XML)').click();

  await page.getByRole('combobox').filter({ hasText: 'Select debit account...' }).click();
  await page.getByText('benepay - GBP').click();

  await selectProcessingDate(page);

  await page.locator('input[type="file"]').setInputFiles(filePath);

  await page.getByRole('button', { name: 'Upload File' }).click();

  const fileInfoModal = await waitForFileInfoModal(page);

  const fileStatus = await getStatusValue(fileInfoModal, 'FILE STATUS');
  const validationStatus = await getStatusValue(fileInfoModal, 'VALIDATION STATUS');

  console.log(`File Status: ${fileStatus}`);
  console.log(`Validation Status: ${validationStatus}`);

  if (invalidStatusPattern.test(fileStatus) || invalidStatusPattern.test(validationStatus)) {
    throw new Error(
      `Stopping test because uploaded file validation failed.\nFile Status: ${fileStatus}\nValidation Status: ${validationStatus}`,
    );
  }

  expect(
    validStatusPattern.test(validationStatus),
    `Expected validation to pass, but got: ${validationStatus}`,
  ).toBeTruthy();

  await page.getByRole('button', { name: 'Proceed' }).click();

  const submissionMessage = page.getByText(submissionSuccessPattern);
  await expect(submissionMessage).toBeVisible({ timeout: 30_000 });

  console.log(`Bulk payment submission message: ${await submissionMessage.innerText()}`);
});

async function waitForFileInfoModal(page: Page): Promise<Locator> {
  const fileInfoModal = page
    .locator('[role="dialog"], [class*="modal"], [class*="dialog"]')
    .filter({ hasText: 'File Information' })
    .last();

  await expect(fileInfoModal).toBeVisible({ timeout: 60_000 });

  await expect(fileInfoModal.getByText('File Information')).toBeVisible({
    timeout: 30_000,
  });

  return fileInfoModal;
}

async function getStatusValue(modal: Locator, label: string): Promise<string> {
  const labelLocator = modal.getByText(new RegExp(`^${label}$`, 'i')).first();

  await expect(labelLocator).toBeVisible({ timeout: 30_000 });

  const statusBlock = labelLocator.locator(
    'xpath=ancestor::div[contains(@class,"space-y") or contains(@class,"flex") or contains(@class,"grid")][1]',
  );

  const text = (await statusBlock.innerText()).trim();

  const value = text
    .replace(new RegExp(label, 'i'), '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!value) {
    throw new Error(`Could not capture value for ${label}. Block text: ${text}`);
  }

  return value;
}

async function selectProcessingDate(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Select Processing Date' }).click();

  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const dayCells = await page
      .getByRole('gridcell', { name: String(date.getDate()), exact: true })
      .all();

    for (const day of dayCells) {
      if ((await day.isVisible()) && (await day.isEnabled())) {
        await day.click();
        return;
      }
    }
  }

  throw new Error('No enabled processing date found within next 7 days.');
}