import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaBell, FaBus, FaIdCard, FaUsers } from "react-icons/fa";
import { MdDashboard, MdGpsFixed } from "react-icons/md";
import LoadingSpinner from "../../components/LoadingSpinner";
import { db } from "../../firebase";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBuses: 0, activeBuses: 0, passengers: 0, drivers: 0, sosToday: 0 });
  useEffect(() => {
    const run = async () => {
      const buses = await getDocs(collection(db, "buses"));
      const users = await getDocs(query(collection(db, "users"), where("role", "==", "passenger")));
      const drivers = await getDocs(collection(db, "drivers"));
      const alerts = await getDocs(collection(db, "sos_alerts"));
      const today = new Date(); today.setHours(0, 0, 0, 0);
      setStats({
        totalBuses: buses.size,
        activeBuses: buses.docs.filter((d) => d.data().isActive).length,
        passengers: users.size,
        drivers: drivers.size,
        sosToday: alerts.docs.filter((d) => d.data().timestamp?.toDate?.() >= today).length,
      });
      setLoading(false);
    };
    run();
  }, []);
  if (loading) return <LoadingSpinner />;
  return <AdminLayout><div className="page-wrap"><h2><MdDashboard /> Admin Dashboard</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
    {[{ l: "Total Buses", v: stats.totalBuses, i: <FaBus />, c: "#7B2D8B" }, { l: "Active Buses", v: stats.activeBuses, i: <MdGpsFixed />, c: "#388E3C" }, { l: "Total Passengers", v: stats.passengers, i: <FaUsers />, c: "#E91E8C" }, { l: "Total Drivers", v: stats.drivers, i: <FaIdCard />, c: "#2196F3" }, { l: "SOS Today", v: stats.sosToday, i: <FaBell />, c: "#D32F2F" }].map((s) => <div key={s.l} className="glass-card" style={{ padding: 14, borderTop: `4px solid ${s.c}` }}><div style={{ color: s.c }}>{s.i}</div><h3>{s.v}</h3><p>{s.l}</p></div>)}
  </div></div></AdminLayout>;
}
