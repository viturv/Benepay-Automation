import { test, expect } from '../utils/adminFixture.js';
import { BASE_URL } from '../utils/config.js';

test('test', async ({ page }) => {

  await page.goto(BASE_URL + '/client-debtors');
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('textbox', { name: 'Client Name *' }).click();
  await page.getByRole('textbox', { name: 'Client Name *' }).fill('');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Please fix the following').click();

  await page.waitForTimeout(5000);
});