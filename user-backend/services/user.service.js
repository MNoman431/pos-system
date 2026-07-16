import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { HttpError } from "../utils/httpError.js";
import { validatePasswordPolicy } from "../utils/passwordPolicy.js";
import { sendOTPEmail } from "../utils/mailer.js";
import { uploadBufferToSupabase } from "../utils/supabase.js";
import { createToken } from "../utils/jwt.js";
// ===== HELPERS (Pure Functions) =====
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const normalizeEmail = (email) => String(email).toLowerCase().trim();

const buildSafeUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  age: user.age ?? null,
  gender: user.gender,
  profileImage: user.profileImage,
  roleId: user.roleId,
  status: user.status,
});

// ===== AUTH SERVICES =====
export const registerUser = async ({
  firstName,
  lastName,
  age,
  email,
  password,
  confirmPassword,
  gender,
}) => {
  // Validation
  if (!password) throw new HttpError(400, "Password required");

  const policyErrors = validatePasswordPolicy(password);
  if (policyErrors.length) throw new HttpError(400, policyErrors[0]);
  if (password !== confirmPassword)
    throw new HttpError(400, "Passwords do not match");

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.exists({ email: normalizedEmail });
  if (existingUser) throw new HttpError(409, "Email already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    age,
    email: normalizedEmail,
    passwordHash,
    gender,
  });

  return { message: "User registered", user: buildSafeUser(user) };
};

// export const loginUser = async ({ email, password }) => {
//   if (!email || !password)
//     throw new HttpError(400, "Email and password required");

//   const user = await User.findOne({ email: normalizeEmail(email) });
//   if (!user || !(await bcrypt.compare(password, user.passwordHash)))
//     throw new HttpError(401, "Invalid email or password");

//   // Master user bypass
//   if (user.roleId === "master") {
//     return {
//       message: "Logged in",
//       user: buildSafeUser(user),
//       role: { roleName: "Master", roleMap: "all" },
//       token: createToken(user),
//     };
//   }

//   const role = await Role.findById(user.roleId);
//   return {
//     message: "Logged in",
//     user: buildSafeUser(user),
//     role,
//     token: createToken(user),
//   };
// };


export const loginUser = async ({ email, password }) => {
  if (!email || !password)
    throw new HttpError(400, "Email and password required");

  const user = await User.findOne({ email: normalizeEmail(email) });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    throw new HttpError(401, "Invalid email or password");

  // MASTER USER BYPASS
  if (user.roleId === "master") {
    return {
      message: "Logged in",
      user: buildSafeUser(user),
      role: { roleName: "Master", roleMap: "all" },
      token: createToken(user),
    };
  }

  //  BLOCK LOGIN IF ROLE NOT ASSIGNED
  if (!user.roleId) {
    throw new HttpError(
      403,
      "Your account is pending approval. Please contact administrator."
    );
  }

  // BLOCK LOGIN IF STATUS NOT ACTIVE
  if (user.status !== "active") {
    throw new HttpError(
      403,
      "Your account is not active yet. Please contact administrator."
    );
  }

  //  NORMAL ROLE USER
  const role = await Role.findById(user.roleId);
  if (!role) {
    throw new HttpError(403, "Assigned role not found. Contact admin.");
  }

  return {
    message: "Logged in",
    user: buildSafeUser(user),
    role,
    token: createToken(user),
  };
};

export const logoutUser = async () => {
  return { message: "Logged out" };
};

// ===== PASSWORD RECOVERY SERVICES =====

export const initiatePasswordReset = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) throw new HttpError(404, "Email not registered");

  const otp = generateOTP();
  user.resetOTP = await bcrypt.hash(otp, 10);
  user.resetOTPExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  try {
    await sendOTPEmail({ to: normalizedEmail, otp, minutes: 10 });
  } catch (err) {
    console.error("Failed to send OTP email:", err.message);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();
    throw new HttpError(502, "Failed to send OTP");
  }

  if (process.env.NODE_ENV !== "production")
    console.log(`[DEV] OTP for ${normalizedEmail}: ${otp}`);

  return { message: "OTP sent to email" };
};

