import { addDoc, collection, doc, getDoc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import { get, ref } from "firebase/database";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowRight, FaBus, FaBusAlt, FaFemale, FaMapMarkerAlt, FaSyncAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { db, getReadableFirebaseError, rtdb } from "../../firebase";
import { calculateDistance } from "../../utils/haversine";
import { sendBoardingEmail } from "../../utils/emailService";

type Bus = { busNumber: string; latitude: number; longitude: number; distance: number; femalePassengerCount: number };
export default function NearbyBuses() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();
  const load = async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (p) => {
      try {
        const current = { lat: p.coords.latitude, lng: p.coords.longitude };
        setCoords(current);
        const snap = await get(ref(rtdb, "bus_locations"));
        const raw = snap.val() || {};
        const entries = Object.entries(raw).filter(([, d]: any) => d?.isActive);
        const list: Bus[] = [];
        for (const [busNumber, d] of entries as any[]) {
          const busDoc = await getDoc(doc(db, "buses", busNumber));
          list.push({ busNumber, latitude: d.latitude, longitude: d.longitude, distance: calculateDistance(current.lat, current.lng, d.latitude, d.longitude), femalePassengerCount: busDoc.data()?.femalePassengerCount || 0 });
        }
        setBuses(list.sort((a, b) => a.distance - b.distance));
      } catch (error: any) {
        toast.error(getReadableFirebaseError(error));
      }
      setLoading(false);
    }, () => { toast.error("Please enable location access to see nearby buses"); setLoading(false); });
  };
  useEffect(() => { load(); }, []);
  if (loading) return <LoadingSpinner />;
  return (
    <div className="page-wrap" style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, rgba(123,45,139,0.85), rgba(233,30,140,0.75)), url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80) center/cover no-repeat", color: "#fff", borderRadius: 16, padding: 16 }}>
        <h2><FaBus /> Find Nearby Buses</h2>
        <button className="gradient-btn" onClick={load}><FaSyncAlt /> Refresh</button>
      </div>
      {!buses.length ? <div className="glass-card" style={{ padding: 24, textAlign: "center" }}><FaBusAlt size={40} /><p>No active buses found nearby. Please wait for a driver to go on duty.</p></div> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
        {buses.map((bus, index) => {
          const level = bus.femalePassengerCount < 3 ? "Low" : bus.femalePassengerCount <= 7 ? "Medium" : "High";
          const levelColor = level === "Low" ? "#FF5252" : level === "Medium" ? "#FFD740" : "#69F0AE";
          return (
            <motion.div key={bus.busNumber} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card" style={{ padding: 16 }}>
              <div style={{ height: 8, borderRadius: 8, background: levelColor, marginBottom: 8 }} />
              <h3><FaBus /> {bus.busNumber}</h3>
              <p><FaMapMarkerAlt /> {bus.distance < 1000 ? `${Math.round(bus.distance)} m` : `${(bus.distance / 1000).toFixed(2)} km`}</p>
              <p><FaFemale /> Female Count: {bus.femalePassengerCount}</p>
              <span style={{ padding: "4px 10px", borderRadius: 99, background: levelColor }}>{level}</span>
              <button className="gradient-btn" style={{ marginTop: 10 }} onClick={async () => {
                if (!currentUser || !coords) return;
                try {
                  await updateDoc(doc(db, "buses", bus.busNumber), { femalePassengerCount: increment(1) });
                  const journeyRef = await addDoc(collection(db, "journeys"), { passengerId: currentUser.uid, busNumber: bus.busNumber, source: "Current Location", destination: "Destination", boardingTime: serverTimestamp(), completionTime: null, status: "active" });
                  await updateDoc(doc(db, "journeys", journeyRef.id), { journeyId: journeyRef.id });
                  const userSnap = await getDoc(doc(db, "users", currentUser.uid));
                  const contacts = userSnap.data()?.emergencyContacts || [];
                  for (const c of contacts) if (c.contactEmail) await sendBoardingEmail(userSnap.data()?.name || "Passenger", bus.busNumber, c.contactEmail, bus.latitude, bus.longitude);
                  navigate("/passenger/map", { state: { busNumber: bus.busNumber, journeyId: journeyRef.id } });
                } catch { toast.error("Could not board bus right now"); }
              }}><FaArrowRight /> Board This Bus</button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
