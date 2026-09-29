import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      background: "#1a1a1b",
      borderBottom: "1px solid #333",
      padding: "0 24px",
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: "sans-serif",
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: 20 }}>
        🟩 WordGuess
      </Link>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Link to="/" style={navLink}>Play</Link>
        <Link to="/leaderboard" style={navLink}>🏆 Leaderboard</Link>
          {user?.isAdmin && (
  <Link to="/admin" style={{ ...navLink, color: "#b59f3b" }}>⚙️ Admin</Link>
)}
        {user ? (
            
          <>
            <span style={{ color: "#538d4e", fontWeight: "bold" }}>
              {user.username} · {user.points}pts
            </span>
            <button onClick={handleLogout} style={logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLink}>Login</Link>
            <Link to="/register" style={{ ...navLink, background: "#538d4e", padding: "6px 14px", borderRadius: 6 }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const navLink = { color: "#aaa", textDecoration: "none", fontSize: 15 };
const logoutBtn = {
  background: "transparent", border: "1px solid #555",
  color: "#aaa", padding: "5px 12px", borderRadius: 6, cursor: "pointer",
};