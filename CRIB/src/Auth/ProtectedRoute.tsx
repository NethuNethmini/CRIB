import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Store/store";

interface ProtectedRouteProps {
  allowed: string[]; 
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowed, children }) => {
  const location = useLocation();

  const { auth, role } = useSelector((state: RootState) => state.auth);
  

  // If not logged in, redirect to login page
  if (!auth) {
    return (
      <Navigate
        to={role === "crib" ? "/login-crib" : "/"}
        state={{ from: location }}
        replace
      />
    );
  }

  // If logged in but role not allowed or missing
  if (!role || !allowed.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
