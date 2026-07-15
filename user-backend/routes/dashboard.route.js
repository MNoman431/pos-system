// import express from "express";
// import {
//   getDashboardSummary,
//   getMonthlyAnalytics,
//   getLowStockItems,
//   getReorderAlerts,
//   getFilteredSummary
// } from "../controllers/dashboard.controller.js";

// const router = express.Router();

// // Summary cards (sales, purchase, profit)
// router.get("/summary", getDashboardSummary);

// // All charts monthly/yearly
// router.get("/monthly-analytics", getMonthlyAnalytics);

// // Low Stock Items
// router.get("/low-stock", getLowStockItems);

// // Reorder Alerts
// router.get("/reorder-alerts", getReorderAlerts);
// router.get("/summary-filtered", getFilteredSummary);

// export default router;



import express from "express";

import {
  getDashboardSummary,
  getMonthlyAnalytics,
  getLowStockItems,
  getReorderAlerts,
  getFilteredSummary
} from "../controllers/dashboard.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/requirePermission.middleware.js";
// import { requirePermission } from "../middlewares/requirePermission.js";

const router = express.Router();

// ✅ All dashboard routes require login
router.use(requireAuth);

//  Summary (Cards)
router.get(
  "/summary",
  requirePermission("ViewDashboard"),
  getDashboardSummary
);

// ✅ Monthly Analytics
router.get(
  "/monthly-analytics",
  requirePermission("ViewAnalytics"),
  getMonthlyAnalytics
);

// ✅ Low Stock Items
router.get(
  "/low-stock",
  requirePermission("ViewLowStock"),
  getLowStockItems
);

// ✅ Reorder Alerts
router.get(
  "/reorder-alerts",
  requirePermission("ViewReorderAlerts"),
  getReorderAlerts
);

// ✅ Filtered Summary (Profit)
router.get(
  "/summary-filtered",
  requirePermission("ViewProfitSummary"),
  getFilteredSummary
);

export default router;