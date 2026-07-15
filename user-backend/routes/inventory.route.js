


// import { Router } from 'express';

// import { upload } from '../middlewares/upload.middleware.js';
// import {
//   createItem,
//   getItems,
//   getItemById,
//   updateItem,
//   deleteItem,
//   checkItemCode,
//   getItemByCode,
//   // searchItemByCode,
// } from '../controllers/inventory.controller.js';

// const router = Router();

// // image field name must be "image"
// router.post('/items', upload.single('image'), createItem);
// router.get('/items', getItems);
// router.get('/items/check-code', checkItemCode);
// router.get("/items/by-code",getItemByCode);
// router.get('/items/:id', getItemById);
// router.put('/items/:id', upload.single('image'), updateItem);
// router.delete('/items/:id', deleteItem);


// export default router;



import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";

import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  checkItemCode,
  getItemByCode,
} from "../controllers/inventory.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/requirePermission.middleware.js";


const router = Router();

// ✅ All inventory routes require login
router.use(requireAuth);

// ✅ CREATE ITEM
router.post(
  "/items",
  requirePermission("AddInventory"),
  upload.single("image"),
  createItem
);

// ✅ LIST ITEMS
router.get(
  "/items",
  requirePermission("ViewInventory"),
  getItems
);

// ✅ CHECK ITEM CODE
router.get(
  "/items/check-code",
  requirePermission("ViewInventory"),
  checkItemCode
);

// ✅ GET ITEM BY CODE
router.get(
  "/items/by-code",
  requirePermission("ViewInventory"),
  getItemByCode
);

// ✅ GET ONE ITEM
router.get(
  "/items/:id",
  requirePermission("ViewInventory"),
  getItemById
);

// ✅ UPDATE ITEM
router.put(
  "/items/:id",
  requirePermission("EditInventory"),
  upload.single("image"),
  updateItem
);

// ✅ DELETE ITEM
router.delete(
  "/items/:id",
  requirePermission("DeleteInventory"),
  deleteItem
);

export default router;