// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { HttpError } from "../utils/httpError.js";
// import { validateRegister, validateLogin } from "../utils/validators.js";
// import { createToken } from "../utils/jwt.js";
// import { COOKIE_NAME, cookieOptions } from "../utils/cookies.js";
// import { sendOTPEmail } from "../utils/mailer.js";
// import { validatePasswordPolicy } from "../utils/passwordPolicy.js";
// import { uploadBufferToSupabase } from "../utils/supabase.js";
// import Role from "../models/role.model.js";

// // helpers
// const generateOTP = () =>
//   Math.floor(100000 + Math.random() * 900000).toString();
// const normalizeEmail = (email) => String(email).toLowerCase().trim();

// const buildSafeUser = (user) => ({
//   _id: user._id,
//   firstName: user.firstName,
//   lastName: user.lastName,
//   email: user.email,
//   age: user.age ?? null,
//   gender: user.gender,
//   profileImage: user.profileImage,
//   roleId: user.roleId, // ✅ IMPORTANT FIX
//   status: user.status, // optional but useful
// });

// // ---------------- REGISTER ----------------
// export const register = asyncHandler(async (req, res) => {
//   const { firstName, lastName, age, email, password, confirmPassword, gender } =
//     req.body;

//   validateRegister?.({
//     firstName,
//     lastName,
//     age,
//     email,
//     password,
//     confirmPassword,
//     gender,
//   });

//   if (!password) throw new HttpError(400, "Password required");
//   const policyErrors = validatePasswordPolicy(password);
//   if (policyErrors.length) throw new HttpError(400, policyErrors[0]);
//   if (password !== confirmPassword)
//     throw new HttpError(400, "Passwords do not match");

//   const normalizedEmail = normalizeEmail(email);
//   if (await User.exists({ email: normalizedEmail }))
//     throw new HttpError(409, "Email already exists");

//   const passwordHash = await bcrypt.hash(password, 10);

//   const user = await User.create({
//     firstName,
//     lastName,
//     age,
//     email: normalizedEmail,
//     passwordHash,
//     gender,
//   });

//   res
//     .status(201)
//     .json({ message: "User registered", user: buildSafeUser(user) });
// });

// // ---------------- LOGIN (FULL MASTER FIX ) ----------------
// export const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   validateLogin?.({ email, password });

//   if (!email || !password)
//     throw new HttpError(400, "Email and password required");

//   const user = await User.findOne({ email: normalizeEmail(email) });
//   if (!user || !(await bcrypt.compare(password, user.passwordHash)))
//     throw new HttpError(401, "Invalid email or password");

//   //  MASTER USER BYPASS HERE
//   if (user.roleId === "master") {
//     res.cookie(COOKIE_NAME, createToken(user), cookieOptions);

//     return res.json({
//       message: "Logged in",
//       user: buildSafeUser(user),
//       role: {
//         roleName: "Master",
//         roleMap: "all",
//       },
//     });
//   }

//   //  Normal user (fetch role from DB)
//   const role = await Role.findById(user.roleId);

//   // Set JWT cookie
//   res.cookie(COOKIE_NAME, createToken(user), cookieOptions);

//   return res.json({
//     message: "Logged in",
//     user: buildSafeUser(user),
//     role,
//   });
// });

// // ---------------- LOGOUT ----------------
// export const logout = asyncHandler(async (_req, res) => {
//   res.clearCookie(COOKIE_NAME, cookieOptions);
//   res.json({ message: "Logged out" });
// });

// // ---------------- FORGET PASSWORD ----------------
// export const forgetPassword = asyncHandler(async (req, res) => {
//   const email = normalizeEmail(req.body.email);
//   if (!email) throw new HttpError(400, "Email is required");

//   const user = await User.findOne({ email });
//   if (!user) throw new HttpError(404, "Email not registered");

//   const otp = generateOTP();
//   user.resetOTP = await bcrypt.hash(otp, 10);
//   user.resetOTPExpires = Date.now() + 10 * 60 * 1000;
//   await user.save();

//   try {
//     await sendOTPEmail({ to: email, otp, minutes: 10 });
//   } catch {
//     user.resetOTP = undefined;
//     user.resetOTPExpires = undefined;
//     await user.save();
//     throw new HttpError(502, "Failed to send OTP");
//   }

//   if (process.env.NODE_ENV !== "production")
//     console.log(`[DEV] OTP for ${email}: ${otp}`);

//   res.json({ message: "OTP sent to email" });
// });

