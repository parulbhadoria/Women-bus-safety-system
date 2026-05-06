import { ReactNode, useState } from "react";
import { FaBars, FaBus, FaIdCard, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { MdAssignment, MdDashboard, MdMap, MdSettings, MdSos } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <MdDashboard /> },
    { to: "/admin/live-map", label: "Live Map", icon: <MdMap /> },
    { to: "/admin/buses", label: "Buses", icon: <FaBus /> },
    { to: "/admin/drivers", label: "Drivers", icon: <FaIdCard /> },
    { to: "/admin/passengers", label: "Passengers", icon: <FaUsers /> },
    { to: "/admin/sos-alerts", label: "SOS Alerts", icon: <MdSos /> },
    { to: "/admin/assign-bus", label: "Assign Bus", icon: <MdAssignment /> },
    { to: "/admin/config", label: "Config", icon: <MdSettings /> },
  ];
  const isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false;
  const sidebarVisible = !isMobile || open;
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", minHeight: "calc(100vh - 64px)" }}>
      {isMobile && <button style={{ position: "fixed", left: 10, top: 74, zIndex: 1001, border: "none", borderRadius: 8, background: "#7B2D8B", color: "#fff", padding: 10 }} onClick={() => setOpen(!open)}><FaBars /></button>}
      <aside style={{ background: "#7B2D8B", color: "#fff", padding: 16, display: sidebarVisible ? "grid" : "none", position: isMobile ? "fixed" : "sticky", top: isMobile ? 64 : 0, inset: isMobile ? "64px auto 0 0" : "auto", width: 260, zIndex: 1000, height: isMobile ? "calc(100vh - 64px)" : "calc(100vh - 64px)" }}>
        <h2 style={{ display: "flex", gap: 8, alignItems: "center" }}><FaBus /> Women Bus Safety</h2>
        {links.map((l) => <NavLink key={l.to} to={l.to} style={({ isActive }) => ({ color: isActive ? "#7B2D8B" : "#fff", background: isActive ? "#fff" : "transparent", padding: "10px 12px", borderRadius: 8, margin: "4px 0", display: "flex", gap: 8, alignItems: "center" })}>{l.icon} {l.label}</NavLink>)}
        <button style={{ marginTop: "auto", border: "1px solid #fff", color: "#fff", background: "transparent", padding: 10, borderRadius: 8 }} onClick={async () => { await logout(); navigate("/login"); }}><FaSignOutAlt /> Logout</button>
      </aside>
      {isMobile && sidebarVisible && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 999 }} />}
      <main style={{ marginLeft: 0 }}>{children}</main>
    </div>
  );
}
