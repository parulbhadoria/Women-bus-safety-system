import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaInfoCircle, FaTrash, FaUser } from "react-icons/fa";
import { MdEmail, MdPersonAdd, MdPhone } from "react-icons/md";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

export default function EmergencyContacts() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [form, setForm] = useState({ contactName: "", contactPhone: "", contactEmail: "" });
  const load = async () => {
    if (!currentUser) return;
    const s = await getDoc(doc(db, "users", currentUser.uid));
    setContacts(s.data()?.emergencyContacts || []);
    setLoading(false);
  };
  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  if (loading) return <LoadingSpinner />;
  return (
    <div className="page-wrap" style={{ display: "grid", gap: 12 }}>
      <h2 style={{ color: "#7B2D8B" }}>Emergency Contacts</h2>
      {contacts.map((c, i) => (
        <div key={`${c.contactEmail}-${i}`} className="glass-card" style={{ padding: 12, borderLeft: "4px solid #E91E8C", display: "grid", gap: 4 }}>
          <p><FaUser /> {c.contactName}</p><p><MdPhone /> {c.contactPhone}</p><p><MdEmail /> {c.contactEmail}</p>
          <button onClick={async () => { if (!currentUser) return; setLoading(true); await updateDoc(doc(db, "users", currentUser.uid), { emergencyContacts: arrayRemove(c) }); await load(); }} style={{ border: "1px solid #D32F2F", color: "#D32F2F", background: "#fff", borderRadius: 8, padding: "8px 10px", width: 120 }}><FaTrash /> Delete</button>
        </div>
      ))}
      {contacts.length >= 3 ? <div style={{ background: "#FFF8E1", padding: 10, borderRadius: 10 }}><FaInfoCircle /> Maximum 3 contacts added.</div> : (
        <div className="glass-card" style={{ padding: 14, display: "grid", gap: 8 }}>
          <h3><MdPersonAdd /> Add New Contact</h3>
          <input placeholder="Name" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} style={{ padding: 10, borderRadius: 10, border: "1px solid #E1BEE7" }} />
          <input placeholder="Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} style={{ padding: 10, borderRadius: 10, border: "1px solid #E1BEE7" }} />
          <input placeholder="Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} style={{ padding: 10, borderRadius: 10, border: "1px solid #E1BEE7" }} />
          <button className="gradient-btn" onClick={async () => {
            if (!currentUser) return;
            if (!form.contactName.trim()) return toast.error("Contact name is required");
            if (!/^\d{10}$/.test(form.contactPhone)) return toast.error("Phone must be 10 digits");
            if (!/^\S+@\S+\.\S+$/.test(form.contactEmail)) return toast.error("Enter valid email");
            setLoading(true);
            await updateDoc(doc(db, "users", currentUser.uid), { emergencyContacts: arrayUnion(form) });
            setForm({ contactName: "", contactPhone: "", contactEmail: "" });
            await load();
          }}>Save</button>
        </div>
      )}
    </div>
  );
}
