// // utils/notifications.js

// import nodemailer from "nodemailer";
// import twilio from "twilio";

// // ================= Nodemailer setup =================
// const transporter = nodemailer.createTransport({
//   host: "smtp.yourmail.com",       // apna SMTP host
//   port: 587,                        // usually 587
//   secure: false,                     // true for 465, false for other ports
//   auth: {
//     user: "your-email@example.com", // apna email
//     pass: "your-email-password",    // email password / app password
//   },
// });

// // ================= Twilio setup =================
// const accountSid = "TWILIO_ACCOUNT_SID"; // Twilio account SID
// const authToken = "TWILIO_AUTH_TOKEN";   // Twilio auth token
// const client = twilio(accountSid, authToken);

// // ================= Send Email to Vendor =================
// export const sendEmailVendor = async (purchase, pdfBuffer) => {
//   if (!purchase.vendor?.email) return;

//   try {
//     await transporter.sendMail({
//       from: `"Your Company" <your-email@example.com>`,
//       to: purchase.vendor.email,
//       subject: `Purchase Invoice - ${purchase._id}`,
//       text: `Hello ${purchase.vendor.name},\n\nPlease find attached your purchase invoice.`,
//       attachments: [
//         {
//           filename: `purchase-${purchase._id}.pdf`,
//           content: pdfBuffer,
//         },
//       ],
//     });

//     console.log(`Email sent to vendor: ${purchase.vendor.email}`);
//   } catch (err) {
//     console.error("Error sending email to vendor:", err);
//   }
// };

// // ================= Send WhatsApp to Customer =================
// export const sendWhatsAppCustomer = async (sale) => {
//   if (!sale.customer?.phone) return;

//   try {
//     await client.messages.create({
//       from: "whatsapp:+14155238886", // Twilio sandbox number
//       to: `whatsapp:${sale.customer.phone}`,
//       body: `Hello ${sale.customer.name}, your sale invoice #${sale.invoiceNo} is ready.`,
//       mediaUrl: ["https://example.com/invoice.pdf"], // temporary, PDF upload needed for real WhatsApp
//     });

//     console.log(`WhatsApp sent to customer: ${sale.customer.phone}`);
//   } catch (err) {
//     console.error("Error sending WhatsApp to customer:", err);
//   }
// };