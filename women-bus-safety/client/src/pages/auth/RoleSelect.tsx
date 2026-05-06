import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBus, FaFemale } from "react-icons/fa";
import { motion } from "framer-motion";

const RoleSelect = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  useEffect(() => {
    if (!state?.uid) navigate("/register", { replace: true });
  }, [state, navigate]);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-wrap" style={{ background: "radial-gradient(circle,#F8F0FF,#EAD1F5)", display: "grid", gap: 16 }}>
      <h2 style={{ color: "#7B2D8B" }}>Choose Registration Type</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
        <button onClick={() => navigate("/register/aadhaar", { state })} style={{ border: "none", borderRadius: 20, padding: 24, color: "#fff", background: "linear-gradient(135deg,#E91E8C,#7B2D8B)" }}>
          <FaFemale size={42} />
          <h3>I am a Passenger</h3>
          <p>Register as a female passenger</p>
        </button>
        <button onClick={() => navigate("/register/license", { state })} style={{ border: "none", borderRadius: 20, padding: 24, color: "#fff", background: "linear-gradient(135deg,#7B2D8B,#4A148C)" }}>
          <FaBus size={42} />
          <h3>I am a Driver</h3>
          <p>Register as a bus driver</p>
        </button>
      </div>
    </motion.div>
  );
};

export default RoleSelect;
