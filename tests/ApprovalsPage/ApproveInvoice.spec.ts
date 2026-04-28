import { test, expect } from "@playwright/test";

test.use({
  storageState: "auth.json",
});

test("test", async ({ page }) => {
  // Step 1: Navigate and click the first row's checkbox
  await page.goto("https://uat-payouts.benepay.io/client-debtors");
  await page.getByRole("link", { name: "Approvals" }).click();
  await page.getByRole("cell").first().click();

  // Step 2: Click "Approve" scoped to the first data row only
  const firstRow = page.getByRole("row").nth(1); // nth(0) is the header row
  await firstRow.getByRole("button", { name: "Approve", exact: true }).click();
});
