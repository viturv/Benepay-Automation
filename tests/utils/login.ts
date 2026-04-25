import { Page } from '@playwright/test';
import { generateOTP } from './otp';
import 'dotenv/config';

export async function login(page: Page) {
  const MFA_SECRET = process.env.MFA_SECRET!;

  await page.waitForTimeout(1000); // Wait for fresh OTP window

  await page.goto('https://uat-payouts.benepay.io/');

  await page.getByPlaceholder('Username').fill('viturv1512@gmail.com');
  await page.getByPlaceholder('Password').fill('Viturv@1234');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('textbox', { name: 'Code *' }).waitFor();

  const otp = generateOTP(MFA_SECRET);

  await page.getByRole('textbox', { name: 'Code *' }).fill(otp);
  await page.getByRole('button', { name: 'Confirm' }).click();
}