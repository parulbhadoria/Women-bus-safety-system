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
    ? [{ label: "Home", to: "/passenger/home" }, { label: "Nearby Buses", to: "/passenger/buses" }, { label: "Contacts", to: "/passenger/contacts" }]
    : userRole === "driver"
    ? [{ label: "Home", to: "/driver/home" }, { label: "My Duty", to: "/driver/duty" }]
    : [];

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-xl sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 font-bold text-xl hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
              <FaBus className="text-2xl" />
            </div>
            <span className="bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
              Women Bus Safety
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 hover:scale-105 ${
                  location.pathname === link.to ? 'bg-white bg-opacity-20' : ''
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>

            {/* Role Badge */}
            <span 
              className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                userRole === "admin" 
                  ? "bg-yellow-400 text-gray-900" 
                  : userRole === "driver" 
                  ? "bg-green-400 text-gray-900" 
                  : "bg-pink-400 text-white"
              }`}
            >
              {userRole?.toUpperCase() || "USER"}
            </span>

            {/* User Name */}
            <span className="hidden sm:block text-sm font-medium">
              {userData?.name || "User"}
            </span>

            {/* Logout Button */}
            <button 
              onClick={logout}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 border border-white border-opacity-30"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && links.length > 0 && (
          <div className="md:hidden py-4 border-t border-white border-opacity-20 animate-slide-up">
            <div className="space-y-2">
              {links.map((link) => (
                <Link
                  key={`mobile-${link.to}`}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to 
                      ? 'bg-white bg-opacity-20' 
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