// // ---------------- VERIFY OTP ----------------
// export const verifyOtp = asyncHandler(async (req, res) => {
//   const { email, otp } = req.body;
//   if (!email || !otp) throw new HttpError(400, "Email and OTP required");

//   const user = await User.findOne({ email: normalizeEmail(email) });

//   if (!user || !user.resetOTP || !user.resetOTPExpires)
//     throw new HttpError(400, "Invalid or expired OTP");

//   if (user.resetOTPExpires < Date.now()) {
//     user.resetOTP = undefined;
//     user.resetOTPExpires = undefined;
//     await user.save();
//     throw new HttpError(400, "OTP expired");
//   }

//   if (!(await bcrypt.compare(String(otp), user.resetOTP)))
//     throw new HttpError(400, "Invalid OTP");

//   user.resetOTP = undefined;
//   user.resetOTPExpires = undefined;
//   await user.save();

//   const resetToken = jwt.sign(
//     { sub: user._id.toString(), email: user.email },
//     process.env.RESET_TOKEN_SECRET || "dev-reset-secret",
//     { expiresIn: process.env.RESET_TOKEN_EXPIRES || "10m" }
//   );

//   res.json({ message: "OTP verified", resetToken });
// });

// // ---------------- RESET PASSWORD ----------------
// export const resetPassword = asyncHandler(async (req, res) => {
//   const { resetToken, newPassword, confirmPassword } = req.body;

//   if (!resetToken || !newPassword || !confirmPassword)
//     throw new HttpError(400, "All fields required");

//   const policyErrors = validatePasswordPolicy(newPassword);
//   if (policyErrors.length) throw new HttpError(400, policyErrors[0]);

//   if (newPassword !== confirmPassword)
//     throw new HttpError(400, "Passwords do not match");

//   let payload;
//   try {
//     payload = jwt.verify(
//       resetToken,
//       process.env.RESET_TOKEN_SECRET || "dev-reset-secret"
//     );
//   } catch {
//     throw new HttpError(400, "Invalid or expired token");
//   }

//   const user = await User.findById(payload.sub);
//   if (!user) throw new HttpError(404, "User not found");

//   user.passwordHash = await bcrypt.hash(newPassword, 10);
//   user.resetOTP = undefined;
//   user.resetOTPExpires = undefined;
//   await user.save();

//   res.json({ message: "Password reset successfully" });
// });

// // ---------------- ME (LOAD USER) MASTER FIX ----------------
// // export const me = asyncHandler(async (req, res) => {
// //   const user = await User.findById(req.user._id).select("-passwordHash");

// //   if (!user) throw new HttpError(404, "User not found");

// //   // MASTER USER BYPASS HERE ALSO
// //   if (user.roleId === "master") {
// //     return res.json({
// //       user,
// //       role: {
// //         roleName: "Master",
// //         roleMap: "all",
// //       },
// //     });
// //   }

// //   const role = await Role.findById(user.roleId);

// //   return res.json({ user, role });
// // });

// // ✅ /auth/me (FINAL FIXED VERSION)
// export const me = asyncHandler(async (req, res) => {
//   const userDoc = await User.findById(req.user._id).select("-passwordHash");
//   if (!userDoc) throw new HttpError(404, "User not found");

//   const user = buildSafeUser(userDoc); // ✅ Now consistent with login format

//   // ✅ MASTER USER ALWAYS RETURNS roleMap: "all"
//   if (user.roleId === "master") {
//     return res.json({
//       user,
//       role: {
//         roleName: "Master",
//         roleMap: "all",
//       },
//     });
//   }

//   // ✅ NORMAL USER ROLE
//   const role = await Role.findById(user.roleId);
//   return res.json({ user, role });
// });

// // ---------------- UPDATE PROFILE ----------------
// export const updateProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   ["firstName", "lastName", "age", "gender"].forEach((f) => {
//     if (req.body[f]) user[f] = req.body[f];
//   });

//   if (req.file) {
//     const { publicUrl } = await uploadBufferToSupabase({
//       bucket: process.env.SUPABASE_BUCKET,
//       folder: req.user._id.toString(),
//       filename: req.file.originalname,
//       buffer: req.file.buffer,
//       contentType: req.file.mimetype,
//     });
//     user.profileImage = publicUrl;
//   }

//   await user.save();
//   res.json({
//     message: "Profile updated successfully",
//     user: buildSafeUser(user),
//   });
// });

