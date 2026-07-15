// import { api } from "../api";

import { api } from "../api";

export const getRolesApi = () => api.get("/roles");
export const createRoleApi = (data) => api.post("/roles", data);
export const assignRoleApi = (data) => api.post("/roles/assign", data);
export const getUnassignedUsersApi = () => api.get("/auth/unassigned");
export const getAllUsersApi = () => api.get("/auth/all");
export const deleteRoleApi = (id) => api.delete(`/roles/${id}`);

export const updateRoleApi = (id, data) =>  api.put(`/roles/${id}`, data);
export const getRoleByIdApi = (id) => api.get(`/roles/${id}`);
