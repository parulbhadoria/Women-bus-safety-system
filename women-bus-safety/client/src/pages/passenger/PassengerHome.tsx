import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MdContacts, MdDirections, MdDirectionsBus, MdSos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

export default function PassengerHome() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [hasActiveJourney, setHasActiveJourney] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) return;
    const userUnsub = onSnapshot(doc(db, "users", currentUser.uid), (userSnap) => {
      setName(userSnap.data()?.name || "Passenger");
      setLoading(false);
    });
    const q = query(collection(db, "journeys"), where("passengerId", "==", currentUser.uid), where("status", "==", "active"));
    const journeyUnsub = onSnapshot(q, (js) => setHasActiveJourney(!js.empty));
    return () => {
      userUnsub();
      journeyUnsub();
    };
  }, [currentUser]);
  if (loading) return <LoadingSpinner />;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="page-wrap min-h-screen pb-24"
    >
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-8 mb-8 shadow-2xl floating-card">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm">
              <MdDirectionsBus className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome, {name}
              </h1>
              <p className="text-purple-100 text-sm md:text-base">
                Stay safe on every journey
              </p>
            </div>
          </div>
          
          {/* Safety Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-purple-100">Support</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Safe</p>
                <p className="text-xs text-purple-100">Travel</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Track</p>
                <p className="text-xs text-purple-100">Live</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <button 
          onClick={() => navigate("/passenger/buses")}
          className="glass-card p-6 text-left group hover:shadow-colored transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <MdDirectionsBus className="text-3xl text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Find Nearby Buses</h3>
              <p className="text-sm text-gray-600">Locate available buses in your area</p>
            </div>
            <div className="text-purple-400 group-hover:translate-x-2 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate("/passenger/contacts")}
          className="glass-card p-6 text-left group hover:shadow-colored transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <MdContacts className="text-3xl text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Emergency Contacts</h3>
              <p className="text-sm text-gray-600">Quick access to emergency help</p>
            </div>
            <div className="text-pink-400 group-hover:translate-x-2 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {hasActiveJourney && (
          <button 
            onClick={() => navigate("/passenger/journey")}
            className="glass-card p-6 text-left group hover:shadow-colored transition-all duration-300 border-2 border-green-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <MdDirections className="text-3xl text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Active Journey</h3>
                <p className="text-sm text-green-600 font-medium">Track your current trip</p>
              </div>
              <div className="text-green-400 group-hover:translate-x-2 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Safety Tips */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          Safety Tips
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-1 rounded-full mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600">Always share your location with trusted contacts</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-1 rounded-full mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600">Keep emergency contacts easily accessible</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-1 rounded-full mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600">Use SOS button only in real emergencies</p>
          </div>
        </div>
      </div>

      {/* SOS Emergency Button */}
      <button 
        onClick={() => navigate("/passenger/sos")}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-red-300 transition-all duration-300 hover:scale-105 pulse flex items-center space-x-3 border-4 border-red-200"
      >
        <MdSos className="text-2xl" />
        <span>SOS EMERGENCY</span>
      </button>
    </motion.div>
  );
}
