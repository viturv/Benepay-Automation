import { test, expect } from '../utils/adminFixture.js';
import { BASE_URL, CLIENT } from '../utils/config.js';
import type { Page } from '@playwright/test';

async function selectComboboxOption(
  page: Page,
  currentText: RegExp | string,
  optionName: string
): Promise<void> {
  const combobox = page
    .getByRole('combobox')
    .filter({ hasText: currentText })
    .first();

  await expect(combobox).toBeVisible({ timeout: 15_000 });
  await combobox.click();

  await page.getByRole('option', { name: optionName }).click();
}

async function resetAllowedCurrencies(
  page: Page,
  currencies: string[]
): Promise<void> {
  const removeButtons = page.getByRole('button', {
    name: 'Remove currency',
  });

  while (await removeButtons.count()) {
    await removeButtons.first().click();
  }

  for (const currency of currencies) {
    await page
      .getByRole('combobox')
      .filter({ hasText: 'Select currency to add' })
      .click();

    const searchBox = page.getByPlaceholder('Search currency...');

    await searchBox.fill(currency);
    await searchBox.press('Enter');
  }
}

test('Reset Client Details Back To Normal', async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto(`${BASE_URL}/client-debtors`);

  const clientRow = page.locator('tr').filter({
    has: page.getByText(CLIENT, { exact: true }),
  });

  await expect(clientRow).toBeVisible({ timeout: 30_000 });
  await clientRow.getByRole('button', { name: 'Edit' }).click();

  // --- Tab 1: Organisation ---
  await page.getByRole('textbox', { name: 'Client Name *' }).fill(CLIENT);
  await page.getByRole('textbox', { name: 'Client Short Name' }).fill('GreenLife');
  await page.getByRole('textbox', { name: 'Company Number' }).fill('');
  await page.getByRole('textbox', { name: 'VAT ID' }).fill('001');
  await page.getByRole('textbox', { name: 'Legal Name *' }).fill(CLIENT);
  await page.getByRole('textbox', { name: 'Trading Name' }).fill(CLIENT);
  await page.getByRole('textbox', { name: 'Tax Registration Number' }).fill('');
  await page.getByRole('textbox', { name: 'Website URL' }).fill('https://www.example.com');

  await selectComboboxOption(
    page,
    /INR - Indian Rupee|USD - United States Dollar|GBP - Pound Sterling/i,
    'INR - Indian Rupee'
  );

  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 2: Contacts ---
  await page.getByRole('textbox').nth(0).fill('Anurag');
  await page.getByRole('textbox').nth(1).fill('Pundir');
  await page.getByRole('textbox').nth(2).fill('');
  await page.getByRole('textbox').nth(3).fill('anurag@benepay.io');
  await page.getByRole('textbox').nth(4).fill('7123456789');

  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 3: Addresses ---
  await page.getByRole('textbox').nth(0).fill('Main Street');
  await page.getByRole('textbox').nth(1).fill('');
  await page.getByRole('textbox').nth(2).fill('Saharanpur');
  await page.getByRole('textbox').nth(3).fill('247001');
  await page.getByRole('textbox').nth(4).fill('Uttar Pradesh');

  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 4: Logo ---
  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 5: Accounts ---
  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 6: GL Codes ---
  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 7: Services ---
  await selectComboboxOption(page, /None|4 Eye|6 Eye/i, 'None');

  await resetAllowedCurrencies(page, ['GBP', 'USD', 'INR', 'EUR']);

  await selectComboboxOption(
    page,
    /USD - United States Dollar|GBP - Pound Sterling|INR - Indian Rupee|None/i,
    'USD - United States Dollar'
  );

  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 8: Notifications ---
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible({
    timeout: 30_000,
  });

  await page.getByRole('button', { name: 'Refresh' }).click();
});