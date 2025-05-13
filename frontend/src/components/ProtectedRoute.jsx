import React, { useEffect, useState } from "react";
import useAuth from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(token);

    // Check if token exists
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  // Only render children if token exists
  return token ? children : null;

  return isAuthenticated ? children : navigate("/");
};

export default ProtectedRoute;
