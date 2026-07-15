



import express from "express";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deactivateVendor,
} from "../controllers/vendor.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/requirePermission.middleware.js";
// import { requirePermission } from "../middlewares/requirePermission.js";

const router = express.Router();

// ✅ All vendor routes require login
router.use(requireAuth);

// ✅ CREATE vendor
router.post(
  "/",
  requirePermission("AddVendor"),
  createVendor
);

// ✅ GET vendors list
router.get(
  "/",
  requirePermission("ViewVendors"),
  getVendors
);

// ✅ GET vendor by ID
router.get(
  "/:id",
  requirePermission("ViewVendors"),
  getVendorById
);

// ✅ UPDATE vendor
router.put(
  "/:id",
  requirePermission("EditVendor"),
  updateVendor
);

// ✅ SOFT DELETE / deactivate vendor
router.patch(
  "/:id/deactivate",
  requirePermission("DeleteVendor"),
  deactivateVendor
);

export default router;