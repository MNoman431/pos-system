import { api } from "../api";


export const createSale = (data) => api.post("/sales/create", data);

export const getSales = (page = 1, limit = 10) => api.get(`/sales?page=${page}&limit=${limit}`);
export const getSaleById = (id) => api.get(`/sales/${id}`);