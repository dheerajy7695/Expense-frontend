import React from "react";
import "./App.css";
import { Navigate, useRoutes } from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";
import ProtectedLayout from "./Layout/ProtectedLayout";

import User from "./Components/User";
import Dashboard from "./Components/Dashboard";
import Transaction from "./Components/Transaction";

const isAuthenticated = () => !!sessionStorage.getItem("token");

const App = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: !isAuthenticated() ? <Login /> : <Navigate to="/dashboard" replace />,
    },
    {
      path: "/register",
      element: !isAuthenticated() ? <Register /> : <Navigate to="/dashboard" replace />,
    },
    {
      element: <ProtectedLayout />,
      children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/users", element: <User /> },
        { path: "/transactions", element: <Transaction /> },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return routes;
};

export default App;