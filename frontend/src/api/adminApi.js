import axiosClient from "./axiosClient";

export const getPendingPostsApi = () => {
    return axiosClient.get("/admin/posts/pending");
};

export const approvePostApi = (postId) => {
    return axiosClient.put(`/admin/posts/${postId}/approve`);
};

export const rejectPostApi = (postId) => {
    return axiosClient.put(`/admin/posts/${postId}/reject`);
};

export const getUsersApi = () => {
    return axiosClient.get("/admin/users");
};

export const lockUserApi = (userId) => {
    return axiosClient.patch(`/admin/users/${userId}/lock`);
};

export const unlockUserApi = (userId) => {
    return axiosClient.patch(`/admin/users/${userId}/unlock`);
};
export const adminDeletePostApi = (postId) => {
    return axiosClient.delete(`/admin/posts/${postId}`);
};
export const getAdminDashboardApi = () => {
    return axiosClient.get("/admin/dashboard");
};