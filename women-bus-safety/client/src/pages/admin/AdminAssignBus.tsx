import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdAssignment } from "react-icons/md";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import AdminLayout from "./AdminLayout";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminAssignBus() {
  const [loading, setLoading] = useState(true);
  const [driversLoading, setDriversLoading] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [selectedDriverUid, setSelectedDriverUid] = useState("");
  const [selectedBusNumber, setSelectedBusNumber] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [driversSnapshot, busesSnapshot] = await Promise.all([
        getDocs(collection(db, "drivers")),
        getDocs(collection(db, "buses")),
      ]);
      setDrivers(driversSnapshot.docs.map((d) => d.data()));
      setBuses(busesSnapshot.docs.map((d) => d.data()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectedDriver = drivers.find((driver) => driver.uid === selectedDriverUid);

  return (
    <AdminLayout>
      <div className="page-wrap">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="glass-card" style={{ width: "min(560px,100%)", padding: 16, display: "grid", gap: 12 }}>
            <h2><MdAssignment /> Assign Bus to Driver</h2>
            <select value={selectedDriverUid} onChange={(e) => setSelectedDriverUid(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #7B2D8B", borderRadius: 10 }}>
              <option value="">Select driver</option>
              {drivers.map((driver) => (
                <option key={driver.uid} value={driver.uid}>
                  {driver.name} ({driver.licenseId})
                </option>
              ))}
            </select>
            <select value={selectedBusNumber} onChange={(e) => setSelectedBusNumber(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #7B2D8B", borderRadius: 10 }}>
              <option value="">Select bus</option>
              {buses.map((bus) => (
                <option key={bus.busNumber} value={bus.busNumber}>
                  {bus.busNumber}
                </option>
              ))}
            </select>
            <button
              className="gradient-btn"
              disabled={driversLoading}
              onClick={async () => {
                if (!selectedDriverUid || !selectedBusNumber) {
                  toast.error("Please select both a driver and a bus");
                  return;
                }
                setDriversLoading(true);
                try {
                  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/assign-bus`, { driverUid: selectedDriverUid, busNumber: selectedBusNumber });
                  toast.success(`Bus ${selectedBusNumber} assigned to ${selectedDriver?.name || "driver"} successfully`);
                  await load();
                  setSelectedDriverUid("");
                  setSelectedBusNumber("");
                } catch (error: any) {
                  toast.error(error?.response?.data?.error || "Failed to assign bus. Please try again.");
                } finally {
                  setDriversLoading(false);
                }
              }}
            >
              {driversLoading ? "Assigning..." : "Assign"}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
