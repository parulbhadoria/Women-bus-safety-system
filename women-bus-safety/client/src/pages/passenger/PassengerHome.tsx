import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
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
    const run = async () => {
      if (!currentUser) return;
      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      setName(userSnap.data()?.name || "Passenger");
      const q = query(collection(db, "journeys"), where("passengerId", "==", currentUser.uid), where("status", "==", "active"));
      const js = await getDocs(q);
      setHasActiveJourney(!js.empty);
      setLoading(false);
    };
    run();
  }, [currentUser]);
  if (loading) return <LoadingSpinner />;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-wrap" style={{ display: "grid", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg, rgba(123,45,139,0.85), rgba(233,30,140,0.75)), url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80) center/cover no-repeat", color: "#fff", borderRadius: 16, padding: 20 }}>
        <h2>Welcome back, {name}</h2><p>Stay safe on every journey.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        <button className="gradient-btn" onClick={() => navigate("/passenger/buses")}><MdDirectionsBus /> Find Nearby Buses</button>
        <button className="gradient-btn" onClick={() => navigate("/passenger/contacts")}><MdContacts /> Emergency Contacts</button>
        {hasActiveJourney && <button className="gradient-btn" onClick={() => navigate("/passenger/journey")}><MdDirections /> View Active Journey</button>}
      </div>
      <button className="danger-btn pulse" onClick={() => navigate("/passenger/sos")} style={{ width: "100%", position: "sticky", bottom: 10 }}><MdSos size={22} /> SOS</button>
    </motion.div>
  );
}
