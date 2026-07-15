import { Router } from "express";
import {
  login,
  logout,
  register,
  forgetPassword,
  verifyOtp,
  resetPassword,
  me,
  updateProfile,
  getUnassignedUsers,
  getAllUsers,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { requirePermission } from "../middlewares/requirePermission.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/unassigned", requireAuth, getUnassignedUsers);

router.post("/logout", logout);
// new
router.get("/me", requireAuth,me);
router.put("/me", requireAuth, upload.single("profileImage"), updateProfile);


router.get("/all", 
  requireAuth, 
  requirePermission("AssignRole"),  // ✅ Master bypass + Admin check
  getAllUsers
);

router.post("/forget-password", forgetPassword); 
router.post("/verify-otp", verifyOtp);           
router.post("/reset-password", resetPassword);

export default router;
