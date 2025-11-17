import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const ProtectedLayout = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Navbar />
            <div className="pt-16">
                <Outlet />
            </div>
        </>
    );
};

export default ProtectedLayout;