import { createContext, useContext, useEffect, useState } from "react";
import { getMeApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const isAuthenticated = !!localStorage.getItem("access_token");

    const loadCurrentUser = async () => {
        try {
            const res = await getMeApi();
            setUser(res.data);
        } catch {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
    };

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            loadCurrentUser();
        } else {
            setLoadingUser(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                loadingUser,
                loadCurrentUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}