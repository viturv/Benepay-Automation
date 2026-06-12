import fs from 'fs';
import ExcelJS from 'exceljs';
import path from 'path';

async function generateExcelReport() {

  const reportPath = './all-results.json';

  if (!fs.existsSync(reportPath)) {

    console.log('results.json file not found');
    return;
  }

  const rawData = fs.readFileSync(reportPath, 'utf-8');

  const report = JSON.parse(rawData);

  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet('Playwright Results');

  worksheet.columns = [
    { header: 'Test Name', key: 'title', width: 50 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Duration (ms)', key: 'duration', width: 20 },
    { header: 'File', key: 'file', width: 60 },
    { header: 'Error Message', key: 'error', width: 100 },
    { header: 'Error Line', key: 'line', width: 15 },
    { header: 'Error Column', key: 'column', width: 15 },
  ];

  function processSuites(suites) {

    for (const suite of suites) {

      if (suite.specs) {

        for (const spec of suite.specs) {

          for (const test of spec.tests) {

            const result = test.results?.[0];

            const error =
              result?.errors?.[0] ||
              result?.error ||
              {};

            worksheet.addRow({

              title: spec.title,

              status: result?.status || 'unknown',

              duration: result?.duration || 0,

              file:
                error?.location?.file ||
                spec.file ||
                '',

              error:
                error?.message ||
                '',

              line:
                error?.location?.line ||
                '',

              column:
                error?.location?.column ||
                '',
            });

          }
        }
      }

      if (suite.suites) {
        processSuites(suite.suites);
      }
    }
  }

  for (const singleReport of report) {

    if (singleReport.suites) {

      processSuites(singleReport.suites);
    }
  }

  // HEADER STYLING
  worksheet.getRow(1).font = {
    bold: true
  };

  // AUTO FILTER
  worksheet.autoFilter = {
    from: 'A1',
    to: 'G1',
  };

  const outputFolder = './test-results';
  const outputFile = path.join(outputFolder, 'Playwright-Test-Report.xlsx');

  // Check if folder exists, if not then create it
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  await workbook.xlsx.writeFile(outputFile);

  console.log(
    '\nExcel Report Generated Successfully\n'
  );
}

generateExcelReport();