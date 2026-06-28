import axiosClient from "./axiosClient";

export const updateProfileApi = (data) => {
    return axiosClient.put("/users/me", data);
};

export const changePasswordApi = (data) => {
    return axiosClient.put("/users/me/password", data);
};