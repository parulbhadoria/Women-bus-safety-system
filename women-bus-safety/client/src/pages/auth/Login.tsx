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
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
      <div style={{ background: "linear-gradient(135deg, rgba(123,45,139,0.85), rgba(233,30,140,0.75)), url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80) center/cover no-repeat", color: "#fff", padding: 32, display: "grid", alignContent: "center", gap: 12 }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 34 }}><FaBusAlt /> Women Bus Safety</h1>
        <p>Keeping women safe, one journey at a time.</p>
      </div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} onSubmit={submit} style={{ padding: 24, display: "grid", alignContent: "center", gap: 12, background: "#fff" }}>
        <h2 style={{ color: "#7B2D8B", display: "flex", alignItems: "center", gap: 8 }}><MdSecurity /> Login</h2>
        <label><MdEmail /> Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 12, border: "1px solid #E1BEE7", borderRadius: 12 }} />
        <label><MdLock /> Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 12, border: "1px solid #E1BEE7", borderRadius: 12 }} />
        <motion.button whileTap={{ scale: 0.97 }} className="gradient-btn" disabled={loading}>{loading ? "Signing in..." : "Login"}</motion.button>
        <Link to="/register" style={{ color: "#7B2D8B" }}>Create new account</Link>
      </motion.form>
    </div>
  );
};

export default Login;
