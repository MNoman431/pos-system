import { api } from "../../services/api";

// Create vendor
export const createVendorApi = (body) => api.post("/vendors", body);

// Get all vendors
export const getVendorsApi = () => api.get("/vendors");

// Get single vendor by ID
export const getVendorByIdApi = (id) => api.get(`/vendors/${id}`);

// Update vendor
export const updateVendorApi = (id, body) => api.put(`/vendors/${id}`, body);

// Deactivate vendor (soft delete)
export const deactivateVendorApi = (id) => api.patch(`/vendors/${id}/deactivate`);
