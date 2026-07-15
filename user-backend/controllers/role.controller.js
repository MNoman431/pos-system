import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createRoleService,
  getRolesService,
  updateRoleService,
  assignRoleService,
  deleteRoleService,
  getRoleByIdService,
} from "../services/role.service.js";

/* ================= CREATE ROLE ================= */
export const createRole = asyncHandler(async (req, res) => {
  const role = await createRoleService(req.body);
  res.status(201).json({ success: true, role });
});

/* ================= GET ALL ROLES ================= */
export const getRoles = asyncHandler(async (_req, res) => {
  const roles = await getRolesService();
  res.json({ success: true, roles });
});

/* =================  GET ROLE BY ID ================= */
export const getRoleById = asyncHandler(async (req, res) => {
  const role = await getRoleByIdService(req.params.id);
  res.json({ success: true, role });
});

/* ================= UPDATE ROLE ================= */
export const updateRole = asyncHandler(async (req, res) => {
  const role = await updateRoleService(req.params.id, req.body);
  res.json({ success: true, role });
});

/* ================= ASSIGN ROLE ================= */
export const assignRole = asyncHandler(async (req, res) => {
  const user = await assignRoleService(req.body.userId, req.body.roleId);
  res.json({ success: true, message: "Role assigned", user });
});

/* ================= DELETE ROLE ================= */
export const deleteRole = asyncHandler(async (req, res) => {
  await deleteRoleService(req.params.id);
  res.json({ success: true, message: "Role deleted successfully" });
});