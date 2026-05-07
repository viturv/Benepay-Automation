import { test } from '../utils/fixtures';

function rand(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
function randNum(digits: number) {
  return Math.floor(Math.random() * 9 * 10 ** (digits - 1) + 10 ** (digits - 1)).toString();
}

test('add supplier with random data', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('link', { name: 'Suppliers' }).click();
  await page.getByRole('button', { name: 'Add Supplier' }).click();

  // Client selection
  await page.getByRole('combobox').filter({ hasText: 'Select client' }).click();
  await page.getByRole('option', { name: 'Nexa' }).click();

  // Supplier details
  await page.getByRole('textbox', { name: 'Company ID' }).fill(randNum(5));
  await page.getByRole('textbox', { name: 'Legal Name *' }).fill(rand('Sup'));
  await page.getByRole('textbox', { name: 'VAT ID' }).fill(randNum(5));
  await page.getByRole('textbox', { name: 'Trading Name' }).fill(rand('Trade'));
  await page.getByRole('textbox', { name: 'Contact Name' }).fill(rand('Contact'));
  await page.getByRole('textbox', { name: 'Contact Email' }).fill(`${rand('auto').toLowerCase()}@gmail.com`);
  await page.getByRole('textbox', { name: 'Contact Phone' }).fill(randNum(9));

  // Currency
  await page.getByRole('combobox').filter({ hasText: 'GBP - Pound Sterling' }).click();
  await page.getByRole('option', { name: 'GBP - Pound Sterling' }).click();

  // Address
  await page.getByRole('textbox', { name: 'Street address' }).first().fill(rand('Street'));
  await page.getByRole('textbox', { name: 'Apartment, suite, etc.' }).first().fill(rand('Apt'));
  await page.getByRole('textbox', { name: 'City' }).first().fill(rand('City'));
  await page.getByRole('textbox', { name: 'Postal code' }).first().fill(randNum(6));
  await page.getByRole('textbox', { name: 'State or County' }).first().fill(rand('State'));
  await page.getByRole('checkbox', { name: 'Same as Registered Address' }).click();

  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Bank account
  await page.getByRole('button', { name: 'Add Bank Account' }).click();
  await page.getByRole('combobox').filter({ hasText: 'Select currency' }).click();
  await page.getByText('GBP - Pound Sterling').click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByRole('textbox', { name: 'Bank Account Name *' }).fill(rand('Acc'));
  await page.getByRole('textbox', { name: 'Branch Code (Sort Code) *' }).fill('110011');
  await page.getByRole('textbox', { name: 'Account Number *' }).fill(randNum(8));
  await page.getByRole('combobox').filter({ hasText: 'Select type...' }).click();
  await page.getByRole('option', { name: 'Individual' }).click();

  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Activate' }).click();
  await page.getByRole('button', { name: 'Refresh' }).click();
});