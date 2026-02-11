import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // jab auth state load ho rahi ho
  if (loading) {
    return <p>Loading...</p>;
  }

  // agar user logged in nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // agar user logged in hai
  return children;
};

export default ProtectedRoute;

