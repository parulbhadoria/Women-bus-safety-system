import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute: React.FC<{ role: "passenger" | "driver" | "admin"; children: React.ReactElement }> = ({ role, children }) => {
  const navigate = useNavigate();
  const { currentUser, userRole, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (userRole !== role) return (
    <div className="page-wrap" style={{ display: "grid", placeItems: "center" }}>
      <div className="glass-card" style={{ padding: 24, width: "min(420px, 100%)", textAlign: "center" }}>
        <h3 style={{ color: "#D32F2F" }}>Access Denied</h3>
        <p>You do not have permission to view this page.</p>
        <button className="gradient-btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
  return children;
};

export default ProtectedRoute;