export const verifyUserOTP = async ({ email, otp }) => {
  const user = await User.findOne({ email: normalizeEmail(email) });

  if (!user || !user.resetOTP || !user.resetOTPExpires)
    throw new HttpError(400, "Invalid or expired OTP");

  if (user.resetOTPExpires < Date.now()) {
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();
    throw new HttpError(400, "OTP expired");
  }

  if (!(await bcrypt.compare(String(otp), user.resetOTP)))
    throw new HttpError(400, "Invalid OTP");

  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;
  await user.save();

  const resetToken = jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.RESET_TOKEN_SECRET || "dev-reset-secret",
    { expiresIn: process.env.RESET_TOKEN_EXPIRES || "10m" }
  );

  return { message: "OTP verified", resetToken };
};

export const executePasswordReset = async ({
  resetToken,
  newPassword,
  confirmPassword,
}) => {
  if (!resetToken || !newPassword || !confirmPassword)
    throw new HttpError(400, "All fields required");

  const policyErrors = validatePasswordPolicy(newPassword);
  if (policyErrors.length) throw new HttpError(400, policyErrors[0]);
  if (newPassword !== confirmPassword)
    throw new HttpError(400, "Passwords do not match");

  let payload;
  try {
    payload = jwt.verify(
      resetToken,
      process.env.RESET_TOKEN_SECRET || "dev-reset-secret"
    );
  } catch {
    throw new HttpError(400, "Invalid or expired token");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(404, "User not found");

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;
  await user.save();

  return { message: "Password reset successfully" };
};

// ===== USER PROFILE SERVICES =====

export const getCurrentUser = async (userId) => {
  const userDoc = await User.findById(userId).select("-passwordHash");
  if (!userDoc) throw new HttpError(404, "User not found");

  const user = buildSafeUser(userDoc);

  if (user.roleId === "master") {
    return {
      user,
      role: { roleName: "Master", roleMap: "all" },
    };
  }

  const role = await Role.findById(user.roleId);
  return { user, role };
};

export const updateUserProfile = async (userId, updateData, file = null) => {
  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, "User not found");

  // Update basic fields
  ["firstName", "lastName", "age", "gender"].forEach((field) => {
    if (updateData[field]) user[field] = updateData[field];
  });

  // Handle image upload
  if (file) {
    const { publicUrl } = await uploadBufferToSupabase({
      bucket: process.env.SUPABASE_BUCKET,
      folder: userId.toString(),
      filename: file.originalname,
      buffer: file.buffer,
      contentType: file.mimetype,
    });
    user.profileImage = publicUrl;
  }

  await user.save();
  return {
    message: "Profile updated successfully",
    user: buildSafeUser(user),
  };
};

// ===== ADMIN SERVICES =====

export const fetchUnassignedUsers = async () => {
  const users = await User.find({ roleId: null, status: "pending" }).select(
    "_id firstName lastName email"
  );
  return { success: true, users };
};

export const fetchAllUsersWithRoles = async () => {
  const users = await User.find()
    .select("-passwordHash -resetOTP -resetOTPExpires")
    .sort({ createdAt: -1 });

  const usersWithRoles = await Promise.all(
    users.map(async (user) => {
      const userObj = user.toObject();

      if (userObj.roleId === "master") {
        userObj.role = {
          _id: "master",
          roleName: "Master",
          roleMap: "all",
        };
      } else if (userObj.roleId) {
        const role = await Role.findById(userObj.roleId).select(
          "roleName roleMap"
        );
        userObj.role = role || null;
      } else {
        userObj.role = null;
      }

      return userObj;
    })
  );

  return {
    success: true,
    count: usersWithRoles.length,
    users: usersWithRoles,
  };
};
