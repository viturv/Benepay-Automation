import { chromium } from '@playwright/test';
import * as readline from 'readline';
import * as fs from 'fs';

const AUTH_FILE = 'auth.json';
const TARGET_URL = 'https://uat-payouts.benepay.io/';

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(TARGET_URL);

  console.log('\n🌐 Browser opened. Please complete login including MFA.');
  console.log('   Wait until the dashboard fully loads, then press ENTER.\n');

  const rl = readline.createInterface({ input: process.stdin });
  await new Promise<void>((resolve) => {
    rl.once('line', () => {
      rl.close();
      resolve();
    });
  });

  // Capture sessionStorage (Playwright storageState misses this)
  const sessionData = await page.evaluate(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)!;
      data[key] = sessionStorage.getItem(key)!;
    }
    return data;
  });

  // Also capture localStorage and cookies via storageState
  const storageState = await context.storageState();

  const output = {
    sessionStorage: sessionData,
    cookies: storageState.cookies,
    origins: storageState.origins,
  };

  fs.writeFileSync(AUTH_FILE, JSON.stringify(output, null, 2));

  const keyCount = Object.keys(sessionData).length;
  if (keyCount === 0) {
    console.warn('\n⚠️  sessionStorage is empty — are you sure login completed?\n');
  } else {
    console.log(`\n✅ Session saved to ${AUTH_FILE}`);
    console.log(`   sessionStorage keys captured: ${keyCount}`);
    console.log(`   Keys: ${Object.keys(sessionData).join(', ')}\n`);
  }

  await browser.close();
})();