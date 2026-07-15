
import {api} from "..//../services/api"

export const registerUserApi = (body) => api.post("/auth/register", body);
export const loginUserApi = (body) => api.post("/auth/login", body);
export const logoutUserApi = () => api.post("/auth/logout");
export const requestOtpApi = (email) => api.post("/auth/forget-password", { email });
export const verifyOtpApi = ({ email, otp }) => api.post("/auth/verify-otp", { email, otp });
export const resetPasswordApi = (body) => api.post("/auth/reset-password", body);
export const loadUserApi = () => api.get("/auth/me");
export const updateProfileApi = (formData) => api.put("/auth/me", formData);