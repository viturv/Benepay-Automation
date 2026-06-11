import { execSync } from 'child_process';
import fs from 'fs';
import chalk from 'chalk';

const tests = [
    // =========================================================
    // LOGIN PAGE    (run this file when you wants to refresh the stored session )
    // =========================================================

    // 'tests/LoginPage/SuccessFullLogin.spec.ts',

    // =========================================================
    // GENERAL
    // =========================================================

    // 'tests/General/SmokeFlowTest-UAT.spec.ts',

    // =========================================================
    // INVOICES PAGE → CREATE INVOICE
    // =========================================================

    // 'tests/InvoicesPage/CreateInvoice/CreateInvoice.spec.ts',
    // 'tests/InvoicesPage/CreateInvoice/NoGlCodeSelected.spec.ts',
    // 'tests/InvoicesPage/CreateInvoice/NoInvoiceNumber.spec.ts',
    // 'tests/InvoicesPage/CreateInvoice/InvoiceWithNoLineIteams.spec.ts',


    // =========================================================
    // SUPPLIER PAGE
    // =========================================================

    // 'tests/SupplierPage/AddNewSupplier.spec.ts',
    // 'tests/SupplierPage/EditSupplierDetails.spec.ts',
    // 'tests/SupplierPage/SupplierNoLegalName.spec.ts',



    // =========================================================
    // INVOICES PAGE → UPLOAD INVOICE
    // =========================================================

    // 'tests/InvoicesPage/UploadInvoice/CreateSupplierFromUploadInvoiceScreen.spec.ts',
    // 'tests/InvoicesPage/UploadInvoice/NoLineItems.spec.ts',
    // 'tests/InvoicesPage/UploadInvoice/NoSupplierSelected.spec.ts',
    // 'tests/InvoicesPage/UploadInvoice/SaveInvoiceInDraft.spec.ts',
    // 'tests/InvoicesPage/UploadInvoice/SubmitInvoiceFromDraft.spec.ts',
    // 'tests/InvoicesPage/UploadInvoice/UploadInvoice.spec.ts',

      // =========================================================
      // PAYMENTS PAGE → BULK PAYMENTS → INTERNATIONAL
      // =========================================================

    // 'tests/PaymentsPage/BulkPayments/International/IsoBulkFile.spec.ts',
    // 'tests/PaymentsPage/BulkPayments/International/IsoSubmitInDraft.spec.ts',
    // 'tests/PaymentsPage/BulkPayments/International/IsoSubmitFromDraft.spec.ts',
    // 'tests/PaymentsPage/BulkPayments/International/ValidationFailed.spec.ts',

    // =========================================================
    // PAYMENTS PAGE → PAYMENT BATCHES
    // =========================================================

    // 'tests/PaymentsPage/PaymentsBatches/CreateBatch.spec.ts',
    // 'tests/PaymentsPage/PaymentsBatches/ReleaseBatchOlderDate.spec.ts',    neeed to confirm if we having "Awaiting Release" status for batch.


    // =========================================================
    // APPROVALS PAGE
    // =========================================================

    // 'tests/ApprovalsPage/ApproveBankAccount.spec.ts',
    // 'tests/ApprovalsPage/ApproveBulkPayment.spec.ts',
    // 'tests/ApprovalsPage/ApproveInvoice.spec.ts',
    // 'tests/ApprovalsPage/ApproveSupplier.spec.ts',
    // 'tests/ApprovalsPage/ApproveSupplierBankAccount.spec.ts',


    // =========================================================
    // CLIENT PAGE
    // =========================================================

    // 'tests/ClientPage/ClientNoBankDetails.spec.ts',
    // 'tests/ClientPage/ClientNoLegalName.spec.ts',
    // 'tests/ClientPage/EditClientDetails.spec.ts',
    // 'tests/ClientPage/ResetClientDetails.spec.ts',


];

console.log('\n========================================================');
console.log('STARTING PLAYWRIGHT SEQUENTIAL TEST EXECUTION');
console.log('========================================================\n');

// DELETE OLD RESULTS IF EXIST
if (fs.existsSync('all-results.json')) {
    fs.unlinkSync('all-results.json');
}

const combinedResults = [];

for (const [index, testFile] of tests.entries()) {

    console.log('\n========================================================');
    console.log(`RUNNING TEST ${index + 1} OF ${tests.length}`);
    console.log(`TEST FILE: ${testFile}`);
    console.log('========================================================\n');
    if (fs.existsSync('test-results/results.json')) {
        fs.unlinkSync('test-results/results.json');
    }

    try {

        execSync(
            `npx playwright test "${testFile}" --workers=1 --headed`,
            {
                stdio: 'inherit',
                shell: true
            }
        );

        console.log(
            chalk.green(
                `✔ PASSED (${index + 1}/${tests.length})`
            )
        );

    } catch (error) {

        console.log(
            chalk.red(
                `✖ FAILED (${index + 1}/${tests.length})`
            )
        );
    }

    // SAVE TEMP RESULT
    try {

        const raw = fs.readFileSync(
            'test-results/results.json',
            'utf-8'
        );

        const parsed = JSON.parse(raw);

        combinedResults.push(parsed);

    } catch (e) {

        console.log(
            chalk.red(
                `Could not parse results for ${testFile}`
            )
        );
    }
}

// SAVE COMBINED RESULTS
fs.writeFileSync(
    'all-results.json',
    JSON.stringify(combinedResults, null, 2)
);

console.log('\n========================================================');
console.log('ALL TESTS EXECUTED');
console.log('========================================================\n');

const passedCount = combinedResults.reduce(
    (total, result) =>
        total + (result.stats?.expected || 0),
    0
);

const failedCount = combinedResults.reduce(
    (total, result) =>
        total + (result.stats?.unexpected || 0),
    0
);

console.log('\n========================================================');

console.log(
    chalk.green(`✔ PASSED: ${passedCount}`)
);

console.log(
    chalk.red(`✖ FAILED: ${failedCount}`)
);

console.log('========================================================\n');


console.log('\n========================================================');
console.log('GENERATING EXCEL REPORT');
console.log('========================================================\n');

execSync(`node generate-excel-report.js`, {
    stdio: 'inherit'
});