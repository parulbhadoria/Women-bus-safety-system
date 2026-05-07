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
  return (
    <AdminLayout>
      <div className="page-wrap min-h-screen">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-yellow-100 p-3 rounded-full">
              <MdDashboard className="text-2xl text-yellow-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Monitor and manage the safety system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {[
            { 
              l: "Total Buses", 
              v: stats.totalBuses, 
              i: <FaBus />, 
              c: "purple",
              bg: "from-purple-500 to-purple-600",
              iconBg: "bg-purple-100"
            }, 
            { 
              l: "Active Buses", 
              v: stats.activeBuses, 
              i: <MdGpsFixed />, 
              c: "green",
              bg: "from-green-500 to-green-600", 
              iconBg: "bg-green-100"
            }, 
            { 
              l: "Total Passengers", 
              v: stats.passengers, 
              i: <FaUsers />, 
              c: "pink",
              bg: "from-pink-500 to-pink-600",
              iconBg: "bg-pink-100"
            }, 
            { 
              l: "Total Drivers", 
              v: stats.drivers, 
              i: <FaIdCard />, 
              c: "blue",
              bg: "from-blue-500 to-blue-600",
              iconBg: "bg-blue-100"
            }, 
            { 
              l: "SOS Today", 
              v: stats.sosToday, 
              i: <FaBell />, 
              c: "red",
              bg: "from-red-500 to-red-600",
              iconBg: "bg-red-100"
            }
          ].map((stat) => (
            <div key={stat.l} className="glass-card p-6 hover:shadow-colored transition-all duration-300 group">
              <div className={`${stat.iconBg} p-3 rounded-full inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`text-${stat.c}-600`}>
                  {stat.i}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className={`text-3xl font-bold text-${stat.c}-600`}>{stat.v}</h3>
                <p className="text-sm text-gray-600 font-medium">{stat.l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              User Management
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Passengers</span>
                <span className="text-sm font-bold text-purple-600">{stats.passengers}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Drivers</span>
                <span className="text-sm font-bold text-blue-600">{stats.drivers}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
              Fleet Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Buses</span>
                <span className="text-sm font-bold text-purple-600">{stats.totalBuses}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Active Buses</span>
                <span className="text-sm font-bold text-green-600">{stats.activeBuses}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Alerts */}
        {stats.sosToday > 0 && (
          <div className="mt-6 glass-card p-6 border-l-4 border-red-400 bg-red-50">
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FaBell className="text-xl text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Safety Alerts</h3>
                <p className="text-gray-600 mb-3">
                  There are <span className="font-bold text-red-600">{stats.sosToday}</span> SOS alerts reported today. 
                  Please review and take appropriate action.
                </p>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  View SOS Alerts
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
