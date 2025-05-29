import React, { useEffect } from "react";
import useAuth from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  // Only render children if token exists
  return token ? children : null;
};

export default ProtectedRoute;
