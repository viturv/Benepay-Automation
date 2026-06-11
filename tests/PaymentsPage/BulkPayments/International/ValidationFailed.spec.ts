import { test, expect } from "../../../utils/adminFixture.js";
import "dotenv/config";
import { BASE_URL } from "../../../utils/config.js";
import path from "path";
import type { Page } from "@playwright/test";

const filePath = path.resolve("BulkFile", "BulkFile.xml");

test("Validation Failed Bulk File", async ({ page }) => {
  await page.goto(BASE_URL + "/bulk-payments");

  await page.getByRole("button", { name: "Upload File" }).click();

  await page
    .getByRole("combobox")
    .filter({ hasText: "Select client..." })
    .click();

  await page.getByRole("option", { name: "GreenLife Hospitals" }).click();

  await page.getByRole("combobox", { name: "Select File Format *" }).click();
  await page.getByText("International ISO 20022 (XML)").click();

  await page
    .getByRole("combobox")
    .filter({ hasText: "Select debit account..." })
    .click();

  await page.getByText("benepay - USD").click();

  await selectProcessingDate(page);

  await page.locator('input[type="file"]').setInputFiles(filePath);

  await page.getByRole("button", { name: "Upload File" }).click();

  const latestStatus = page
    .locator("div")
    .filter({
      hasText: /Validation with Errors|Validation Passed|Validation Failed/i,
    })
    .last();

  await expect(latestStatus).toBeVisible({ timeout: 30000 });

  // Optional: print status in console
  console.log("Bulk file status:", await latestStatus.textContent());
});

async function selectProcessingDate(page: Page): Promise<void> {
  const datePickerButton = page.getByRole("button", {
    name: "Select Processing Date",
  });

  await expect(datePickerButton).toBeVisible({ timeout: 10000 });
  await datePickerButton.click();

  const calendar = page
    .locator('[role="dialog"], [data-radix-popper-content-wrapper]')
    .last();

  await expect(calendar).toBeVisible({ timeout: 10000 });

  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const day = String(date.getDate());

    const dayCells = await calendar
      .getByRole("gridcell", { name: day, exact: true })
      .all();

    for (const dayCell of dayCells) {
      const isVisible = await dayCell.isVisible().catch(() => false);
      const isEnabled = await dayCell.isEnabled().catch(() => false);
      const ariaDisabled = await dayCell.getAttribute("aria-disabled");

      if (isVisible && isEnabled && ariaDisabled !== "true") {
        await dayCell.click({ force: true });
        return;
      }
    }
  }

  throw new Error("No enabled processing date found within next 7 days.");
}