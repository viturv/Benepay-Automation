import { Page } from '@playwright/test';
import { generateOTP } from './otp.js';
import fs from 'fs';
import 'dotenv/config';
import {
  BASE_URL,
  ENVIRONMENT,
  ADMIN_ACTIVE_CREDENTIALS,
  APPROVER_ACTIVE_CREDENTIALS,
  MFA
} from './config.js';

const ADMIN_AUTH_FILE = '.auth/admin-auth.json';
const APPROVER_AUTH_FILE = '.auth/approver-auth.json';

export async function login(page: Page) {
  // --- Admin Login ---
  await page.goto(BASE_URL);

  await page.getByPlaceholder('Username')
    .fill(ADMIN_ACTIVE_CREDENTIALS.username); // From config

  await page.getByPlaceholder('Password')
    .fill(ADMIN_ACTIVE_CREDENTIALS.password); // From config

  await page.getByRole('button', { name: 'Sign in' }).click();

  // if (ENVIRONMENT === 'UAT') {
  //   await page.getByRole('textbox', { name: 'Code *' }).waitFor();

  //   const otp = generateOTP(MFA.admin);
  //   await page.getByRole('textbox', { name: 'Code *' }).fill(otp);

  //   await page.getByRole('button', { name: 'Confirm' }).click();
  // }

  // WAIT FOR DASHBOARD
  await page.waitForURL('**/client-debtors');

  // Wait for admin tokens in sessionStorage
  await page.waitForFunction(() => {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('accessToken') || key === 'clientJwt')) {
        return true;
      }
    }
    return false;
  }, { timeout: 20000 });

  // Extract admin session storage
  const adminSessionData = await page.evaluate(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)!;
      data[key] = sessionStorage.getItem(key)!;
    }
    return data;
  });

  const adminLocalStorageData = await page.evaluate(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      data[key] = localStorage.getItem(key)!;
    }
    return data;
  });

  const adminStorageState = await page.context().storageState();

  const adminOutput = {
    sessionStorage: adminSessionData,
    localStorage: adminLocalStorageData,
    cookies: adminStorageState.cookies,
    origins: adminStorageState.origins,
  };

  fs.writeFileSync(
    ADMIN_AUTH_FILE,
    JSON.stringify(adminOutput, null, 2)
  );

  console.log('\n✅ Admin session captured');


  // --- Approver Login ---

  await page.context().clearCookies();

  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
  await page.goto(BASE_URL);

  await page.getByPlaceholder('Username')
    .fill(APPROVER_ACTIVE_CREDENTIALS.username); // From config

  await page.getByPlaceholder('Password')
    .fill(APPROVER_ACTIVE_CREDENTIALS.password); // From config

  await page.getByRole('button', { name: 'Sign in' }).click();

  // if (ENVIRONMENT === 'UAT') {
  //   await page.getByRole('textbox', { name: 'Code *' }).waitFor();

  //   const otp = generateOTP(MFA.APPROVER);
  //   await page.getByRole('textbox', { name: 'Code *' }).fill(otp);

  //   await page.getByRole('button', { name: 'Confirm' }).click();
  // }

  // WAIT FOR DASHBOARD
  await page.waitForURL('**/client-debtors');

  // Wait for approver tokens in sessionStorage
  await page.waitForFunction(() => {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('accessToken') || key === 'clientJwt')) {
        return true;
      }
    }
    return false;
  }, { timeout: 20000 });

  // Extract approver session storage
  const approverSessionData = await page.evaluate(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)!;
      data[key] = sessionStorage.getItem(key)!;
    }
    return data;
  });

  const approverLocalStorageData = await page.evaluate(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      data[key] = localStorage.getItem(key)!;
    }
    return data;
  });

  const approverStorageState = await page.context().storageState();

  const approverOutput = {
    sessionStorage: approverSessionData,
    localStorage: approverLocalStorageData,
    cookies: approverStorageState.cookies,
    origins: approverStorageState.origins,
  };

  fs.writeFileSync(
    APPROVER_AUTH_FILE,
    JSON.stringify(approverOutput, null, 2)
  );

  console.log('\n✅ Approver session captured');
}