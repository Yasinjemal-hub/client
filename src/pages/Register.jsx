import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ color: "white", marginBottom: 24 }}>Create Account</h2>
        {error && <p style={{ color: "#e57373", marginBottom: 12 }}>{error}</p>}
        <input style={styles.input} placeholder="Username"
          value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        <input style={styles.input} placeholder="Email" type="email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button style={styles.btn} onClick={handleSubmit}>Register</button>
        <p style={{ color: "#aaa", marginTop: 16 }}>
          Have an account? <Link to="/login" style={{ color: "#538d4e" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#121213", display: "flex", alignItems: "center", justifyContent: "center" },
  card: { background: "#1a1a1b", padding: 40, borderRadius: 16, width: 360, border: "1px solid #333" },
  input: { display: "block", width: "100%", marginBottom: 14, padding: "12px", borderRadius: 8, border: "1px solid #444", background: "#121213", color: "white", fontSize: 15, boxSizing: "border-box" },
  btn: { width: "100%", padding: 13, background: "#538d4e", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: "bold", cursor: "pointer" },
};