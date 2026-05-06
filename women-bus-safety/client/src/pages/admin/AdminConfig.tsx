import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { db } from "../../firebase";
import AdminLayout from "./AdminLayout";

export default function AdminConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thresholdDistance, setThresholdDistance] = useState(500);
  useEffect(() => { getDoc(doc(db, "app_config", "config")).then((s) => { setThresholdDistance(s.data()?.thresholdDistance || 500); setLoading(false); }); }, []);
  if (loading) return <LoadingSpinner />;
  return <AdminLayout><div className="page-wrap"><div className="glass-card" style={{ padding: 16, width: "min(600px,100%)" }}><h2><MdSettings /> Threshold Configuration</h2><div style={{ background: "#F3E5F5", borderRadius: 8, padding: 10, marginBottom: 10 }}>When a passenger comes within this many meters of the bus, their journey will auto-complete and female count will decrease.</div><div style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="number" value={thresholdDistance} onChange={(e) => setThresholdDistance(Number(e.target.value || 0))} style={{ padding: 10, border: "1px solid #7B2D8B", borderRadius: 10 }} /><span>meters</span></div><button className="gradient-btn" style={{ marginTop: 10 }} disabled={saving} onClick={async () => { setSaving(true); await updateDoc(doc(db, "app_config", "config"), { thresholdDistance }); toast.success("Threshold updated successfully"); setSaving(false); }}>Save</button></div></div></AdminLayout>;
}
