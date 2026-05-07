import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBus, FaExclamationTriangle, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

export default function DriverHome() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState("");
  const [assignedBus, setAssignedBus] = useState("");
  const [isOnDuty, setIsOnDuty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, "drivers", currentUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAssignedBus(data.assignedBus || "");
        setDriverName(data.name || "");
        setIsOnDuty(data.isActive || false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-wrap" style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "linear-gradient(135deg, rgba(123,45,139,0.85), rgba(233,30,140,0.75)), url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80) center/cover no-repeat", color: "#fff", borderRadius: 16, padding: 24 }}>
        <h2>Welcome, {driverName || "Driver"}</h2>
      </div>
      {!assignedBus ? (
        <div className="glass-card" style={{ padding: 20, borderLeft: "6px solid orange", background: "#FFF3E0" }}>
          <h3 style={{ display: "flex", gap: 8, alignItems: "center" }}><FaExclamationTriangle /> No bus assigned yet. Please wait for admin to assign your bus.</h3>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 20, borderLeft: "6px solid #388E3C", background: "#E8F5E9", display: "grid", gap: 12 }}>
          <h3 style={{ display: "flex", gap: 8, alignItems: "center" }}><FaBus /> Bus Number</h3>
          <strong style={{ color: "#388E3C", fontSize: 28 }}>{assignedBus}</strong>
          <button className="gradient-btn" style={{ maxWidth: 280 }} onClick={() => navigate("/driver/duty")}><FaPlay /> {isOnDuty ? "Resume Duty" : "Go On Duty"}</button>
        </div>
      )}
    </motion.div>
  );
}
