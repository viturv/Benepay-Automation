import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://uat-payouts.benepay.io/client-debtors");
  await page.getByRole("link", { name: "Invoices" }).click();
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

  await page.getByRole("button", { name: "Submit" }).click();
  await page
    .getByText("Please add at least one line item with a description.✕")
    .click();

    await page.waitForTimeout(5000);
});
