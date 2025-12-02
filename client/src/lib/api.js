// src/lib/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // đổi thành backend của bạn
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm token vào mọi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (data) => api.post("/auth/login", data),
    register: (data) => api.post("/auth/register", data),
    me: () => api.get("/auth/me"),
};

export default api;