import { collection, doc, getDoc, getDocs, increment, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { db, rtdb } from "../../firebase";
import { calculateDistance } from "../../utils/haversine";

export default function JourneyStatus() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [journey, setJourney] = useState<any>(null);
  const [femaleCount, setFemaleCount] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const run = async () => {
      if (!currentUser) return;
      const q = query(collection(db, "journeys"), where("passengerId", "==", currentUser.uid), where("status", "==", "active"));
      const js = await getDocs(q);
      if (js.empty) { setLoading(false); return; }
      const j = js.docs[0].data();
      setJourney(j);
      const bus = await getDoc(doc(db, "buses", j.busNumber));
      setFemaleCount(bus.data()?.femalePassengerCount || 0);
      const computeDistance = async () => {
        navigator.geolocation.getCurrentPosition(async (p) => {
          const bs = await get(ref(rtdb, `bus_locations/${j.busNumber}`));
          const b = bs.val();
          if (b?.latitude) setDistance(calculateDistance(p.coords.latitude, p.coords.longitude, b.latitude, b.longitude));
        });
      };
      await computeDistance();
      interval = setInterval(computeDistance, 5000);
      setLoading(false);
    };
    run().catch(() => {
      toast.error("Unable to load active journey");
      setLoading(false);
    });
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;
  if (!journey) return <div className="page-wrap">No active journey found.</div>;

  return (
    <div className="page-wrap" style={{ display: "grid", gap: 8 }}>
      <h2>Journey Status</h2>
      <div className="glass-card" style={{ padding: 16, display: "grid", gap: 6 }}>
        <p>Bus Number: {journey.busNumber}</p>
        <p>Source: {journey.source}</p>
        <p>Destination: {journey.destination}</p>
        <p>Boarding Time: {journey.boardingTime?.toDate ? journey.boardingTime.toDate().toLocaleString() : new Date(journey.boardingTime).toLocaleString()}</p>
        <p>Female Passenger Count: {femaleCount}</p>
        <p>Distance to Bus: {distance ? `${Math.round(distance)} m` : "N/A"}</p>
        <button className="gradient-btn" onClick={async () => {
          await updateDoc(doc(db, "buses", journey.busNumber), { femalePassengerCount: increment(-1) });
          await updateDoc(doc(db, "journeys", journey.journeyId), { status: "completed", completionTime: serverTimestamp() });
          toast.success("Journey completed");
          navigate("/passenger/home");
        }}>Complete Journey</button>
      </div>
    </div>
  );
}
