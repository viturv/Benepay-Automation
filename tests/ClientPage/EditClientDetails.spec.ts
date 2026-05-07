import { test, expect } from '../utils/fixtures';

test('test', async ({ page }) => {
  // Navigate to client page and open Edit dialog
  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('button', { name: 'Edit' }).click();

  // --- Tab 1: Organisation ---
  await page.getByRole('textbox', { name: 'Client Name *' }).fill('Nexa');
  await page.getByRole('textbox', { name: 'Client Short Name' }).fill('Nex');
  await page.getByRole('textbox', { name: 'Company Number' }).fill('001');
  await page.getByRole('textbox', { name: 'VAT ID' }).fill('ID6748');
  await page.getByRole('textbox', { name: 'Legal Name *' }).fill('Nexa');

  // Change default currency on Organisation tab
  await page.getByRole('combobox').filter({ hasText: 'USD - United States Dollar' }).click();
  await page.getByPlaceholder('Search currency...').fill('usd');
  await page.getByTitle('USD - United States Dollar').click();

  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 2: Contacts ---
  await page.getByRole('textbox').first().fill('Viturv');
  await page.getByRole('textbox').nth(1).fill('Kevadiya');
  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 3: Addresses ---
  await page.getByRole('textbox').first().fill('SampleStreet');
  await page.getByRole('textbox').nth(1).fill('St');
  await page.getByRole('textbox').nth(2).fill('London');
  await page.getByRole('textbox').nth(3).fill('600001');
  await page.getByRole('textbox').nth(4).fill('UK');
  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 4: Logo (skip) ---
  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 5: Accounts ---
  await page.getByRole('button', { name: 'Fetch Processor Accounts' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 6: GL Codes (skip) ---
  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 7: Services ---

  // Set Invoice Approvals
  await page.getByRole('combobox').filter({ hasText: 'Eye' }).click();
  await page.getByRole('option', { name: '4 Eye' }).click();

  // Remove all existing currencies
  const removeBtns = page.getByRole('button', { name: 'Remove currency' });
  const count = await removeBtns.count();
  for (let i = 0; i < count; i++) {
    await removeBtns.first().click();
    await page.waitForTimeout(300);
  }

  // Add GBP currency
  await page.getByRole('combobox').filter({ hasText: 'Select currency to add' }).click();
  await page.getByPlaceholder('Search currency...').fill('GBP');
  await page.getByPlaceholder('Search currency...').press('Enter');

  // Add USD currency
  await page.getByRole('combobox').filter({ hasText: 'Select currency to add' }).click();
  await page.getByPlaceholder('Search currency...').fill('USD');
  await page.getByPlaceholder('Search currency...').press('Enter');

  // Set Default Invoice Currency to GBP
  // After currencies are added, the default combobox will show either 'None' or a previous value
  const defaultCurrencyCombobox = page.getByRole('combobox').filter({ hasText: /None|USD - United States Dollar|GBP - Pound Sterling/ }).last();
  await defaultCurrencyCombobox.click();
  await page.getByRole('option', { name: 'GBP - Pound Sterling' }).click();

  // Change Default Invoice Currency to USD
  await page.getByRole('combobox').filter({ hasText: 'GBP - Pound Sterling' }).click();
  await page.getByText('USD - United States Dollar').click();

  await page.getByRole('button', { name: 'Next' }).click();

  // --- Tab 8: Notifications ---
  await page.getByRole('button', { name: 'Save' }).click();

  // Refresh the list to confirm save
  await page.getByRole('button', { name: 'Refresh' }).click();
});