

import { generatePurchasePDF } from "./pdfGenerator.js";
import { generateSalePDF } from "./salePdfGenerator.js";
import { sendMail } from "./mailer.js";

// ===== Purchase Trigger =====
export const purchaseTrigger = async (purchase) => {
  // 1️⃣ Check TRIGGERS_ENABLED from .env
  if (process.env.TRIGGERS_ENABLED !== "true") {
    console.log(`⚠️ Purchase trigger skipped for invoice #${purchase.invoiceNo}`);
    return;
  }

  try {
    // 2️⃣ Generate PDF
    const pdfBuffer = await generatePurchasePDF(purchase);

    // 3️⃣ Send email
    await sendMail({
      to: purchase.vendor.email,
      subject: `Purchase Invoice #${purchase.invoiceNo}`,
      text: "Please find attached your purchase invoice.",
      html: `<p>Dear ${purchase.vendor.name},</p><p>Please find attached your purchase invoice.</p>`,
      attachments: [
        { filename: `invoice-${purchase.invoiceNo}.pdf`, content: pdfBuffer },
      ],
    });

    // 4️⃣ Update DB
    purchase.emailSent = true;
    await purchase.save();

    console.log(`✅ Email sent for purchase invoice #${purchase.invoiceNo}`);
  } catch (err) {
    console.error(`❌ Failed to send purchase email for invoice #${purchase.invoiceNo}:`, err.message);
  }
};

// ===== Sale Trigger =====
export const saleTrigger = async (sale) => {
  // 1️⃣ Check TRIGGERS_ENABLED from .env
  if (process.env.TRIGGERS_ENABLED !== "true") {
    console.log(`⚠️ Sale trigger skipped for invoice #${sale.invoiceNo}`);
    return;
  }

  try {
    // 2️⃣ Generate PDF
    const pdfBuffer = await generateSalePDF(sale);

    // 3️⃣ Send email
    await sendMail({
      to: sale.customer.email || "customer@example.com",
      subject: `Sale Invoice #${sale.invoiceNo}`,
      text: "Please find attached your sale invoice.",
      html: `<p>Dear ${sale.customer.name},</p><p>Please find attached your sale invoice.</p>`,
      attachments: [
        { filename: `sale-${sale.invoiceNo}.pdf`, content: pdfBuffer },
      ],
    });

    // 4️⃣ Update DB
    sale.emailSent = true;
    await sale.save();

    console.log(`✅ Email sent for sale invoice #${sale.invoiceNo}`);
  } catch (err) {
    console.error(`❌ Failed to send sale invoice email for invoice #${sale.invoiceNo}:`, err.message);
  }
};