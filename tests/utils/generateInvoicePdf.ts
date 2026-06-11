// utils/generateInvoicePdf.ts

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateInvoicePdf() {


  const invoicesDir = path.join(process.cwd(), 'invoices');

    // create folder if not exists
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  // =========================
  // DELETE OLD PDF FILES
  // =========================

const existingFiles = fs.readdirSync(invoicesDir);

for (const file of existingFiles) {

  if (file.endsWith('.pdf')) {

    const oldFilePath = path.join(invoicesDir, file);

    try {

      fs.unlinkSync(oldFilePath);

      console.log(`Deleted old PDF: ${file}`);

    } catch (error: any) {

      // Ignore locked file errors
      if (error.code === 'EBUSY') {

        console.log(`Skipped locked file: ${file}`);

      } else {

        throw error;
      }
    }
  }
}

  // =========================
  // CREATE NEW PDF
  // =========================

  const invoiceNumber = `INV-${Date.now()}`;

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  const filePath = path.join(
    invoicesDir,
    `${invoiceNumber}.pdf`
  );

  const doc = new PDFDocument({
    margin: 40,
  });

  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // ===== HEADER =====

  doc
    .fontSize(24)
    .text('INVOICE', {
      align: 'center',
    });

  doc.moveDown(2);

  // ===== INVOICE INFORMATION =====

  doc
    .fontSize(18)
    .text('Invoice Information');

  doc.moveDown();

  doc.fontSize(12);

  doc.text(`Invoice Number: ${invoiceNumber}`);
  doc.text(`Currency: GBP - Pound Sterling`);
  doc.text(`Invoice Date: 28/05/2026`);
  doc.text(`Due Date: 26/06/2026`);
  doc.text(`Invoice Type: Credit Transfers`);

  doc.moveDown();

  doc.text(`Client: GreenLife Hospitals`);

  doc.moveDown();

  doc.text(`Supplier: HealthEquip Solutions Ltd`);


 
  // doc.moveDown(2);

  // doc.text(`Tax Type: ZERORATEDINPUT`);
  // doc.text(`Tax Name: Zero Rated Expenses`);
  // doc.text(`Tax Rate %: 0`);
  // doc.text(`Tax Amount (£): 0.00`);

  // doc.moveDown();

  // doc.text(`GL Code: 310 - Cost of Goods Sold`);

  // doc.moveDown(2);


  // ===== LINE ITEMS TABLE =====

doc.moveDown(2);

doc.fontSize(18).text('Line Items');

doc.moveDown();

const tableTop = doc.y;

const itemX = 50;
const qtyX = 300;
const priceX = 380;
const totalX = 480;

// Table Header
doc
  .fontSize(12)
  .text('Description', itemX, tableTop)
  .text('Qty', qtyX, tableTop)
  .text('Unit Price', priceX, tableTop)
  .text('Total', totalX, tableTop);

doc.moveDown();

const rowY = tableTop + 25;

// Table Row
doc
  .text('Goods/Services', itemX, rowY)
  .text('2', qtyX, rowY)
  .text('100.00', priceX, rowY)
  .text('200.00', totalX, rowY);

// Divider line
doc
  .moveTo(50, rowY + 25)
  .lineTo(550, rowY + 25)
  .stroke();


  doc.moveDown(4);
  doc
    .fontSize(10)
    .text(
      'This is a system generated invoice for automation testing.',
      {
        align: 'center',
      }
    );

  doc.end();

  await new Promise<void>((resolve) => {
    stream.on('finish', () => resolve());
  });

  console.log('PDF CREATED:', filePath);

  return {
    filePath,
    invoiceNumber,
  };
}