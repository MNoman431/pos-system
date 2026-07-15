// import fs from "fs";
// import path from "path";
// // import { generateSalePDF } from "./salePdfGenerator.js";
// import { sendWhatsAppCustomer } from "./whatsAppsender.js";

// export const saleTrigger = async (sale) => {
//   try {
//     const pdfBuffer = await generateSalePDF(sale);

//     const dir = "uploads/invoices";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

//     const filePath = path.join(dir, `sale-${sale.invoiceNo}.pdf`);
//     fs.writeFileSync(filePath, pdfBuffer);

//     const publicUrl = `http://localhost:9999/invoices/sale-${sale.invoiceNo}.pdf`;

//     await sendWhatsAppCustomer(sale, publicUrl);

//     sale.whatsappSent = true;
//     await sale.save();

//     console.log(`WhatsApp sent for sale invoice #${sale.invoiceNo}`);
//   } catch (err) {
//     console.error("Failed to send WhatsApp:", err);
//   }
// };