import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./styles/globals.css";
import "./styles/variables.css";
import "./styles/toast.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);