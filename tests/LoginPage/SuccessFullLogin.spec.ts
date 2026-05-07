import { Page } from '../utils/fixtures';
import { test, expect } from "@playwright/test";
import { login } from '../utils/login';

test("Upload invoice + create batch + release batch", async ({ page }) => {
  await page.goto("https://uat-payouts.benepay.io/");
  await login(page);});