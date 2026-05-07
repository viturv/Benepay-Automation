import { test, expect } from "@playwright/test";
import path from "path/win32";


const filePath = path.join(
  "C:\\Users\\vitur\\Downloads",
  "missing_supplier_name.pdf",
);

test("test", async ({ page }) => {
  await page.goto("https://uat-payouts.benepay.io/client-debtors");
  await page.getByRole("link", { name: "Invoices" }).click();
  await page.getByRole("button", { name: "Upload New Invoice" }).click();
  await page.locator('input[type="file"]').setInputFiles(filePath);


  
  
  // Submit without selecting supplier
  await page.getByRole("button", { name: "Submit" }).click();
  
  // Verify the supplier validation error appears
  await expect(page.getByText("Please select a supplier")).toBeVisible();

  await page.waitForTimeout(5000);
});