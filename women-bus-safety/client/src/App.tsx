import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RoleSelect from "./pages/auth/RoleSelect";
import AadhaarVerify from "./pages/auth/AadhaarVerify";
import LicenseVerify from "./pages/auth/LicenseVerify";
import PassengerHome from "./pages/passenger/PassengerHome";
import NearbyBuses from "./pages/passenger/NearbyBuses";
import LiveMap from "./pages/passenger/LiveMap";
import EmergencyContacts from "./pages/passenger/EmergencyContacts";
import JourneyStatus from "./pages/passenger/JourneyStatus";
import SOSPage from "./pages/passenger/SOSPage";
import DriverHome from "./pages/driver/DriverHome";
import DriverDuty from "./pages/driver/DriverDuty";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBuses from "./pages/admin/AdminBuses";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminPassengers from "./pages/admin/AdminPassengers";
import AdminSosAlerts from "./pages/admin/AdminSosAlerts";
import AdminAssignBus from "./pages/admin/AdminAssignBus";
import AdminConfig from "./pages/admin/AdminConfig";
import AdminLiveMap from "./pages/admin/AdminLiveMap";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/role" element={<RoleSelect />} />
        <Route path="/register/aadhaar" element={<AadhaarVerify />} />
        <Route path="/register/license" element={<LicenseVerify />} />
        <Route path="/passenger/home" element={<ProtectedRoute role="passenger"><PassengerHome /></ProtectedRoute>} />
        <Route path="/passenger/buses" element={<ProtectedRoute role="passenger"><NearbyBuses /></ProtectedRoute>} />
        <Route path="/passenger/map" element={<ProtectedRoute role="passenger"><LiveMap /></ProtectedRoute>} />
        <Route path="/passenger/contacts" element={<ProtectedRoute role="passenger"><EmergencyContacts /></ProtectedRoute>} />
        <Route path="/passenger/journey" element={<ProtectedRoute role="passenger"><JourneyStatus /></ProtectedRoute>} />
        <Route path="/passenger/sos" element={<ProtectedRoute role="passenger"><SOSPage /></ProtectedRoute>} />
        <Route path="/driver/home" element={<ProtectedRoute role="driver"><DriverHome /></ProtectedRoute>} />
        <Route path="/driver/duty" element={<ProtectedRoute role="driver"><DriverDuty /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/buses" element={<ProtectedRoute role="admin"><AdminBuses /></ProtectedRoute>} />
        <Route path="/admin/drivers" element={<ProtectedRoute role="admin"><AdminDrivers /></ProtectedRoute>} />
        <Route path="/admin/passengers" element={<ProtectedRoute role="admin"><AdminPassengers /></ProtectedRoute>} />
        <Route path="/admin/sos-alerts" element={<ProtectedRoute role="admin"><AdminSosAlerts /></ProtectedRoute>} />
        <Route path="/admin/assign-bus" element={<ProtectedRoute role="admin"><AdminAssignBus /></ProtectedRoute>} />
        <Route path="/admin/config" element={<ProtectedRoute role="admin"><AdminConfig /></ProtectedRoute>} />
        <Route path="/admin/live-map" element={<ProtectedRoute role="admin"><AdminLiveMap /></ProtectedRoute>} />
      </Routes>
      <ToastContainer position="top-right" />
    </>
  );
}
