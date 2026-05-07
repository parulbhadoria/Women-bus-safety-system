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
import { getCurrentLocation, watchLocation } from "../../utils/locationService";

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

      await set(ref(rtdb, `bus_locations/${assignedBus}`), {
        isActive: true,
        latitude: 0,
        longitude: 0,
        timestamp: Date.now(),
        driverUid: currentUser.uid,
      });

      window.addEventListener("beforeunload", handleBeforeUnload);
      try {
        const initial = await getCurrentLocation();
        setLoc({ lat: initial.latitude, lng: initial.longitude });
      } catch {
        setPermissionDenied(true);
      }
      watchIdRef.current = watchLocation(
        (coords) => {
          const next = { lat: coords.latitude, lng: coords.longitude };
          setLoc(next);
          const now = Date.now();
          if (now - lastWriteRef.current >= 5000 && currentUser && assignedBus) {
            lastWriteRef.current = now;
            console.log("DriverDuty: writing location to RTDB", next);
            set(ref(rtdb, `bus_locations/${assignedBus}`), { latitude: next.lat, longitude: next.lng, timestamp: now, driverUid: currentUser.uid, isActive: true });
            setUpdates((v) => v + 1);
          }
        },
        (message) => {
          toast.error(message);
          setPermissionDenied(true);
        }
      );
    };
    init();
    return () => {
      if (watchIdRef.current !== null && watchIdRef.current !== -1) navigator.geolocation.clearWatch(watchIdRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentUser]);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "You are currently sharing bus location. Ending duty will remove the bus from passenger tracking. Are you sure?";
  };

  const cleanup = async () => {
    if (watchIdRef.current !== null && watchIdRef.current !== -1) navigator.geolocation.clearWatch(watchIdRef.current);
  };

  if (!busNumber) return <LoadingSpinner />;
  if (permissionDenied) return <div className="page-wrap"><p>Please enable location access in your browser settings to share bus location. Check your browser address bar for a location icon.</p></div>;

  return (
    <div className="page-wrap" style={{ display: "grid", gap: 12 }}>
      <div className="glass-card" style={{ padding: 14, borderLeft: "6px solid #388E3C" }}>
        <strong>Sharing Location</strong> | Bus: {busNumber} | Updates Sent: {updates}
        <div style={{ marginTop: 6, fontSize: 14 }}>Latitude: {loc?.lat ?? "-"} | Longitude: {loc?.lng ?? "-"}</div>
      </div>
      {loc ? <MapComponent center={[loc.lat, loc.lng]} zoom={15} markers={markers} height="55vh" /> : <LoadingSpinner />}
      <button className="danger-btn" onClick={async () => {
        await cleanup();
        if (busNumber && currentUser) {
          await set(ref(rtdb, `bus_locations/${busNumber}`), { isActive: false, driverUid: currentUser.uid, timestamp: Date.now(), latitude: 0, longitude: 0 });
          await updateDoc(doc(db, "drivers", currentUser.uid), { isActive: false });
          try { await updateDoc(doc(db, "buses", busNumber), { isActive: false }); } catch {}
        }
        toast.success("Duty ended");
        navigate("/driver/home");
      }}><FaStop /> End Duty</button>
    </div>
  );
}
