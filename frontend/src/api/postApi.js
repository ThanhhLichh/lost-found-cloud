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