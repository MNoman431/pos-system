// import express from "express";
// import {
//   createSale,
//   getSales,
//   getSaleById,
//   getSalePDF,
// } from "../controllers/sales.controller.js";
// import { requireAuth } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // All routes require authentication
// router.use(requireAuth);

// // ================= CREATE SALE =================
// router.post("/create", createSale);

// // ================= GET ALL SALES =================
// router.get("/", getSales);

// // ================= GENERATE SALE PDF - BEFORE :id route =================
// router.get("/pdf/:id", getSalePDF);

// // ================= GET SINGLE SALE =================
// router.get("/:id", getSaleById);

// export default router;



import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  getSalePDF,
} from "../controllers/sales.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/requirePermission.middleware.js";
// import { requirePermission } from "../middlewares/requirePermission.js";

const router = express.Router();

// ✅ Login required for all sale routes
router.use(requireAuth);

// ✅ CREATE SALE (invoice)
router.post(
  "/create",
  requirePermission("CreateSale"),
  createSale
);

// ✅ GET ALL SALES
router.get(
  "/",
  requirePermission("ViewSalesList"),
  getSales
);

// ✅ PDF (before :id)
router.get(
  "/pdf/:id",
  requirePermission("ViewSaleDetail"),
  getSalePDF
);

// ✅ GET SINGLE SALE
router.get(
  "/:id",
  requirePermission("ViewSaleDetail"),
  getSaleById
);

export default router;