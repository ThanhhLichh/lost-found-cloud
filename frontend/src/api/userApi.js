import axiosClient from "./axiosClient";

export const updateProfileApi = (data) => {
    return axiosClient.put("/users/me", data);
};

export const changePasswordApi = (data) => {
    return axiosClient.put("/users/me/password", data);
};

export const updateAvatarApi = (data) => {
    return axiosClient.put("/users/me/avatar", data);
};

export const deleteAvatarApi = () => {
    return axiosClient.delete("/users/me/avatar");
};