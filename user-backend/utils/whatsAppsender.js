// import twilio from "twilio";
// import fs from "fs";

// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
// export const sendWhatsAppCustomer = async (sale, pdfUrl) => {
//   if (!sale.customer.phone) return;

//   const messageData = {
//     from: "whatsapp:+14155238886",       // Twilio sandbox number
//     to: `whatsapp:+92${sale.customer.phone.substring(1)}`,
//     body: `Hello ${sale.customer.name}, your invoice #${sale.invoiceNo} is ready.`,
//     mediaUrl: [pdfUrl],                   // Add public URL here
//   };

//   try {
//     await client.messages.create(messageData);
//     console.log("WhatsApp sent with PDF!");
//   } catch (err) {
//     console.error("Failed to send WhatsApp:", err);
//   }
// };