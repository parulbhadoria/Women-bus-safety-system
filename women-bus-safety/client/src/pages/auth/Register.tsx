import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdEmail, MdLock, MdPerson, MdPersonAdd, MdPhone } from "react-icons/md";
import { auth } from "../../firebase";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!/^\d{10}$/.test(form.phone)) next.phone = "Phone must be 10 digits";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      navigate("/register/role", { state: { uid: cred.user.uid, name: form.name, email: form.email, phone: form.phone } });
    } catch {
      toast.error("Could not register right now");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16, background: "linear-gradient(180deg,#F8F0FF,#FCE4EC)" }}>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} onSubmit={onSubmit} style={{ width: "min(520px, 100%)", background: "#fff", borderRadius: 20, boxShadow: "0 10px 30px rgba(123,45,139,0.15)", padding: 24, display: "grid", gap: 10 }}>
        <h2 style={{ color: "#7B2D8B", display: "flex", gap: 8, alignItems: "center" }}><MdPersonAdd size={30} /> Register</h2>
        <label><MdPerson /> Name</label><input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ padding: 12, border: "1px solid #E1BEE7", borderRadius: 12 }} />
        {errors.name && <small style={{ color: "#D32F2F" }}>{errors.name}</small>}
        <label><MdEmail /> Email</label><input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required style={{ padding: 12, border: "1px solid #E1BEE7", borderRadius: 12 }} />
        {errors.email && <small style={{ color: "#D32F2F" }}>{errors.email}</small>}
        <label><MdPhone /> Phone</label><input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} required style={{ padding: 12, border: "1px solid #E1BEE7", borderRadius: 12 }} />
        {errors.phone && <small style={{ color: "#D32F2F" }}>{errors.phone}</small>}
        <label><MdLock /> Password</label><input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ padding: 12, border: "1px solid #E1BEE7", borderRadius: 12 }} />
        {errors.password && <small style={{ color: "#D32F2F" }}>{errors.password}</small>}
        <label><MdLock /> Confirm Password</label><input placeholder="Confirm password" type="password" onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required style={{ padding: 12, border: "1px solid #E1BEE7", borderRadius: 12 }} />
        {errors.confirmPassword && <small style={{ color: "#D32F2F" }}>{errors.confirmPassword}</small>}
        <motion.button whileTap={{ scale: 0.97 }} className="gradient-btn" disabled={loading}>{loading ? "Please wait..." : "Register"}</motion.button>
        <Link to="/login" style={{ color: "#7B2D8B" }}>Already have an account?</Link>
      </motion.form>
    </div>
  );
};

export default Register;
