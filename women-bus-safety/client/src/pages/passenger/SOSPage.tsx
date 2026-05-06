import { doc, getDoc, serverTimestamp, setDoc, collection } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { sendSOSEmail } from "../../utils/emailService";

export default function SOSPage() {
  const { currentUser, userData } = useAuth();
  const { state } = useLocation() as any;
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const busNumber = state?.busNumber || "Unknown";

  useEffect(() => {
    if (!currentUser) return;
    navigator.geolocation.getCurrentPosition((p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }), () => toast.error("Location unavailable"));
    if (userData?.name) {
      setName(userData.name || "Passenger");
      setContacts(userData.emergencyContacts || []);
      setLoading(false);
    } else {
      getDoc(doc(db, "users", currentUser.uid)).then((s) => {
        setName(s.data()?.name || "Passenger");
        setContacts(s.data()?.emergencyContacts || []);
        setLoading(false);
      });
    }
  }, [currentUser, userData]);

  const locationLink = useMemo(() => coords ? `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=18/${coords.lat}/${coords.lng}` : "", [coords]);
  const submit = async () => {
    if (!currentUser || !coords) return;
    setSending(true);
    let allSuccess = true;
    const contactEmails: string[] = [];
    for (const c of contacts) {
      if (!c.contactEmail) continue;
      contactEmails.push(c.contactEmail);
      const result = await sendSOSEmail(name, busNumber, c.contactEmail, coords.lat, coords.lng);
      if (!result.success) allSuccess = false;
    }
    const alertRef = doc(collection(db, "sos_alerts"));
    await setDoc(alertRef, { alertId: alertRef.id, userId: currentUser.uid, passengerName: name, busNumber, latitude: coords.lat, longitude: coords.lng, timestamp: serverTimestamp(), emergencyContactEmail: contactEmails.join(","), status: "sent", locationLink });
    if (allSuccess) { toast.success("Emergency alert sent successfully."); setSent(true); }
    else { toast.error("Emergency recorded but email delivery failed."); setFailed(true); }
    setSending(false);
  };
  if (loading) return <LoadingSpinner />;
  if (!contacts.length) return <div className="page-wrap"><p>You have no emergency contacts. Please add contacts first.</p><button className="gradient-btn" onClick={() => navigate("/passenger/contacts")}>Go to Contacts</button></div>;
  return (
    <div className="page-wrap" style={{ minHeight: "100vh", background: "linear-gradient(180deg,#8E0038,#E91E8C)", color: "#fff", display: "grid", placeItems: "center", gap: 12 }}>
      <FaShieldAlt size={54} />
      <h1>Emergency SOS</h1>
      <p>{name} | Bus: {busNumber}</p>
      {sending ? <LoadingSpinner inline /> : <button className="danger-btn pulse" style={{ background: "#fff", color: "#D32F2F" }} onClick={submit}>Send SOS Alert</button>}
      {sent && <p style={{ display: "flex", alignItems: "center", gap: 8 }}><FaCheckCircle /> Emergency alert sent successfully</p>}
      {failed && <button className="gradient-btn" onClick={submit}>Retry</button>}
    </div>
  );
}
