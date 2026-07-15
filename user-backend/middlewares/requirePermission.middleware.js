
 import { HttpError } from "../utils/httpError.js";
import Role from "../models/role.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requirePermission = (pageName) =>
  asyncHandler(async (req, res, next) => {
    //  MASTER = FULL ACCESS (No role checks)
    if (req.user.roleId === "master") {
      return next();
    }

    //  Check if normal user has role
    if (!req.user || !req.user.roleId) {
      throw new HttpError(401, "User role not assigned");
    }

    // Fetch role from DB ONLY for normal users
    const role = await Role.findById(req.user.roleId);
    if (!role) throw new HttpError(403, "Role not found");

    const allowed = role.roleMap?.[pageName];

    if (allowed !== true) {
      throw new HttpError(403, "Access Denied");
    }

    next();
  });
``