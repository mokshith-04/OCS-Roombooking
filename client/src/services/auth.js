import api from "./api";

// Login user
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Save auth data
export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Get stored user
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get stored token
export const getStoredToken = () => {
  return localStorage.getItem("token");
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
