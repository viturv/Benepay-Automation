import { test } from '../utils/approverFixture.js';
import { approvePendingBulkPayment } from '../utils/approvalActions.js';

test('approve bulk payment', async ({ page }) => {
  test.setTimeout(90_000);

  await approvePendingBulkPayment(page);
});