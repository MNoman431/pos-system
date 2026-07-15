// src/redux/thunks/rolesThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as roleApi from "../../../services/roleApi/roleApi"; // create this API service
import { api } from "../../../services/api";

export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await roleApi.getRolesApi();
      return res.data?.roles || [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch roles");
    }
  }
);

export const assignRole = createAsyncThunk(
  "roles/assignRole",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await roleApi.assignRoleApi(payload); // { userId, roleId }
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to assign role");
    }
  }
);

export const fetchUnassignedUsers = createAsyncThunk(
  "roles/fetchUnassignedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await roleApi.getUnassignedUsersApi();
      return res.data?.users || [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch users");
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "roles/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await roleApi.getAllUsersApi();
      return res.data?.users || [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch all users");
    }
  }
);

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await roleApi.createRoleApi(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create role"
      );
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      const res = await roleApi.deleteRoleApi(id);
      return { id, message: res.data?.message };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete role"
      );
      
    }
  }
);


export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ id, roleName, description, roleMap }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/roles/${id}`, {
        roleName,
        description,
        roleMap,
      });

      return res.data.role;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update role"
      );
    }
  }
);



export const fetchRoleById = createAsyncThunk(
  "roles/fetchRoleById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await roleApi.getRoleByIdApi(id);
      return res.data.role;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch role"
      );
    }
  }
);