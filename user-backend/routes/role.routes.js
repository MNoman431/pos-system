import express from "express";
import {
  createRole,
  getRoles,
  getRoleById,   
  updateRole,
  assignRole,
  deleteRole,
} from "../controllers/role.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/requirePermission.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", requirePermission("ManageRoles"), createRole);
router.get("/", requirePermission("ManageRoles"), getRoles);


router.get("/:id", requirePermission("ManageRoles"), getRoleById);

router.put("/:id", requirePermission("ManageRoles"), updateRole);
router.delete("/:id", requirePermission("ManageRoles"), deleteRole);
router.post("/assign", requirePermission("AssignRole"), assignRole);

export default router;