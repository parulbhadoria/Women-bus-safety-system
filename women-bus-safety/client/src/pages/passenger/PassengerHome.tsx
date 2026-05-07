import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MdContacts, MdDirections, MdDirectionsBus, MdSos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

export default function PassengerHome() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [hasActiveJourney, setHasActiveJourney] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) return;
    const userUnsub = onSnapshot(doc(db, "users", currentUser.uid), (userSnap) => {
      setName(userSnap.data()?.name || "Passenger");
      setLoading(false);
    });
    const q = query(collection(db, "journeys"), where("passengerId", "==", currentUser.uid), where("status", "==", "active"));
    const journeyUnsub = onSnapshot(q, (js) => setHasActiveJourney(!js.empty));
    return () => {
      userUnsub();
      journeyUnsub();
    };
  }, [currentUser]);
  if (loading) return <LoadingSpinner />;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-wrap" style={{ display: "grid", gap: 14, paddingBottom: 80 }}>
      <div style={{ background: "linear-gradient(135deg, rgba(123,45,139,0.85), rgba(233,30,140,0.75)), url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80) center/cover no-repeat", color: "#fff", borderRadius: 16, padding: 20 }}>
        <h2>Welcome, {name}. Stay safe on every journey.</h2>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <button className="gradient-btn" style={{ width: "100%", borderRadius: 12, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }} onClick={() => navigate("/passenger/buses")}><MdDirectionsBus /> Find Nearby Buses</button>
        <button className="gradient-btn" style={{ width: "100%", borderRadius: 12, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }} onClick={() => navigate("/passenger/contacts")}><MdContacts /> Emergency Contacts</button>
        {hasActiveJourney && <button className="gradient-btn" style={{ width: "100%", borderRadius: 12, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }} onClick={() => navigate("/passenger/journey")}><MdDirections /> View Active Journey</button>}
      </div>
      <button onClick={() => navigate("/passenger/sos")} style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000, background: "#FF1744", color: "white", padding: "16px", fontSize: "18px", fontWeight: "bold", border: "none", borderRadius: 0, width: "100%", cursor: "pointer", animation: "pulse 1s infinite" }}><MdSos size={22} /> SOS EMERGENCY</button>
      <style>{`@keyframes pulse { 0% { transform: scale(1) } 50% { transform: scale(1.02) } 100% { transform: scale(1) } }`}</style>
    </motion.div>
  );
}
