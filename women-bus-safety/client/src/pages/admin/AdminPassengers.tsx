import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { db } from "../../firebase";
import AdminLayout from "./AdminLayout";

export default function AdminPassengers() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { getDocs(query(collection(db, "users"), where("role", "==", "passenger"))).then((s) => { setRows(s.docs.map((d) => d.data())); setLoading(false); }); }, []);
  if (loading) return <LoadingSpinner />;
  const mask = (v: string = "") => v.length >= 4 ? `${"*".repeat(Math.max(0, v.length - 4))}${v.slice(-4)}` : "****";
  return <AdminLayout><div className="page-wrap"><div className="glass-card" style={{ padding: 12, overflowX: "auto" }}><h3>Passengers</h3><table style={{ width: "100%" }}><thead><tr style={{ background: "#7B2D8B", color: "#fff" }}><th>Name</th><th>Email</th><th>Phone</th><th>Aadhaar Number</th></tr></thead><tbody>{rows.map((r, i) => <tr key={r.uid || i} style={{ background: i % 2 ? "#FAF0FF" : "#fff" }}><td>{r.name}</td><td>{r.email}</td><td>{r.phone}</td><td>{mask(r.aadhaarNumber)}</td></tr>)}</tbody></table></div></div></AdminLayout>;
}
