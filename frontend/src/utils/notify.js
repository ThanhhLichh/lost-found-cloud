import { toast } from "react-toastify";

const config = {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
};

export const Notify = {
    success: (message) =>
        toast.success(message, config),

    error: (message) =>
        toast.error(message, config),

    warning: (message) =>
        toast.warning(message, config),

    info: (message) =>
        toast.info(message, config),
};