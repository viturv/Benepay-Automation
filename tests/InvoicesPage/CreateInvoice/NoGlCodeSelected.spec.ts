import { test, expect } from '../../utils/fixtures';

test('test', async ({ page }) => {
  await page.goto('https://uat-payouts.benepay.io/client-debtors');
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByRole('button', { name: 'Create Invoice' }).click();

  await page.waitForLoadState('networkidle');

  await page.getByRole('textbox', { name: 'Supplier Invoice Number' }).click();
  await page.getByRole('textbox', { name: 'Supplier Invoice Number' }).fill('235');
   const invoiceTypeDropdown = page
    .locator("text=Invoice Type *")
    .locator('xpath=following::button[@role="combobox"][1]');

  await invoiceTypeDropdown.click();
  await page.getByRole("option", { name: "Credit Transfers" }).click();
  await page.getByRole('textbox', { name: 'Enter item description' }).click();
  await page.getByRole('textbox', { name: 'Enter item description' }).fill('Sample');
  await page.getByRole('cell', { name: '0.00', exact: true }).getByRole('textbox').click();
  await page.getByRole('cell', { name: '0.00', exact: true }).getByRole('textbox').fill('90.00');
  await page.getByRole('cell', { name: '1' }).getByRole('textbox').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('Please select GL Code at invoice level or for each line item.✕').click();

  await page.waitForTimeout(5000);
});