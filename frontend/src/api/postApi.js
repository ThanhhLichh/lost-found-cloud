import axiosClient from "./axiosClient";

export const getPostsApi = ({ page = 1, limit = 10, post_type, keyword } = {}) => {
    return axiosClient.get("/posts", {
        params: {
            page,
            limit,
            post_type: post_type || undefined,
            keyword: keyword || undefined,
        },
    });
};

export const createPostApi = (data) => {
    return axiosClient.post("/posts", data);
};

export const getMyPostsApi = () => {
    return axiosClient.get("/posts/me");
};

export const updatePostApi = (postId, data) => {
    return axiosClient.put(`/posts/${postId}`, data);
};

export const deletePostApi = (postId) => {
    return axiosClient.delete(`/posts/${postId}`);
};

export const updatePostStatusApi = (postId, status) => {
    return axiosClient.patch(`/posts/${postId}/status`, {
        status,
    });
};

export const getRankingApi = () => {
    return axiosClient.get("/posts/ranking");
};