import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBus, FaSignOutAlt } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { userData, userRole, logout } = useAuth();
  const location = useLocation();
  if (["/login", "/register", "/register/role", "/register/aadhaar", "/register/license"].includes(location.pathname)) return null;
  const roleColor = userRole === "admin" ? "#FFD740" : userRole === "driver" ? "#69F0AE" : "#E91E8C";
  return (
    <nav style={{ background: "#7B2D8B", color: "#fff", minHeight: 64, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #E91E8C", position: "sticky", top: 0, zIndex: 1000 }}>
      <Link to="/" style={{ color: "#fff", display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
        <FaBus /> Women Bus Safety
      </Link>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ padding: "4px 10px", borderRadius: 999, background: roleColor, color: userRole === "admin" ? "#212121" : "#fff", fontWeight: 700 }}>{userRole || "user"}</span>
        <span style={{ color: "#fff" }}>{userData?.name || "User"}</span>
        <button onClick={logout} style={{ border: "1px solid #fff", color: "#fff", background: "transparent", borderRadius: 10, padding: "8px 10px", display: "flex", gap: 6, alignItems: "center" }}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
