import { api } from "../../services/api";

// Create purchase invoice
export const createPurchaseApi = (body) => api.post("/purchase", body);

// Get all purchases with pagination
export const getPurchasesApi = (page = 1, limit = 10) => 
  api.get(`/purchase?page=${page}&limit=${limit}`);

// Get single purchase by ID
export const getPurchaseByIdApi = (id) => api.get(`/purchase/${id}`);
