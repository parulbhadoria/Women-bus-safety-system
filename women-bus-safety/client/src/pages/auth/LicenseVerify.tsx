import React, { useContext, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdVerifiedUser } from "react-icons/md";
import api from "../../utils/api";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const LicenseVerify = () => {
  const [licenseId, setLicenseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const { state } = useLocation() as any;
  const navigate = useNavigate();
  const { forceRefresh } = useContext(AuthContext);
  const verify = async () => {
    if (!licenseId.trim()) return toast.error("Enter a valid license ID");
    setLoading(true);
    try {
      if (!state?.uid) return navigate("/register");
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-license`;
      const payload = { licenseId: licenseId.trim() };
      console.log("verify-license request", { url, payload });
      await api.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      await setDoc(doc(db, "users", state.uid), { uid: state.uid, name: state.name, email: state.email, phone: state.phone, role: "driver", emergencyContacts: [] });
      await setDoc(doc(db, "drivers", state.uid), { uid: state.uid, name: state.name, licenseId: licenseId.trim(), assignedBus: "", isActive: false });
      setSettingUp(true);
      await forceRefresh();
      navigate("/driver/home");
    } catch (e: any) {
      if (e?.response?.status === 404) toast.error("License ID not found");
      else if (e?.response?.status === 403) toast.error("License ID is not valid");
      else if (!e?.response) toast.error("Cannot connect to server. Make sure the backend is running.");
      else if (e?.response?.data?.error) toast.error(e.response.data.error);
      else if (String(e?.code || "").includes("permission")) toast.error("Permission denied. Please update Firebase rules in console.");
      else toast.error("License verification failed. Please try again.");
    } finally { setLoading(false); }
  };
  if (settingUp) {
    return (
      <div className="page-wrap" style={{ display: "grid", placeItems: "center", gap: 10 }}>
        <LoadingSpinner inline />
        <p style={{ color: "#7B2D8B", fontWeight: 600 }}>Setting up your account...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="page-wrap" style={{ display: "grid", placeItems: "center" }}>
      <div className="glass-card" style={{ width: "min(460px,100%)", padding: 20, borderTop: "4px solid #7B2D8B", display: "grid", gap: 10 }}>
        <h2 style={{ color: "#7B2D8B", display: "flex", gap: 8, alignItems: "center" }}><MdVerifiedUser /> License Verification</h2>
        <input value={licenseId} onChange={(e) => setLicenseId(e.target.value)} placeholder="Enter license ID (e.g. DL001)" style={{ padding: 12, border: "1px solid #E1BEE7", borderRadius: 12 }} />
        <small style={{ color: "#757575" }}>Enter the driver license ID for verification.</small>
        <button className="gradient-btn" onClick={verify} disabled={loading}>{loading ? "Verifying..." : "Verify"}</button>
      </div>
    </motion.div>
  );
};

export default LicenseVerify;
