import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://uat-payouts.benepay.io/client-debtors");
  await page.getByRole("button", { name: "Payments" }).click();
  await page.getByRole("link", { name: "Payment Batches" }).click();
  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "Awaiting Release" }).click();
  await page.getByRole("button", { name: "Apply Filters" }).click();
  await page.waitForLoadState("networkidle");
  await page.locator("table tbody tr").first().click();
  await page.locator("table tbody tr").first().locator("td").nth(2).click();
  await page.getByRole("button", { name: "Refresh" }).click();

  await page.waitForTimeout(2000);
});
