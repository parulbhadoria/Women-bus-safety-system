import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaBus, FaSignOutAlt, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { userData, userRole, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  if (["/login", "/register", "/register/role", "/register/aadhaar", "/register/license"].includes(location.pathname)) return null;
  const roleColor = userRole === "admin" ? "#FFD740" : userRole === "driver" ? "#69F0AE" : "#E91E8C";
  const links = userRole === "passenger"
    ? [{ label: "Home", to: "/passenger/home" }, { label: "Nearby Buses", to: "/passenger/buses" }, { label: "My Journey", to: "/passenger/journey" }, { label: "Contacts", to: "/passenger/contacts" }]
    : userRole === "driver"
    ? [{ label: "Home", to: "/driver/home" }, { label: "My Duty", to: "/driver/duty" }]
    : [];

  return (
    <nav style={{ background: "#7B2D8B", color: "#fff", height: 64, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 999 }}>
      <Link to="/" style={{ color: "#fff", display: "flex", gap: 8, alignItems: "center", fontWeight: 700, whiteSpace: "nowrap" }}>
        <FaBus /> Women Bus Safety
      </Link>

      <div className="nav-middle" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {links.map((link) => (
          <Link key={link.to} to={link.to} style={{ color: "#fff", fontWeight: 500 }}>{link.label}</Link>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="nav-mobile-toggle" onClick={() => setMenuOpen((v) => !v)} style={{ background: "transparent", border: "none", color: "#fff", display: "none", fontSize: 18 }}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <span style={{ padding: "4px 10px", borderRadius: 999, background: roleColor, color: userRole === "admin" ? "#212121" : "#fff", fontWeight: 700 }}>{userRole || "user"}</span>
        <span style={{ color: "#fff" }}>{userData?.name || "User"}</span>
        <button onClick={logout} style={{ border: "1px solid #fff", color: "#fff", background: "transparent", borderRadius: 10, padding: "8px 10px", display: "flex", gap: 6, alignItems: "center" }}><FaSignOutAlt /> Logout</button>
      </div>

      {menuOpen && links.length > 0 && (
        <div style={{ position: "absolute", top: 64, left: 0, right: 0, background: "#7B2D8B", borderTop: "1px solid rgba(255,255,255,0.2)", display: "grid", padding: 12, gap: 10 }}>
          {links.map((link) => (
            <Link key={`mobile-${link.to}`} to={link.to} style={{ color: "#fff" }} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          .nav-middle { display: none !important; }
          .nav-mobile-toggle { display: inline-flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
