import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ 
    channel: 'chrome',
    headless: false 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://uat-payouts.benepay.io/');
  
  console.log('Please login manually in the browser...');
  console.log('After logging in, come back here and press ENTER to save session.');
  
  // ✅ Wait for you to press ENTER instead of a timer
  await new Promise<void>((resolve) => {
    process.stdin.once('data', () => resolve());
  });
  
  await context.storageState({ path: 'auth.json' });
  console.log('✅ Session saved to auth.json!');
  
  await browser.close();
})();