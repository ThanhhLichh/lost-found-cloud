import axiosClient from "./axiosClient";

export const uploadImageApi = (file) => {
    const formData = new FormData();

    formData.append("file", file);

    return axiosClient.post(
        "/uploads/image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const uploadAvatarApi = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/uploads/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};