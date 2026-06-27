import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import AppHome from "../pages/app/AppHome";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

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
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;