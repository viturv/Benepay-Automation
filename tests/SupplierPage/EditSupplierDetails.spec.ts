import { test, expect } from '../utils/adminFixture.js';
import 'dotenv/config';
import { BASE_URL} from '../utils/config.js';
import type { Page, Locator } from '@playwright/test';
import {
  approvePendingSupplier
} from '../utils/approvalActions.js';
import * as fs from 'fs';

const APPROVER_AUTH_FILE = '.auth/approver-auth.json';


// Generates a random 8-digit account number
function randomAccountNumber(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

test('edit supplier and add bank account', async ({  page,
  browser, }) => {

   const approverContext = await browser.newContext();
  const approverPage = await approverContext.newPage();
    await injectApproverSessionStorage(approverPage);

        // Approver approves invoice   Uncomment this line if the supplier being edited is in "Pending Approval" status and needs to be approved before editing.  
    // await approvePendingSupplier(approverPage);


  await page.goto(BASE_URL + '/suppliers');

  // Navigate to Suppliers
  // await page.getByRole('link', { name: 'Suppliers' }).click();

  // Open Edit dialog for the 3rd supplier
  await page.getByRole('button', { name: 'Edit' }).nth(0).click();

//   const supplierRow = page.locator('tr').filter({
//   has: page.getByText('545')
// });

// await supplierRow.getByRole('button', { name: 'Edit' }).click();

  // --- Supplier Details ---
  await page.getByRole('textbox', { name: 'Company ID' }).fill('987');
  await page.getByRole('textbox', { name: 'Legal Name *' }).fill('Suppl');
  await page.getByRole('textbox', { name: 'Trading Name' }).fill('Suppl');
  await page.getByRole('textbox', { name: 'Contact Name' }).fill('Automation Tester');
  await page.getByRole('textbox', { name: 'Contact Email' }).fill('tester@gmail.com');
  await page.getByRole('textbox', { name: 'Contact Phone' }).fill('09664904065');

  // Select currency
  await page.getByRole('combobox').filter({ hasText: 'GBP - Pound Sterling' }).click();
  await page.getByRole('option', { name: 'GBP - Pound Sterling' }).click();

// --- Address ---
await fillAddressSection(page, 'Registered Address', {
  addressLine1: 'A, 904, Saundarya Twin',
  addressLine2: '1 church street',
  city: 'Surat',
  postalCode: '395004',
  stateCounty: 'Gujarat',
  country: 'United Kingdom',
});

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

   await page.getByText("Supplier updated successfully! ").click();

});


type AddressSectionName = 'Registered Address' | 'Trading Address';

type AddressDetails = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  stateCounty: string;
  country?: string;
};

async function fillAddressSection(
  page: Page,
  sectionName: AddressSectionName,
  address: AddressDetails
): Promise<void> {
  const section = getAddressSection(page, sectionName);

  await fillTextbox(section, 'Address Line 1', 'Street address', address.addressLine1);
  await fillTextbox(section, 'Address Line 2', 'Apartment, suite, etc.', address.addressLine2);
  await fillTextbox(section, 'City', 'City', address.city);
  await fillTextbox(section, 'Postal Code', 'Postal code', address.postalCode);
  await fillTextbox(section, 'State/County', 'State or County', address.stateCounty);

  if (address.country) {
    await selectCountry(section, address.country);
  }
}

function getAddressSection(page: Page, sectionName: AddressSectionName): Locator {
  return page
    .getByText(sectionName, { exact: true })
    .locator('xpath=ancestor::*[.//input or .//textarea or .//*[@role="combobox"]][1]');
}

async function fillTextbox(
  section: Locator,
  label: string,
  placeholder: string,
  value: string
): Promise<void> {
  const byLabel = section.getByRole('textbox', { name: label });
  const textbox = (await byLabel.count())
    ? byLabel.first()
    : section.getByPlaceholder(placeholder).first();

  await textbox.fill(value);
}

async function selectCountry(section: Locator, country: string): Promise<void> {
  const countryCombobox = section.getByRole('combobox').last();

  await countryCombobox.click();
  await section.page().getByRole('option', { name: country }).click();
}

async function injectApproverSessionStorage(page: Page): Promise<void> {
  if (!fs.existsSync(APPROVER_AUTH_FILE)) {
    throw new Error(`Approver auth file not found: ${APPROVER_AUTH_FILE}`);
  }

  const auth = JSON.parse(fs.readFileSync(APPROVER_AUTH_FILE, 'utf-8'));
  const sessionData: Record<string, string> = auth.sessionStorage ?? {};

  if (Object.keys(sessionData).length === 0) {
    throw new Error('Approver auth file contains no sessionStorage data');
  }

  await page.goto(BASE_URL);

  await page.evaluate((data) => {
    for (const [key, value] of Object.entries(data)) {
      sessionStorage.setItem(key, value);
    }
  }, sessionData);
}