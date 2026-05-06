import { doc, getDoc } from "firebase/firestore";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import MapComponent from "../../components/MapComponent";
import { db, rtdb } from "../../firebase";
import AdminLayout from "./AdminLayout";

export default function AdminLiveMap() {
  const [markers, setMarkers] = useState<{ lat: number; lng: number; label: string }[]>([]);
  useEffect(() => {
    const node = ref(rtdb, "bus_locations");
    return onValue(node, async (snap) => {
      const v = snap.val() || {};
      const out: { lat: number; lng: number; label: string }[] = [];
      for (const [busNumber, d] of Object.entries(v) as any[]) {
        if (!d?.isActive) continue;
        const busSnap = await getDoc(doc(db, "buses", busNumber));
        out.push({ lat: d.latitude, lng: d.longitude, label: `${busNumber} | Female: ${busSnap.data()?.femalePassengerCount || 0}` });
      }
      setMarkers(out);
    });
  }, []);
  return <AdminLayout><div className="page-wrap">{markers.length ? <MapComponent center={[markers[0].lat, markers[0].lng]} zoom={12} markers={markers} /> : <p>No active buses currently.</p>}</div></AdminLayout>;
}
