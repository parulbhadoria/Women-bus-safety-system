import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { db } from "../../firebase";
import AdminLayout from "./AdminLayout";

export default function AdminSosAlerts() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { getDocs(query(collection(db, "sos_alerts"), orderBy("timestamp", "desc"))).then((s) => { setRows(s.docs.map((d) => d.data())); setLoading(false); }); }, []);
  if (loading) return <LoadingSpinner />;
  return <AdminLayout><div className="page-wrap"><div className="glass-card" style={{ padding: 12, overflowX: "auto" }}><h3>SOS Alerts</h3>{!rows.length ? <p>No alerts yet.</p> : <table style={{ width: "100%" }}><thead><tr style={{ background: "#7B2D8B", color: "#fff" }}><th>Timestamp</th><th>Passenger Name</th><th>Bus Number</th><th>Location</th><th>Emergency Contact Emails</th></tr></thead><tbody>{rows.map((r, i) => <tr key={r.alertId || i} style={{ background: i % 2 ? "#FAF0FF" : "#fff" }}><td>{r.timestamp?.toDate ? r.timestamp.toDate().toLocaleString() : "-"}</td><td>{r.passengerName}</td><td>{r.busNumber}</td><td><a href={r.locationLink} target="_blank" rel="noreferrer">View on Map</a></td><td>{r.emergencyContactEmail}</td></tr>)}</tbody></table>}</div></div></AdminLayout>;
}
