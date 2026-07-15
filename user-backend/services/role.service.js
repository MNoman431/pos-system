import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import { HttpError } from "../utils/httpError.js";

/* Create Role */
export const createRoleService = async (data) => {
  const { roleName, description, roleMap } = data;
  if (!roleName) throw new HttpError(400, "roleName required");

  const role = await Role.create({ roleName, description, roleMap: roleMap || {} });
  return role;
};

/* Get All Roles */
export const getRolesService = async () => {
  return Role.find().sort({ createdAt: -1 });
};

/* Update Role */
export const updateRoleService = async (id, data) => {
  const { roleName, description, roleMap } = data;

  const role = await Role.findById(id);
  if (!role) throw new HttpError(404, "Role not found");

  // ✅ safe updates (NO overwrite bugs)
  if (typeof roleName === "string") role.roleName = roleName;
  if (typeof description === "string") role.description = description;
  if (roleMap && typeof roleMap === "object") role.roleMap = roleMap;

  const updated = await role.save();

  return updated;
};
/* Assign Role to User */
export const assignRoleService = async (userId, roleId) => {

  if (!userId || !roleId) throw new HttpError(400, "userId and roleId are required");

  const role = await Role.findById(roleId);
  if (!role) throw new HttpError(404, "Role not found");

  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, "User not found");

  user.roleId = roleId;
  user.status = "active";
  await user.save();

  return user;
};




export const deleteRoleService = async (roleId) => {
  return await Role.findByIdAndDelete(roleId);
};




export const getRoleByIdService = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw new HttpError(404, "Role not found");
  return role;
};
