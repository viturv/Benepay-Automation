import { chromium } from '@playwright/test';

let browserContext = null;

export async function getPersistentContext() {
  if (!browserContext) {
    browserContext = await chromium.launchPersistentContext(
      'C:\\Users\\vitur\\AppData\\Local\\Google\\Chrome\\User Data',
      {
        channel: 'chrome',
        headless: false,
        args: ['--profile-directory=Default'],
      }
    );
  }
  return browserContext;
}