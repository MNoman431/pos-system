import { api } from "../../services/api";

// Create item with image
export const createItemApi = (formData) => api.post("/inventory/items", formData);

// Get all items
export const getItemsApi = () => api.get("/inventory/items");

// Get single item by ID
export const getItemByIdApi = (id) => api.get(`/inventory/items/${id}`);

// Get item by code
export const getItemByCodeApi = (code) => api.get(`/inventory/items/by-code?code=${code}`);

// Check if item code already exists
export const checkItemCodeApi = (code) => api.get(`/inventory/items/check-code?code=${code}`);

// Update item
export const updateItemApi = (id, formData) => api.put(`/inventory/items/${id}`, formData);

// Delete item
export const deleteItemApi = (id) => api.delete(`/inventory/items/${id}`);