import axiosClient from "./axiosClient";

export const loginApi = (data) => {
    return axiosClient.post("/auth/login", data);
};

export const registerApi = (data) => {
    return axiosClient.post("/auth/register", data);
};

export const getMeApi = () => {
    return axiosClient.get("/auth/me");
};

export const refreshTokenApi = (refreshToken) => {
    return axiosClient.post("/auth/refresh", {
        refresh_token: refreshToken,
    });
};