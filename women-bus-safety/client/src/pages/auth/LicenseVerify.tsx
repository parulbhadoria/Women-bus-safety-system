import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdVerifiedUser } from "react-icons/md";
import api from "../../utils/api";
import { db } from "../../firebase";

const LicenseVerify = () => {
  const [licenseId, setLicenseId] = useState("");
  const [loading, setLoading] = useState(false);
  const { state } = useLocation() as any;
  const navigate = useNavigate();
  const verify = async () => {
    if (!licenseId.trim()) return toast.error("Enter a valid license ID");
    setLoading(true);
    try {
      if (!state?.uid) return navigate("/register");
      await api.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-license`, { licenseId });
      await setDoc(doc(db, "users", state.uid), { uid: state.uid, name: state.name, email: state.email, phone: state.phone, role: "driver", emergencyContacts: [] });
      await setDoc(doc(db, "drivers", state.uid), { uid: state.uid, name: state.name, licenseId, assignedBus: "", isActive: false });
      navigate("/driver/home");
    } catch (e: any) {
      if (e?.response?.status === 404) toast.error("License ID not found");
      else if (String(e?.code || "").includes("permission")) toast.error("Permission denied. Please update Firebase rules in console.");
      else toast.error("License verification failed. Please try again.");
    } finally { setLoading(false); }
  };
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
