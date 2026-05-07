import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaBusAlt } from "react-icons/fa";
import { MdEmail, MdLock, MdSecurity } from "react-icons/md";
import { auth, db } from "../../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (!snap.exists()) {
        toast.error("Your account setup is incomplete. Please register again.");
        return;
      }
      const role = snap.data()?.role;
      if (role === "passenger") navigate("/passenger/home");
      else if (role === "driver") navigate("/driver/home");
      else if (role === "admin") navigate("/admin/dashboard");
      else toast.error("Your account role is not configured.");
    } catch (err: any) {
      const code = err?.code;
      if (code === "auth/wrong-password") toast.error("Incorrect password");
      else if (code === "auth/user-not-found") toast.error("No account found with this email");
      else if (code === "auth/network-request-failed") toast.error("Check your internet connection");
      else toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Left Side - Branding */}
      <div className="lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center h-full p-12 lg:p-16 text-white">
          <div className="max-w-md">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                <FaBusAlt className="text-4xl" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold">Women Bus Safety</h1>
            </div>
            
            <p className="text-xl text-purple-100 mb-8">
              Keeping women safe, one journey at a time.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-purple-100">Real-time location tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-purple-100">Emergency SOS alerts</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-full backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-purple-100">24/7 safety monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-purple-100 p-3 rounded-full mb-4">
                <MdSecurity className="text-2xl text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <MdEmail className="text-purple-600" />
                    <span>Email Address</span>
                  </div>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white bg-opacity-50 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <MdLock className="text-purple-600" />
                    <span>Password</span>
                  </div>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white bg-opacity-50 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full gradient-btn py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </motion.button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                  >
                    Create new account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
