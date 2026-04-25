import { test, expect, Page, Locator } from "@playwright/test";

test.setTimeout(180000);

// 🔥 Stable dropdown handler
async function selectDropdown(
  page: Page,
  options: {
    index?: number;
    container?: Locator;
    optionText: string;
    label?: string;
  },
) {
  let dropdown: Locator;

  if (options.container) {
    const dropdowns = options.container.getByRole("combobox");

    await expect
      .poll(async () => await dropdowns.count(), { timeout: 20000 })
      .toBeGreaterThan(0);

    dropdown = options.label
      ? options.container.getByRole("combobox", { name: options.label })
      : dropdowns.first();
  } else {
    const dropdowns = page.getByRole("combobox");

    await expect
      .poll(async () => await dropdowns.count(), { timeout: 20000 })
      .toBeGreaterThan(options.index!);

    dropdown = dropdowns.nth(options.index!);
  }

  await expect(dropdown).toBeVisible();
  await expect(dropdown).toBeEnabled();

  await dropdown.click();

  const listbox = page.getByRole("listbox");

  await expect
    .poll(async () => await listbox.count(), { timeout: 15000 })
    .toBeGreaterThan(0);

  const activeListbox = listbox.last();

  let option = activeListbox.getByRole("option", {
    name: options.optionText,
  });

  if (!(await option.count())) {
    option = activeListbox.locator(`text=${options.optionText}`);
  }

  await expect(option.first()).toBeVisible();
  await option.first().click();
}

test("Upload invoice + create batch + release batch", async ({ page }) => {

  // ✅ Goes directly to app - session is loaded from auth.json automatically
  await page.goto("https://uat-payouts.benepay.io/");

  // =========================
  // UPLOAD INVOICE
  // =========================

  await page.getByRole("link", { name: "Invoices" }).click();
  await page.getByRole("button", { name: "Upload New Invoice" }).click();

  await page
    .locator('input[type="file"]')
    .setInputFiles("C:/Users/vitur/Downloads/Invoice.pdf");

  const invoiceInput = page.getByRole("textbox", {
    name: "Supplier Invoice Number *",
  });

  await expect(invoiceInput).toBeVisible({ timeout: 40000 });

  await selectDropdown(page, { index: 2, optionText: "Nexa" });
  await selectDropdown(page, { index: 3, optionText: "Nextera" });

  await invoiceInput.fill(`INV-${Date.now()}`);

  await page.waitForLoadState("networkidle");

  await selectDropdown(page, {
    index: 5,
    optionText: "270 - Interest income",
  });

  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("**/invoices");
  await expect(page.getByText("All Invoices")).toBeVisible();

  // =========================
  // WAIT FOR BACKEND
  // =========================
  await page.waitForTimeout(10000);

  // =========================
  // NAVIGATION
  // =========================

  await page.getByRole("button", { name: "Payments" }).click();
  await page.getByRole("link", { name: "Payment Batches" }).click();
  await page.getByRole("button", { name: "Create Batch" }).click();

  await page
    .getByRole("combobox")
    .filter({ hasText: "Choose a client" })
    .click();
  await page.getByRole("option", { name: "Nexa" }).click();

  await page
    .getByRole("combobox")
    .filter({ hasText: "Choose debit account" })
    .click();
  await page.getByText("benepay – GBP").click();

  await page
    .getByRole("dialog")
    .getByRole("row")
    .nth(1)
    .getByRole("checkbox")
    .click();

  await page.getByRole("button", { name: "Select a date" }).click();
  await page.getByRole("gridcell", { name: "21" }).click();

  const createBatchBtn = page
    .getByRole("dialog")
    .getByRole("button", { name: "Create Batch" });
  await expect(createBatchBtn).toBeEnabled({ timeout: 10000 });
  await createBatchBtn.click();

  await page.waitForTimeout(7000);

  // =========================
  // RELEASE BATCH
  // =========================

  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "Awaiting Release" }).click();
  await page.getByRole("button", { name: "Apply Filters" }).click();

  await page.waitForTimeout(2000);

  await page.getByRole("cell", { name: "1" }).nth(2).dblclick();
  await page.waitForTimeout(2000);

  await page.getByRole("button", { name: "Release Payment Batch" }).click();
  await page.waitForTimeout(2000);

  await page.getByRole("button", { name: "Close" }).nth(1).click();
});