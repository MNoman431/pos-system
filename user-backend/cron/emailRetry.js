import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import Purchase from "../models/purchase.model.js";
import Sale from "../models/sale.model.js";
import { purchaseTrigger, saleTrigger } from "../utils/triggers.js";

// Run every 5 minutes for testing
cron.schedule("*/40 * * * *", async () => {
  console.log("⏰ Cron job running every 2 minutes to retry pending emails");

  // Check trigger toggle from .env
  if (process.env.TRIGGERS_ENABLED !== "true") {
    console.log("⚠️ Triggers are disabled in .env, skipping email retry.");
    return;
  }

  try {
    // Pending Purchase emails
    const pendingPurchases = await Purchase.find({ emailSent: false });
    console.log(`Pending purchase emails: ${pendingPurchases.length}`);

    for (const purchase of pendingPurchases) {
      await purchaseTrigger(purchase);
    }

    // Pending Sale emails
    const pendingSales = await Sale.find({ emailSent: false });
    console.log(`Pending sale emails: ${pendingSales.length}`);

    for (const sale of pendingSales) {
      await saleTrigger(sale);
    }
  } catch (err) {
    console.error("❌ Error in cron email retry:", err.message);
  }
});