import { test, expect } from '../utils/adminFixture.js';
import { BASE_URL, CLIENT } from '../utils/config.js';
import type { Page } from '@playwright/test';

async function selectComboboxByLabel(
  page: Page,
  label: string,
  optionName: string
): Promise<void> {
  const combobox = page
    .getByText(label, { exact: true })
    .locator('xpath=following::*[@role="combobox"][1]')
    .first();

  await expect(combobox).toBeVisible({ timeout: 15_000 });
  await combobox.click();

  await clickDropdownOption(page, optionName);
}

async function clickDropdownOption(
  page: Page,
  optionName: string
): Promise<void> {
  const optionText = new RegExp(escapeRegExp(optionName), 'i');

  const roleOption = page.getByRole('option', { name: optionText }).first();

  try {
    await expect(roleOption).toBeVisible({ timeout: 5_000 });
    await roleOption.click();
    return;
  } catch {
    // Some dropdown options render without role="option".
  }

  const titleOption = page.getByTitle(optionName).first();

  try {
    await expect(titleOption).toBeVisible({ timeout: 5_000 });
    await titleOption.click();
    return;
  } catch {
    // Fallback to visible text.
  }

  const textOption = page.getByText(optionText).last();

  await expect(textOption).toBeVisible({ timeout: 5_000 });
  await textOption.click();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

test.describe('Client Debtors', () => {
  test.setTimeout(120_000);

  test('Edit Client Details', async ({ page }) => {
    await page.goto(`${BASE_URL}/client-debtors`);

    const clientRow = page.locator('tr').filter({
      has: page.getByText(CLIENT, { exact: true }),
    });

    await expect(clientRow).toBeVisible({ timeout: 30_000 });
    await clientRow.getByRole('button', { name: 'Edit' }).click();

    await expect(
      page.getByRole('heading', { name: /Edit Debtor\/Client/i })
    ).toBeVisible({ timeout: 15_000 });

    // --- Tab 1: Organisation ---
    await page.getByRole('textbox', { name: 'Client Name *' }).fill(CLIENT);
    await page.getByRole('textbox', { name: 'Client Short Name' }).fill(CLIENT);
    await page.getByRole('textbox', { name: 'Company Number' }).fill('001');
    await page.getByRole('textbox', { name: 'VAT ID' }).fill('ID6748');
    await page.getByRole('textbox', { name: 'Legal Name *' }).fill(CLIENT);

   await selectComboboxByLabel(
  page,
  'Base Currency *',
  'USD - United States Dollar'
);

    await page.getByRole('button', { name: 'Next' }).click();

    // --- Tab 2: Contacts ---
    await expect(page.getByRole('heading', { name: /Primary Contact/i })).toBeVisible();

    await page.getByRole('textbox').nth(0).fill('Viturv');
    await page.getByRole('textbox').nth(1).fill('Kevadiya');

    await page.getByRole('button', { name: 'Next' }).click();

    // --- Tab 3: Addresses ---
    await expect(page.getByRole('heading', { name: /Registered Address/i })).toBeVisible();

    await page.getByRole('textbox').nth(0).fill('SampleStreet');
    await page.getByRole('textbox').nth(1).fill('St');
    await page.getByRole('textbox').nth(2).fill('London');
    await page.getByRole('textbox').nth(3).fill('600001');
    await page.getByRole('textbox').nth(4).fill('UK');

    await page.getByRole('button', { name: 'Next' }).click();

    // --- Tab 4: Logo ---
    await page.getByRole('button', { name: 'Next' }).click();

    // --- Tab 5: Accounts ---
    const fetchAccountsButton = page.getByRole('button', {
      name: 'Fetch Processor Accounts',
    });

    if (await fetchAccountsButton.isVisible()) {
      await fetchAccountsButton.click();
    }

    await page.getByRole('button', { name: 'Next' }).click();

    // --- Tab 6: GL Codes ---
    await page.getByRole('button', { name: 'Next' }).click();


  // --- Tab 7: Services ---
await expect(page.getByText('Service Subscriptions')).toBeVisible();

await selectComboboxByLabel(page, 'Invoice Approvals', '4 Eye');

// await resetAllowedCurrencies(page, ['GBP', 'USD']);

// await selectComboboxByLabel(
//   page,
//   'Default Invoice Currency',
//   'GBP - Pound Sterling'
// );

// await selectComboboxByLabel(
//   page,
//   'Default Invoice Currency',
//   'USD - United States Dollar'
// );

    await page.getByRole('button', { name: 'Next' }).click();

    // --- Tab 8: Notifications ---
    const saveButton = page.getByRole('button', { name: 'Save' });

    await expect(saveButton).toBeEnabled({ timeout: 15_000 });
    await saveButton.click();

    const refreshButton = page.getByRole('button', { name: 'Refresh' });

    await expect(refreshButton).toBeVisible({ timeout: 30_000 });
    await refreshButton.click();
  });
});

