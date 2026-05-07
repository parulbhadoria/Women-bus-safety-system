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

const AadhaarVerify = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const { state } = useLocation() as any;
  const navigate = useNavigate();
  const { forceRefresh } = useContext(AuthContext);
  const verify = async () => {
    if (!/^\d{12}$/.test(aadhaarNumber)) return toast.error("Enter valid 12 digit Aadhaar");
    setLoading(true);
    try {
      if (!state?.uid) return navigate("/register");
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-aadhaar`;
      const payload = { aadhaarNumber: aadhaarNumber.trim() };
      console.log("verify-aadhaar request", { url, payload });
      const { data } = await api.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (data.gender !== "Female") return toast.error("Only female passengers can register");
      await setDoc(doc(db, "users", state.uid), {
        uid: state.uid, name: state.name, email: state.email, phone: state.phone,
        role: "passenger", emergencyContacts: [], aadhaarNumber: aadhaarNumber.trim(),
      });
      setSettingUp(true);
      await forceRefresh();
      navigate("/passenger/home");
    } catch (e: any) {
      if (e?.response?.status === 403) toast.error("Only female passengers can register");
      else if (e?.response?.status === 404) toast.error("Aadhaar number not found in records");
      else if (!e?.response) toast.error("Cannot connect to server. Make sure the backend is running.");
      else if (e?.response?.data?.error) toast.error(e.response.data.error);
      else if (String(e?.code || "").includes("permission")) toast.error("Permission denied. Please update Firebase rules in console.");
      else toast.error("Aadhaar verification failed. Please try again.");
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
        <h2 style={{ color: "#7B2D8B", display: "flex", gap: 8, alignItems: "center" }}><MdVerifiedUser /> Aadhaar Verification</h2>
        <input value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} placeholder="Enter 12 digit Aadhaar number" style={{ padding: 12, border: "1px solid #E1BEE7", borderRadius: 12 }} />
        <small style={{ color: "#757575" }}>Enter 12-digit Aadhaar number to verify female passenger eligibility.</small>
        <button className="gradient-btn" onClick={verify} disabled={loading}>{loading ? "Verifying..." : "Verify"}</button>
      </div>
    </motion.div>
  );
};

export default AadhaarVerify;
