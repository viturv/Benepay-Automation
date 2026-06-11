import { test, expect } from "../../utils/adminFixture.js";
import 'dotenv/config';
import { BASE_URL } from '../../utils/config.js';

test("Create Invoice With No Line Items", async ({ page }) => {
  await page.goto(BASE_URL + '/invoices');
  await page.getByRole("button", { name: "Create Invoice" }).click();

  await page.waitForLoadState('networkidle');

  await page.getByRole("textbox", { name: "Supplier Invoice Number" }).click();
  await page
    .getByRole("textbox", { name: "Supplier Invoice Number" })
    .fill("897\\98");
  // ✅ FIX: locate combobox via nearby text
  const invoiceTypeDropdown = page
    .locator("text=Invoice Type *")
    .locator('xpath=following::button[@role="combobox"][1]');

  await invoiceTypeDropdown.click();
  await page.getByRole("option", { name: "Credit Transfers" }).click();

  // Currency dropdown
  const currencyDropdown = page
    .locator("text=Currency")
    .locator('xpath=following::button[@role="combobox"][1]');

  await currencyDropdown.click();

  await page.getByRole('option', { name: 'GBP - Pound Sterling' }).click();

  await page.getByRole('combobox').filter({ hasText: '545' }).click();
  await page.getByRole('option', { name: 'HealthEquip Solutions Ltd' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Submit" }).click();
  await page
    .getByText("Please add at least one line item with a description.✕")
    .click();

  await page.waitForTimeout(5000);
});
