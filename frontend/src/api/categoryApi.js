import axiosClient from "./axiosClient";

export const getCategoriesApi = () => {
    return axiosClient.get("/categories");
};