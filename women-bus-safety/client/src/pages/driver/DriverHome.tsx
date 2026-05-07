import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBus, FaExclamationTriangle, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

export default function DriverHome() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState("");
  const [assignedBus, setAssignedBus] = useState("");
  const [isOnDuty, setIsOnDuty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, "drivers", currentUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAssignedBus(data.assignedBus || "");
        setDriverName(data.name || "");
        setIsOnDuty(data.isActive || false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="page-wrap min-h-screen"
    >
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 p-8 mb-8 shadow-2xl floating-card">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm">
              <FaBus className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome, {driverName || "Driver"}
              </h1>
              <p className="text-green-100 text-sm md:text-base">
                Ready for a safe journey
              </p>
            </div>
          </div>
          
          {/* Driver Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{isOnDuty ? "Active" : "Standby"}</p>
                <p className="text-xs text-green-100">Status</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{assignedBus || "None"}</p>
                <p className="text-xs text-green-100">Bus</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Safe</p>
                <p className="text-xs text-green-100">Priority</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {!assignedBus ? (
          <div className="md:col-span-2">
            <div className="glass-card p-6 border-l-4 border-orange-400 bg-orange-50">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaExclamationTriangle className="text-xl text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Bus Assigned</h3>
                  <p className="text-gray-600 mb-4">
                    Please wait for the administrator to assign your bus. You'll be notified once a bus is assigned to you.
                  </p>
                  <div className="bg-orange-100 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-orange-700">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Contact your admin for bus assignment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Bus Assignment Card */}
            <div className="glass-card p-6 border-l-4 border-green-400 bg-green-50">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaBus className="text-xl text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Assigned Bus</h3>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-3xl font-bold text-green-600">{assignedBus}</p>
                    <p className="text-sm text-gray-600">Bus Number</p>
                  </div>
                  <div className="flex items-center space-x-2 text-green-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Bus successfully assigned</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Duty Status Card */}
            <div className="glass-card p-6">
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                  <FaPlay className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Duty Status</h3>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                  isOnDuty 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {isOnDuty ? "Currently On Duty" : "Off Duty"}
                </div>
                <button 
                  className="gradient-btn w-full py-3 text-lg font-semibold"
                  onClick={() => navigate("/driver/duty")}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <FaPlay />
                    <span>{isOnDuty ? "Resume Duty" : "Go On Duty"}</span>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Safety Guidelines */}
        <div className="md:col-span-2">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              Driver Safety Guidelines
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-1 rounded-full mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Always verify passenger identity</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-1 rounded-full mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Follow designated routes strictly</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-1 rounded-full mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Report emergencies immediately</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-1 rounded-full mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Maintain professional conduct</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
