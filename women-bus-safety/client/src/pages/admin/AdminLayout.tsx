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
    <div className={`flex min-h-screen ${isMobile ? 'flex-col' : ''}`}>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button 
          className="fixed left-4 top-20 z-50 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-lg shadow-lg hover:shadow-purple-300 transition-all duration-200"
          onClick={() => setOpen(!open)}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed top-16 left-0 h-screen z-40' : 'sticky top-0'}
        ${sidebarVisible ? 'translate-x-0' : isMobile ? '-translate-x-full' : ''}
        w-64 bg-gradient-to-b from-purple-800 to-purple-900 text-white p-6 transition-transform duration-300 ease-in-out
        ${isMobile ? 'shadow-2xl' : 'shadow-xl'}
      `}>
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
            <FaBus className="text-xl" />
          </div>
          <h2 className="text-lg font-bold">Women Bus Safety</h2>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                  : 'hover:bg-white hover:bg-opacity-10 text-purple-100'
                }
              `}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <button 
          className="w-full mt-8 flex items-center justify-center space-x-2 px-4 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-all duration-200 border border-white border-opacity-30"
          onClick={async () => { 
            await logout(); 
            navigate("/login"); 
          }}
        >
          <FaSignOutAlt />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
