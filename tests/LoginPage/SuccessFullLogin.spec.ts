import { test, expect } from '@playwright/test';
import { login } from '../utils/login.js';


test("SuccesfullLogin", async ({ page }) => {

  await login(page);
 await expect(
    page.locator('div').filter({
      hasText: /^EPIC$/
    }).nth(3)
  ).toBeVisible();


});



