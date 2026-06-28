import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import AppHome from "../pages/app/AppHome";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminPosts from "../pages/admin/AdminPosts";
import AdminUsers from "../pages/admin/AdminUsers";
import Profile from "../pages/profile/Profile";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route
                    path="/app"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AppHome />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="admin/dashboard" element={<AdminDashboard />} />
                    <Route path="admin/posts" element={<AdminPosts />} />
                    <Route path="admin/users" element={<AdminUsers />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;