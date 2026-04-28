import { test, expect } from "@playwright/test";

test.use({
  storageState: "auth.json",
});

test("test", async ({ page }) => {
  await page.goto("https://uat-payouts.benepay.io/client-debtors");
  await page.getByRole("button", { name: "Payments" }).click();
  await page.getByRole("link", { name: "Bulk Payments" }).click();
  await page.getByRole("button", { name: "Upload File" }).click();
  await page
    .getByRole("combobox")
    .filter({ hasText: "Select client..." })
    .click();
  await page.getByRole("option", { name: "Nexa" }).click();
  await page.getByRole("combobox", { name: "Select File Format *" }).click();
  await page.getByText("International ISO 20022 (XML)").click();
  await page
    .getByRole("combobox")
    .filter({ hasText: "Select debit account..." })
    .click();
  await page.getByText("benepay - USD").click();
  await page.getByRole("button", { name: "Select Processing Date" }).click();
  await page.getByRole("gridcell", { name: "29" }).nth(1).click();
  await page
    .locator('input[type="file"]')
    .setInputFiles("C:/Users/vitur/Downloads/ISO20022SampleFIle.xml");
  await page.getByRole("button", { name: "Upload File" }).click();
  await page.getByText("Validation with Errors").click();

  await page.waitForTimeout(2000);
});
