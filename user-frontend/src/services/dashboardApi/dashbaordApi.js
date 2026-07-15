// src/services/dashboardApi/dashboardApi.js

import { api } from "../api";

// ---------- DASHBOARD SUMMARY ----------
export const getDashboardSummaryApi = () => api.get("/dashboard/summary");

// ---------- LOW STOCK ----------
export const getLowStockItemsApi = () => api.get("/dashboard/low-stock");

// ---------- REORDER ALERTS ----------
export const getReorderAlertsApi = () => api.get("/dashboard/reorder-alerts");

// ---------- MONTHLY ANALYTICS ----------
export const getMonthlyAnalyticsApi = (filter = "monthly") =>
  api.get(`/dashboard/monthly-analytics?filter=${filter}`);

// ---------- FILTERED SUMMARY ----------
export const getFilteredSummaryApi = (filter = "monthly") =>
  api.get(`/dashboard/summary-filtered?filter=${filter}`);

// ---------- ROLES ----------
export const getRolesApi = () => api.get("/roles"); 
// Returns: { roles: [...] }

// ---------- ASSIGN ROLE ----------
export const assignRoleApi = (payload) => api.post("/roles/assign", payload); 
// payload example: { userId: "123", roleId: "abc" }
// Returns: success message or updated role info

// ---------- UNASSIGNED USERS ----------
export const getUnassignedUsersApi = () => api.get("/auth/unassigned"); 
// Returns: { users: [...] } -> only users without a role


export const getAllUsersApi = () => api.get("/auth/all"); 