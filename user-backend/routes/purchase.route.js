// // purchase.route.js
// import express from "express";
// import {
//   createPurchase,
//   getPurchases,
//   getPurchaseById,
//   getPurchasePDF,
// } from "../controllers/purchase.controller.js";
// import { requireAuth } from "../middlewares/auth.middleware.js";
// import { attachVendor } from "../middlewares/vendor.middle.js"

// const router = express.Router();

// // All routes require authentication
// router.use(requireAuth);

// // POST: create a purchase invoice
// router.post("/",attachVendor, createPurchase);

// // GET: list all purchases (with pagination)
// router.get("/", getPurchases);

// // GET: generate purchase pdf (must come before /:id)
// router.get("/pdf/:id", getPurchasePDF);

// // GET: get single purchase by ID
// router.get("/:id", getPurchaseById);

// export default router;



import express from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  getPurchasePDF,
} from "../controllers/purchase.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { attachVendor } from "../middlewares/vendor.middle.js";
import { requirePermission } from "../middlewares/requirePermission.middleware.js";
// import { requirePermission } from "../middlewares/requirePermission.js";

const router = express.Router();

// ✅ All purchase routes required login
router.use(requireAuth);

// ✅ CREATE PURCHASE
router.post(
  "/",
  requirePermission("CreatePurchase"),
  attachVendor,
  createPurchase
);

// ✅ GET PURCHASE LIST
router.get(
  "/",
  requirePermission("ViewPurchaseList"),
  getPurchases
);

// ✅ PURCHASE PDF
router.get(
  "/pdf/:id",
  requirePermission("ViewPurchaseDetail"),
  getPurchasePDF
);

// ✅ GET SINGLE PURCHASE
router.get(
  "/:id",
  requirePermission("ViewPurchaseDetail"),
  getPurchaseById
);

export default router;