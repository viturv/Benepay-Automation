import { test, expect } from '../utils/fixtures';

// Generates a random 8-digit account number
function randomAccountNumber(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

test('edit supplier and add bank account', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');

  // Navigate to Suppliers
  await page.getByRole('link', { name: 'Suppliers' }).click();

  // Open Edit dialog for the 3rd supplier
  await page.getByRole('button', { name: 'Edit' }).nth(2).click();

  // --- Supplier Details ---
  await page.getByRole('textbox', { name: 'Company ID' }).fill('987');
  await page.getByRole('textbox', { name: 'Legal Name *' }).fill('Suppl');
  await page.getByRole('textbox', { name: 'Trading Name' }).fill('Suppl');
  await page.getByRole('textbox', { name: 'Contact Name' }).fill('Kevadiya Viturv');
  await page.getByRole('textbox', { name: 'Contact Email' }).fill('viturvkv@gmail.com');
  await page.getByRole('textbox', { name: 'Contact Phone' }).fill('09664904065');

  // Select currency
  await page.getByRole('combobox').filter({ hasText: 'GBP - Pound Sterling' }).click();
  await page.getByRole('option', { name: 'GBP - Pound Sterling' }).click();

  // --- Address ---
  await page.getByRole('textbox', { name: 'Street address' }).fill('A, 904, Saundarya Twin');
  await page.getByRole('textbox', { name: 'Apartment, suite, etc.' }).fill('1 church street');
  await page.getByRole('textbox', { name: 'City' }).fill('Surat');
  await page.getByRole('textbox', { name: 'Postal code' }).fill('395004');
  await page.getByRole('textbox', { name: 'State or County' }).fill('Gujarat');

  // --- Next tabs ---
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  // --- Add Bank Account ---
  await page.getByRole('button', { name: 'Add Bank Account' }).click();

  // Select currency for bank account
  await page.getByRole('combobox').filter({ hasText: 'Select currency' }).click();
  await page.getByTitle('GBP - Pound Sterling').click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Fill bank account details with a unique random account number
  const accountNumber = randomAccountNumber();
  await page.getByRole('textbox', { name: 'Bank Account Name *' }).fill('GBP Auto Account');
  await page.getByRole('textbox', { name: 'Branch Code (Sort Code) *' }).fill('110011');
  await page.getByRole('textbox', { name: 'Account Number *' }).fill(accountNumber);

  // Select account type
  await page.getByRole('combobox').filter({ hasText: 'Select type...' }).click();
  await page.getByRole('option', { name: 'Individual' }).click();

  // Submit bank account
  await page.getByRole('button', { name: 'Submit' }).click();

  // Save supplier
  await page.getByRole('button', { name: 'Update Supplier' }).click();

  // Refresh list
  await page.getByRole('button', { name: 'Refresh' }).click();
});