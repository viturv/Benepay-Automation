import { test } from '../utils/approverFixture.js';
import { approvePendingSupplier } from '../utils/approvalActions.js';

test('approve supplier', async ({ page }) => {
  test.setTimeout(90_000);

  await approvePendingSupplier(page);
});