// // ---------------- UNASSIGNED USERS ----------------
// export const getUnassignedUsers = asyncHandler(async (_req, res) => {
//   const users = await User.find({ roleId: null, status: "pending" }).select(
//     "_id firstName lastName email"
//   );
//   res.json({ success: true, users });
// });

// // ----------------  GET ALL USERS (MASTER ONLY) - FIXED VERSION ----------------
// export const getAllUsers = asyncHandler(async (req, res) => {
//   // Optional: Extra safety check
//   if (
//     req.user?.roleId !== "master" &&
//     req.user?.role?.roleMap?.AssignRole !== true
//   ) {
//     throw new HttpError(
//       403,
//       "Forbidden: Master or AssignRole permission required"
//     );
//   }

//   // Fetch ALL users WITHOUT populate (to avoid "master" cast error)
//   const users = await User.find()
//     .select("-passwordHash -resetOTP -resetOTPExpires")
//     .sort({ createdAt: -1 });

//   // Manually add role details (handle "master" string safely)
//   const usersWithRoles = await Promise.all(
//     users.map(async (user) => {
//       const userObj = user.toObject();

//       //  Handle Master specially
//       if (userObj.roleId === "master") {
//         userObj.role = {
//           _id: "master",
//           roleName: "Master",
//           roleMap: "all",
//         };
//       }
//       //  Handle normal roles (ObjectId)
//       else if (userObj.roleId) {
//         const role = await Role.findById(userObj.roleId).select(
//           "roleName roleMap"
//         );
//         userObj.role = role || null;
//       }
//       // No role
//       else {
//         userObj.role = null;
//       }

//       return userObj;
//     })
//   );

//   res.json({
//     success: true,
//     count: usersWithRoles.length,
//     users: usersWithRoles,
//   });
// });



// src/controllers/user.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { validateRegister, validateLogin } from "../utils/validators.js";
import { COOKIE_NAME, cookieOptions } from "../utils/cookies.js";

// Import ALL services
import {
  registerUser,
  loginUser,
  logoutUser,
  initiatePasswordReset,
  verifyUserOTP,
  executePasswordReset,
  getCurrentUser,
  updateUserProfile,
  fetchUnassignedUsers,
  fetchAllUsersWithRoles,
} from "../services/user.service.js";

// ---------------- REGISTER ----------------
export const register = asyncHandler(async (req, res) => {
  validateRegister?.(req.body);
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

// ---------------- LOGIN ----------------
export const login = asyncHandler(async (req, res) => {
  validateLogin?.(req.body);
  const result = await loginUser(req.body);
  
  // Cookie set (HTTP concern - controller mein hi rahega)
  res.cookie(COOKIE_NAME, result.token, cookieOptions);
  
  // Token response se hata dein (security best practice)
  const { token, ...response } = result;
  res.json(response);
});

// ---------------- LOGOUT ----------------
export const logout = asyncHandler(async (_req, res) => {
  const result = await logoutUser();
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.json(result);
});

// ---------------- FORGET PASSWORD ----------------
export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new HttpError(400, "Email is required");
  
  const result = await initiatePasswordReset(email);
  res.json(result);
});

// ---------------- VERIFY OTP ----------------
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new HttpError(400, "Email and OTP required");
  
  const result = await verifyUserOTP({ email, otp });
  res.json(result);
});

// ---------------- RESET PASSWORD ----------------
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;
  const result = await executePasswordReset({
    resetToken,
    newPassword,
    confirmPassword,
  });
  res.json(result);
});

// ---------------- ME (LOAD USER) ----------------
export const me = asyncHandler(async (req, res) => {
  const result = await getCurrentUser(req.user._id);
  res.json(result);
});

// ---------------- UPDATE PROFILE ----------------
export const updateProfile = asyncHandler(async (req, res) => {
  const result = await updateUserProfile(
    req.user._id,
    req.body,
    req.file // from upload middleware
  );
  res.json(result);
});

// ---------------- UNASSIGNED USERS ----------------
export const getUnassignedUsers = asyncHandler(async (_req, res) => {
  const result = await fetchUnassignedUsers();
  res.json(result);
});

// ---------------- GET ALL USERS ----------------
export const getAllUsers = asyncHandler(async (req, res) => {
  // Permission check (yeh bhi controller mein - HTTP layer concern)
  if (
    req.user?.roleId !== "master" &&
    req.user?.role?.roleMap?.AssignRole !== true
  ) {
    throw new HttpError(
      403,
      "Forbidden: Master or AssignRole permission required"
    );
  }

  const result = await fetchAllUsersWithRoles();
  res.json(result);
});