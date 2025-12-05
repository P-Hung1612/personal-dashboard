import { apiRequest } from "./api";

export const login = (email, password) =>
    apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

export const register = (email, password, name) =>
    apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
    });
