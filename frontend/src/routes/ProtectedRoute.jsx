import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated, loadingUser } = useAuth();

    if (loadingUser) {
        return <div>Đang tải...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;