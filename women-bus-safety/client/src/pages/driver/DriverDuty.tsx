import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaStop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MapComponent from "../../components/MapComponent";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { db, rtdb } from "../../firebase";

export default function DriverDuty() {
  const { currentUser } = useAuth();
  const [busNumber, setBusNumber] = useState("");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [updates, setUpdates] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const lastWriteRef = useRef(0);
  const navigate = useNavigate();

  const markers = useMemo(() => (loc ? [{ lat: loc.lat, lng: loc.lng, label: `Bus ${busNumber}` }] : []), [loc, busNumber]);

  useEffect(() => {
    const init = async () => {
      if (!currentUser) return;
      const driverSnap = await getDoc(doc(db, "drivers", currentUser.uid));
      const assignedBus = driverSnap.data()?.assignedBus || "";
      setBusNumber(assignedBus);
      if (!assignedBus) return;
      await updateDoc(doc(db, "drivers", currentUser.uid), { isActive: true });
      await updateDoc(doc(db, "buses", assignedBus), { isActive: true, femalePassengerCount: increment(0) });
      window.addEventListener("beforeunload", handleBeforeUnload);
      navigator.geolocation.getCurrentPosition(
        (p) => setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => setPermissionDenied(true),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      watchIdRef.current = navigator.geolocation.watchPosition((p) => {
        const next = { lat: p.coords.latitude, lng: p.coords.longitude };
        setLoc(next);
        const now = Date.now();
        if (now - lastWriteRef.current >= 5000 && currentUser && assignedBus) {
          lastWriteRef.current = now;
          set(ref(rtdb, `bus_locations/${assignedBus}`), { latitude: next.lat, longitude: next.lng, timestamp: now, driverUid: currentUser.uid, isActive: true });
          setUpdates((v) => v + 1);
        }
      }, () => setPermissionDenied(true), { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    };
    init();
    return () => {
      cleanup();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "You are currently sharing your bus location. Are you sure you want to leave?";
  };

  const cleanup = async () => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    if (busNumber && currentUser) {
      await set(ref(rtdb, `bus_locations/${busNumber}`), { isActive: false, driverUid: currentUser.uid, timestamp: Date.now(), latitude: loc?.lat || 0, longitude: loc?.lng || 0 });
      await updateDoc(doc(db, "drivers", currentUser.uid), { isActive: false });
      try { await updateDoc(doc(db, "buses", busNumber), { isActive: false }); } catch {}
    }
  };

  if (!busNumber) return <LoadingSpinner />;
  if (permissionDenied) return <div className="page-wrap"><p>Please enable location access in your browser settings to share bus location. Check your browser address bar for a location icon.</p></div>;

  return (
    <div className="page-wrap" style={{ display: "grid", gap: 12 }}>
      <div className="glass-card" style={{ padding: 14, borderLeft: "6px solid #388E3C" }}>
        <strong>Sharing Location</strong> | Bus: {busNumber} | Updates Sent: {updates}
      </div>
      {loc ? <MapComponent center={[loc.lat, loc.lng]} zoom={15} markers={markers} height="55vh" /> : <LoadingSpinner />}
      <button className="danger-btn" onClick={async () => { await cleanup(); toast.success("Duty ended"); navigate("/driver/home"); }}><FaStop /> End Duty</button>
    </div>
  );
}
