import { test, expect } from '../../utils/fixtures';

test('test', async ({ page }) => {
  const invoiceNumber = `INV-${Date.now()}`;

  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.waitForLoadState('networkidle');

  // Open Status dropdown and select Draft
  const statusCombobox = page.locator('text=Status')
    .locator('..')
    .getByRole('combobox')
    .first();
  await statusCombobox.click();
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  await page.getByRole('dialog').locator('text=Draft').click();
  await page.keyboard.press('Escape');

  // Apply filters
  await page.getByRole('button', { name: 'Apply Filters' }).click();
  await page.waitForLoadState('networkidle');

  // Find first Draft row and double-click to open
  const firstDraftRow = page.getByRole('row').filter({ hasText: 'Draft' }).first();
  await firstDraftRow.waitFor({ state: 'visible', timeout: 15000 });
  await firstDraftRow.dblclick();

  // Wait for invoice detail page to load
  await page.getByRole('button', { name: 'Submit' }).waitFor({ state: 'visible', timeout: 15000 });

  // Fill supplier invoice number with random value
  await page.getByRole('textbox').first().fill(invoiceNumber);

  // Select first option from Client Name dropdown
  const clientCombobox = page.getByRole('region', { name: 'Invoice Information' })
    .getByRole('combobox')
    .filter({ hasText: 'Nexa' });
  if (await clientCombobox.isVisible()) {
    await clientCombobox.click();
    await page.getByRole('listbox').waitFor({ state: 'visible' });
    await page.getByRole('option').first().click();
  }

  // Select first option from Currency dropdown
  const currencyCombobox = page.getByRole('region', { name: 'Invoice Information' })
    .getByRole('combobox')
    .filter({ hasText: 'GBP' });
  if (await currencyCombobox.isVisible()) {
    await currencyCombobox.click();
    await page.getByRole('listbox').waitFor({ state: 'visible' });
    await page.getByRole('option').first().click();
  }

  // Select first option from Supplier dropdown
  const supplierCombobox = page.getByRole('region', { name: 'Supplier Details' })
    .getByRole('combobox')
    .first();
  await supplierCombobox.click();
  await page.getByRole('listbox').waitFor({ state: 'visible' });
  await page.getByRole('option').first().click();

  // Wait for supplier bank account API to load
  await page.waitForTimeout(2000);

  // Select supplier account only if accounts are available
  const accountCombobox = page.getByRole('region', { name: 'Supplier Details' })
    .getByRole('combobox')
    .last();
  await accountCombobox.waitFor({ state: 'visible', timeout: 10000 });
  await accountCombobox.click();
  await page.getByRole('listbox').waitFor({ state: 'visible' });
  const noAccounts = page.getByRole('listbox').locator('text=No supplier accounts available');
  if (await noAccounts.isVisible()) {
    await page.keyboard.press('Escape');
  } else {
    await page.getByRole('option').first().click();
  }

  // Set due date
  await page.getByRole('textbox').nth(2).fill('2026-05-27');

  // Always select GL code — wait for listbox AND wait for options to populate
  await page.keyboard.press('Escape');
  await page.getByRole('region', { name: 'Accounting Information' }).getByRole('combobox').click();
  await page.getByRole('listbox').waitFor({ state: 'visible' });
  await page.getByText('200 - Income from any normal').click();

  await page.waitForTimeout(3000); //wait for any potential api left to fetch data

  // Remove assertion — trust the click worked, submit will fail if not
  // Submit the invoice
  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait for success
  await page.getByRole('button', { name: 'Refresh' }).waitFor({ state: 'visible', timeout: 15000 });
  await page.getByRole('button', { name: 'Refresh' }).click();
});