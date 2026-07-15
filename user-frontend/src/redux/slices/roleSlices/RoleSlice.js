// src/redux/slices/rolesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRoles,
  deleteRole,
  updateRole,          // ✅ USE THUNK
  assignRole,
  fetchUnassignedUsers,
  fetchAllUsers,
  
 fetchRoleById,          // ✅ ADD THIS

} from "../../thunks/roleThunks/RoleThunk";

const initialState = {
  roles: [],
  selectedRole: null, 
  rolesLoading: false,
  rolesError: null,

  assignRoleLoading: false,
  assignRoleError: null,

  unassignedUsers: [],
  usersLoading: false,
  usersError: null,

  allUsers: [],
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ===================== FETCH ROLES ===================== */
      .addCase(fetchRoles.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload;
      })

      /* ===================== DELETE ROLE ===================== */
      .addCase(deleteRole.pending, (state) => {
        state.rolesLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = state.roles.filter(
          (role) => role._id !== action.payload.id
        );
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload;
      })

      /* ===================== UPDATE ROLE ===================== */
      .addCase(updateRole.pending, (state) => {
        state.rolesLoading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = state.roles.map((role) =>
          role._id === action.payload._id ? action.payload : role
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload;
      })

      /* ===================== ASSIGN ROLE ===================== */
      .addCase(assignRole.pending, (state) => {
        state.assignRoleLoading = true;
        state.assignRoleError = null;
      })
      .addCase(assignRole.fulfilled, (state) => {
        state.assignRoleLoading = false;
      })
      .addCase(assignRole.rejected, (state, action) => {
        state.assignRoleLoading = false;
        state.assignRoleError = action.payload;
      })

      /* ===================== UNASSIGNED USERS ===================== */
      .addCase(fetchUnassignedUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUnassignedUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.unassignedUsers = action.payload;
      })
      .addCase(fetchUnassignedUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })

      /* ===================== ALL USERS ===================== */
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })

      /* ===================== FETCH ROLE BY ID ===================== */
.addCase(fetchRoleById.pending, (state) => {
  state.rolesLoading = true;
  state.rolesError = null;
})
.addCase(fetchRoleById.fulfilled, (state, action) => {
  state.rolesLoading = false;
  state.selectedRole = action.payload; // ✅ VERY IMPORTANT
})
.addCase(fetchRoleById.rejected, (state, action) => {
  state.rolesLoading = false;
  state.rolesError = action.payload;
});
  },
});

export default rolesSlice.reducer;