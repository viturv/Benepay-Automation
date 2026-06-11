import { test, expect } from "../../utils/adminFixture.js";
import 'dotenv/config';
import { BASE_URL } from '../../utils/config.js';
import path from 'path';

const filePath = path.resolve(
  'invoices',
  'NoSupplier',
  'NoSupplier.pdf'
);


test("No supplier selected", async ({ page }) => {
   await page.goto(BASE_URL + '/invoices');
  await page.getByRole("button", { name: "Upload New Invoice" }).click();
  await page.locator('input[type="file"]').setInputFiles(filePath);


  
  
  // Submit without selecting supplier
  await page.getByRole("button", { name: "Submit" }).click();
  
  // Verify the supplier validation error appears
  await expect(page.getByText("Please select a supplier")).toBeVisible();

  await page.waitForTimeout(5000);
});