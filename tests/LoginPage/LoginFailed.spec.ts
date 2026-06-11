import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { BASE_URL } from '../utils/config.js';

test('test', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('anurag@benepay.io');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').press('CapsLock');
  await page.getByPlaceholder('Password').fill('C');
  await page.getByPlaceholder('Password').press('CapsLock');
  await page.getByPlaceholder('Password').fill('Collect@1234');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('Incorrect username or').click();
});