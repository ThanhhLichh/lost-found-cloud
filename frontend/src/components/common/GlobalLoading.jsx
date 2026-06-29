import { HiArrowPath } from "react-icons/hi2";
import { useLoading } from "../../context/LoadingContext";
import "./GlobalLoading.css";

function GlobalLoading() {
    const { loading } = useLoading();

    if (!loading) return null;

    return (
        <div className="global-loading-overlay">
            <div className="global-loading-box">
                <HiArrowPath />
                <span>Đang xử lý...</span>
            </div>
        </div>
    );
}

export default GlobalLoading;