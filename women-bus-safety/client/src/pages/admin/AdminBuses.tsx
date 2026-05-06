import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { db } from "../../firebase";
import AdminLayout from "./AdminLayout";

export default function AdminBuses() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const load = async () => { const snap = await getDocs(collection(db, "buses")); setRows(snap.docs.map((d) => d.data())); setLoading(false); };
  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, []);
  if (loading) return <LoadingSpinner />;
  return <AdminLayout><div className="page-wrap"><div className="glass-card" style={{ padding: 12, overflowX: "auto" }}><h3>Buses</h3><table style={{ width: "100%" }}><thead><tr style={{ background: "#7B2D8B", color: "#fff" }}><th>Bus Number</th><th>Is Active</th><th>Female Passenger Count</th><th>Assigned Driver UID</th></tr></thead><tbody>{rows.map((r, i) => <tr key={r.busNumber || i} style={{ background: i % 2 ? "#FAF0FF" : "#fff" }}><td>{r.busNumber}</td><td><span style={{ color: "#fff", padding: "2px 8px", borderRadius: 99, background: r.isActive ? "#388E3C" : "#D32F2F" }}>{r.isActive ? "Yes" : "No"}</span></td><td>{r.femalePassengerCount || 0}</td><td>{r.assignedDriverUid || "-"}</td></tr>)}</tbody></table></div></div></AdminLayout>;
}
