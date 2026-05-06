import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdVerifiedUser } from "react-icons/md";
import api from "../../utils/api";
import { db } from "../../firebase";

const AadhaarVerify = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { state } = useLocation() as any;
  const navigate = useNavigate();
  const verify = async () => {
    if (!/^\d{12}$/.test(aadhaarNumber)) return toast.error("Enter valid 12 digit Aadhaar");
    setLoading(true);
    try {
      if (!state?.uid) return navigate("/register");
      const { data } = await api.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-aadhaar`, { aadhaarNumber });
      if (data.gender !== "Female") return toast.error("Only female passengers can register");
      await setDoc(doc(db, "users", state.uid), {
        uid: state.uid, name: state.name, email: state.email, phone: state.phone,
        role: "passenger", emergencyContacts: [], aadhaarNumber,
      });
      navigate("/passenger/home");
    } catch (e: any) {
      if (e?.response?.status === 404) toast.error("Aadhaar number not found in records");
      else if (String(e?.code || "").includes("permission")) toast.error("Permission denied. Please update Firebase rules in console.");
      else toast.error("Aadhaar verification failed. Please try again.");
    } finally { setLoading(false); }
  };
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
