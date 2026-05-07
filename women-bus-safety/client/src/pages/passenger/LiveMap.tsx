import { doc, getDoc, increment, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { onValue, ref } from "firebase/database";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaBus, FaExclamationTriangle, FaFemale, FaRoute } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MapComponent from "../../components/MapComponent";
import { db, rtdb } from "../../firebase";
import { calculateDistance } from "../../utils/haversine";
import { watchLocation } from "../../utils/locationService";

export default function LiveMap() {
  const { state } = useLocation() as any;
  const navigate = useNavigate();
  const [you, setYou] = useState<{ lat: number; lng: number } | null>(null);
  const [bus, setBus] = useState<{ lat: number; lng: number } | null>(null);
  const [femaleCount, setFemaleCount] = useState(0);
  const [threshold, setThreshold] = useState(500);
  const [distance, setDistance] = useState<number>(0);
  const [passengerReady, setPassengerReady] = useState(false);
  const [busReady, setBusReady] = useState(false);
  const [belowThresholdCount, setBelowThresholdCount] = useState(0);
  const completedRef = useRef(false);
  const watchRef = useRef<number | null>(null);
  const unsubscribeBusLocationRef = useRef<(() => void) | null>(null);
  const journeyStartTimeRef = useRef(Date.now());

  const completeJourney = async (manual = false) => {
    if (completedRef.current) return;
    completedRef.current = true;
    await updateDoc(doc(db, "buses", state.busNumber), { femalePassengerCount: increment(-1) });
    await updateDoc(doc(db, "journeys", state.journeyId), { status: "completed", completionTime: serverTimestamp() });
    toast.success(manual ? "Journey completed." : "Journey completed automatically.");
    if (watchRef.current !== null && watchRef.current !== -1) navigator.geolocation.clearWatch(watchRef.current);
    if (unsubscribeBusLocationRef.current) unsubscribeBusLocationRef.current();
    navigate("/passenger/home");
  };

  useEffect(() => {
    if (!state?.busNumber || !state?.journeyId) {
      navigate("/passenger/home");
      return;
    }
    const busRef = ref(rtdb, `bus_locations/${state.busNumber}`);
    const unsubscribeBusLocation = onValue(busRef, (snap) => {
      const d = snap.val();
      if (d?.latitude && d?.longitude) {
        setBus({ lat: d.latitude, lng: d.longitude });
        setBusReady(true);
      }
    });
    unsubscribeBusLocationRef.current = unsubscribeBusLocation;
    watchRef.current = watchLocation(
      (coords) => {
        setYou({ lat: coords.latitude, lng: coords.longitude });
        setPassengerReady(true);
        console.log("LiveMap: passenger location updated", coords);
      },
      (message) => toast.error(message)
    );
    getDoc(doc(db, "app_config", "config")).then((s) => setThreshold(s.data()?.thresholdDistance || 500));
    const unsubBus = onSnapshot(doc(db, "buses", state.busNumber), (s) => setFemaleCount(s.data()?.femalePassengerCount || 0));
    return () => {
      if (unsubscribeBusLocationRef.current) unsubscribeBusLocationRef.current();
      unsubBus();
      if (watchRef.current !== null && watchRef.current !== -1) navigator.geolocation.clearWatch(watchRef.current);
    };
  }, [state, navigate]);

  useEffect(() => {
    if (!you || !bus || !passengerReady || !busReady) return;
    const d = calculateDistance(you.lat, you.lng, bus.lat, bus.lng);
    setDistance(d);
    if (Date.now() - journeyStartTimeRef.current <= 60000) {
      console.log("Distance:", d, "belowThresholdCount:", belowThresholdCount);
      return;
    }
    if (d <= threshold) {
      setBelowThresholdCount((count) => {
        const next = count + 1;
        console.log("Distance:", d, "belowThresholdCount:", next);
        if (next >= 5) completeJourney();
        return next;
      });
    } else {
      console.log("Distance:", d, "belowThresholdCount:", 0);
      setBelowThresholdCount(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [you, bus, threshold, passengerReady, busReady, belowThresholdCount]);

  const markers = useMemo(() => {
    const out: { lat: number; lng: number; label: string }[] = [];
    if (you) out.push({ lat: you.lat, lng: you.lng, label: "You" });
    if (bus) out.push({ lat: bus.lat, lng: bus.lng, label: `Bus ${state?.busNumber || ""}` });
    return out;
  }, [you, bus, state]);

  return (
    <div className="page-wrap" style={{ display: "grid", gap: 12, paddingBottom: 80 }}>
      <div className="glass-card" style={{ padding: 12, display: "grid", gap: 8 }}>
        <strong><FaBus /> Bus: {state?.busNumber}</strong>
        <span><FaFemale /> Female Count: {femaleCount}</span>
        <span><FaRoute /> Distance: {Math.round(distance)} meters</span>
        <button className="gradient-btn" style={{ background: "linear-gradient(135deg,#388E3C,#69F0AE)", color: "#fff" }} onClick={() => completeJourney(true)}>Complete Journey</button>
      </div>
      {markers.length ? <MapComponent center={[markers[0].lat, markers[0].lng]} zoom={15} markers={markers} height="60vh" /> : <p>Waiting for location updates...</p>}
      <button onClick={() => navigate("/passenger/sos", { state: { busNumber: state?.busNumber } })} style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000, background: "#FF1744", color: "white", padding: "16px", fontSize: "18px", fontWeight: "bold", border: "none", borderRadius: 0, width: "100%", cursor: "pointer", animation: "pulse 1s infinite" }}><FaExclamationTriangle /> SOS EMERGENCY</button>
      <style>{`@keyframes pulse { 0% { transform: scale(1) } 50% { transform: scale(1.02) } 100% { transform: scale(1) } }`}</style>
    </div>
  );
}
