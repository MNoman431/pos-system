
// src/redux/thunks/authThunks/authThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../../../services/authApi/authApi";

// -------------------- REGISTER --------------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { firstName, lastName, age, email, password, confirmPassword, gender, role = "isUser" },
    { rejectWithValue }
  ) => {
    try {
      const body = {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        ...(age === "" || age === undefined || age === null ? {} : { age: Number(age) }),
        email: email?.trim().toLowerCase(),
        password,
        confirmPassword,
        gender,
        role,
      };
      const res = await authApi.registerUserApi(body);
      return res.data.user; // return only user
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Network error");
    }
  }
);

// -------------------- LOGIN --------------------
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const res = await authApi.loginUserApi({ email, password });
//       return res.data.user;
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Network error");
//     }
//   }
// );

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await authApi.loginUserApi({ email, password });
      return {
        user: res.data.user,
        role: res.data.role
      };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Network error");
    }
  }
);
// -------------------- LOGOUT --------------------
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.logoutUserApi();
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Network error");
    }
  }
);

// -------------------- REQUEST OTP --------------------
export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (email, { rejectWithValue }) => {
    try {
      const res = await authApi.requestOtpApi(email);
      return {
        message: res.data?.message || "If this email exists, an OTP has been sent.",
        email,
      };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Network error");
    }
  }
);

// -------------------- VERIFY OTP --------------------
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyOtpApi({ email, otp });
      return {
        message: res.data?.message,
        resetToken: res.data?.resetToken,
        email,
      };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Network error");
    }
  }
);

// -------------------- RESET PASSWORD --------------------
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await authApi.resetPasswordApi({ resetToken, newPassword, confirmPassword });
      return { message: res.data?.message };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Network error");
    }
  }
);

// -------------------- LOAD USER --------------------
// export const loadUser = createAsyncThunk(
//   "auth/loadUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await authApi.loadUserApi();
//       return res.data.user;
//     } catch (err) {
//       return rejectWithValue("Session expired");
//     }
//   }
// );
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.loadUserApi();
      return {
        user: res.data.user,
        role: res.data.role
      };
    } catch {
      return rejectWithValue("Session expired");
    }
  }
);

// -------------------- UPDATE PROFILE --------------------
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await authApi.updateProfileApi(formData);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Network error");
    }
  }
);
