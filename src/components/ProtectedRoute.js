import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  if (!user || user.userType !== "USER") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
