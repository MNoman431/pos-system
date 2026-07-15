
// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loadUser, loginUser, logoutUser, registerUser, requestOtp, resetPassword, updateProfile, verifyOtp } from "../../thunks/authThunks/AuthThunk";
// import {
//   loginUser,
//   logoutUser,
//   registerUser,
//   requestOtp,
//   verifyOtp,
//   resetPassword,
//   loadUser,
//   updateProfile,
// } from "../../thunks/authThunks/authThunk.js";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  fpEmail: null,
  resetToken: null,
  fpMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutClient(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.fpEmail = null;
      state.resetToken = null;
      state.fpMessage = null;
      state.error = null;
      state.loading = false;
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearFpMessage(state) {
      state.fpMessage = null;
    },
    clearResetToken(state) {
      state.resetToken = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to register";
      })

      /* LOGIN ✅ FIXED */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const user = action.payload.user;
        const role = action.payload.role;

        state.user = {
          ...user,
          role:
            user.roleId === "master"
              ? { roleName: "Master", roleMap: "all" } // ✅ master bypass without crashing UI
              : role,
        };

        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login";
      })

      /* LOGOUT */
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.fpEmail = null;
        state.resetToken = null;
        state.fpMessage = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to logout";
      })

      /* OTP REQUEST */
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.fpEmail = action.payload?.email || null;
        state.fpMessage = action.payload?.message;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* VERIFY OTP */
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.resetToken = action.payload?.resetToken;
        state.fpEmail = action.payload?.email;
        state.fpMessage = action.payload?.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* RESET PASSWORD */
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.fpMessage = action.payload?.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOAD USER ✅ MASTER FIX ADDED */
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;

        const user = action.payload.user;
        const role = action.payload.role;

        state.user = {
          ...user,
          role:
            user.roleId === "master"
              ? { roleName: "Master", roleMap: "all" } // ✅ FIXED (no roleMap crash)
              : role,
        };

        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      /* UPDATE PROFILE */
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          ...state.user,
          ...action.payload,
        };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logoutClient,
  clearAuthError,
  clearFpMessage,
  clearResetToken,
} = authSlice.actions;

export default authSlice.reducer;