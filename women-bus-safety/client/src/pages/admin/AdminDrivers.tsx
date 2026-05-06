import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { db } from "../../firebase";
import AdminLayout from "./AdminLayout";

export default function AdminDrivers() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { getDocs(collection(db, "drivers")).then((s) => { setRows(s.docs.map((d) => d.data())); setLoading(false); }); }, []);
  if (loading) return <LoadingSpinner />;
  return <AdminLayout><div className="page-wrap"><div className="glass-card" style={{ padding: 12, overflowX: "auto" }}><h3>Drivers</h3><table style={{ width: "100%" }}><thead><tr style={{ background: "#7B2D8B", color: "#fff" }}><th>Name</th><th>License ID</th><th>Assigned Bus</th><th>Is Active</th></tr></thead><tbody>{rows.map((r, i) => <tr key={r.uid || i} style={{ background: i % 2 ? "#FAF0FF" : "#fff" }}><td>{r.name}</td><td>{r.licenseId}</td><td>{r.assignedBus || "-"}</td><td><span style={{ color: "#fff", padding: "2px 8px", borderRadius: 99, background: r.isActive ? "#388E3C" : "#D32F2F" }}>{r.isActive ? "Yes" : "No"}</span></td></tr>)}</tbody></table></div></div></AdminLayout>;
}
