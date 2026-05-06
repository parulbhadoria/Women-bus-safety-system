import { doc, getDoc } from "firebase/firestore";
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
  const [name, setName] = useState("");
  const [assignedBus, setAssignedBus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      if (!currentUser) return;
      const driverSnap = await getDoc(doc(db, "drivers", currentUser.uid));
      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      setName(userSnap.data()?.name || driverSnap.data()?.name || "Driver");
      setAssignedBus(driverSnap.data()?.assignedBus || "");
      setLoading(false);
    };
    run();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-wrap" style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "linear-gradient(135deg, rgba(123,45,139,0.85), rgba(233,30,140,0.75)), url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80) center/cover no-repeat", color: "#fff", borderRadius: 16, padding: 24 }}>
        <h2>Welcome, {name}</h2><p>Managing your duty with care</p>
      </div>
      {assignedBus ? (
        <div className="glass-card" style={{ padding: 20, borderLeft: "6px solid #388E3C" }}>
          <h3 style={{ display: "flex", gap: 8, alignItems: "center" }}><FaBus /> Assigned Bus</h3>
          <strong style={{ color: "#388E3C", fontSize: 28 }}>{assignedBus}</strong>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 20, borderLeft: "6px solid #FFD740" }}>
          <h3 style={{ display: "flex", gap: 8, alignItems: "center" }}><FaExclamationTriangle /> No bus assigned yet. Please contact admin.</h3>
        </div>
      )}
      <button className="gradient-btn" style={{ maxWidth: 380 }} onClick={() => navigate("/driver/duty")} disabled={!assignedBus}><FaPlay /> Go On Duty</button>
    </motion.div>
  );
}
