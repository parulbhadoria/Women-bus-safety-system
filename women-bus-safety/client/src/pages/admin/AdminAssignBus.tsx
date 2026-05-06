import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdAssignment } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { db } from "../../firebase";
import AdminLayout from "./AdminLayout";

export default function AdminAssignBus() {
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [driverUid, setDriverUid] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const load = async () => { const s = await getDocs(collection(db, "drivers")); setDrivers(s.docs.map((d) => d.data())); setLoading(false); };
  useEffect(() => { load(); }, []);
  return <AdminLayout><div className="page-wrap">{loading ? "Loading..." : <div className="glass-card" style={{ width: "min(560px,100%)", padding: 16 }}><h2><MdAssignment /> Assign Bus to Driver</h2><select value={driverUid} onChange={(e) => setDriverUid(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #7B2D8B", borderRadius: 10 }}>{drivers.map((d) => <option key={d.uid} value={d.uid}>{d.name} ({d.licenseId})</option>)}</select><input value={busNumber} onChange={(e) => setBusNumber(e.target.value)} placeholder="Bus Number" style={{ width: "100%", marginTop: 10, padding: 10, border: "1px solid #7B2D8B", borderRadius: 10 }} /><button className="gradient-btn" style={{ marginTop: 10 }} disabled={assigning} onClick={async () => { if (!driverUid || !busNumber.trim()) return toast.error("Choose driver and bus number"); setAssigning(true); try { await api.post("/api/admin/assign-bus", { driverUid, busNumber }); toast.success("Bus assigned successfully"); await load(); } catch { toast.error("Unable to assign bus right now"); } setAssigning(false); }}>Assign</button></div>}</div></AdminLayout>;
}
