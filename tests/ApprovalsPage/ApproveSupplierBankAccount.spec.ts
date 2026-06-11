import { test } from '../utils/approverFixture.js';
import { approvePendingSupplierBankAccount } from '../utils/approvalActions.js';

test('approve supplier bank account', async ({ page }) => {
  test.setTimeout(90_000);

  await approvePendingSupplierBankAccount(page);
});