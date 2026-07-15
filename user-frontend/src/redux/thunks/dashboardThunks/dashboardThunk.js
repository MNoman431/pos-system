
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import * as dashboardApi from "../../../services/dashboardApi/dashbaordApi";


// // -------------------- DASHBOARD SUMMARY --------------------
// export const fetchDashboardSummary = createAsyncThunk(
//   "dashboard/summary",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await dashboardApi.getDashboardSummaryApi();
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch dashboard summary");
//     }
//   }
// );

// // -------------------- LOW STOCK --------------------
// export const fetchLowStockItems = createAsyncThunk(
//   "dashboard/lowStock",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getDashboardSummaryApi.getLowStockItemsApi();
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch low stock items");
//     }
//   }
// );

// // -------------------- REORDER ALERTS --------------------
// export const fetchReorderAlerts = createAsyncThunk(
//   "dashboard/reorderAlerts",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await dashboardApi.getReorderAlertsApi();
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch reorder alerts");
//     }
//   }
// );

// // -------------------- MONTHLY ANALYTICS --------------------
// export const fetchMonthlyAnalytics = createAsyncThunk(
//   "dashboard/monthly",
//   async (filter = "monthly", { rejectWithValue }) => {
//     try {
//       const res = await dashboardApi.getMonthlyAnalyticsApi(filter);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch monthly analytics");
//     }
//   }
// );

// // -------------------- FILTERED SUMMARY --------------------
// export const fetchFilteredSummary = createAsyncThunk(
//   "dashboard/filteredSummary",
//   async (filter = "monthly", { rejectWithValue }) => {
//     try {
//       const res = await dashboardApi.getFilteredSummaryApi(filter);
//       return res.data?.data || {};
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch filtered summary");
//     }
//   }
// );


import {createAsyncThunk } from "@reduxjs/toolkit";
import * as dashboardApi from "../../../services/dashboardApi/dashbaordApi";
import axios from "axios";

// -------------------- DASHBOARD THUNKS --------------------
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/summary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardApi.getDashboardSummaryApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch dashboard summary");
    }
  }
);

export const fetchLowStockItems = createAsyncThunk(
  "dashboard/lowStock",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardApi.getLowStockItemsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch low stock items");
    }
  }
);

export const fetchReorderAlerts = createAsyncThunk(
  "dashboard/reorderAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardApi.getReorderAlertsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch reorder alerts");
    }
  }
);

export const fetchMonthlyAnalytics = createAsyncThunk(
  "dashboard/monthly",
  async (filter = "monthly", { rejectWithValue }) => {
    try {
      const res = await dashboardApi.getMonthlyAnalyticsApi(filter);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch monthly analytics");
    }
  }
);

export const fetchFilteredSummary = createAsyncThunk(
  "dashboard/filteredSummary",
  async (filter = "monthly", { rejectWithValue }) => {
    try {
      const res = await dashboardApi.getFilteredSummaryApi(filter);
      return res.data?.data || {};
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch filtered summary");
    }
  }
);

// // -------------------- ROLES THUNKS --------------------
// export const fetchRoles = createAsyncThunk(
//   "dashboard/fetchRoles",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await dashboardApi.getRolesApi();
//       return res.data?.roles || [];
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch roles");
//     }
//   }
// );

// export const assignRole = createAsyncThunk(
//   "dashboard/assignRole",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await dashboardApi.assignRoleApi(payload); // { userId, roleName }
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to assign role");
//     }
//   }
// );

// export const fetchUnassignedUsers = createAsyncThunk(
//   "dashboard/fetchUnassignedUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await dashboardApi.getUnassignedUsersApi();
//       return res.data?.users || [];
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch users");
//     }
//   }
// );


// export const fetchAllUsers = createAsyncThunk(
//   "dashboard/fetchAllUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await dashboardApi.getAllUsersApi(); // ✅ API call
//       return response.data.users; // ✅ Return users array
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || "Failed to fetch all users");
//     }
//   }
// );

