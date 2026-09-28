import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Leaderboard() {
  const { token, user } = useAuth();
  const [data, setData] = useState([]);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
      setLocked(false);
    } catch (err) {
      if (err.response?.status === 403) setLocked(true);
    } finally {
      setLoading(false);
    }
  };

  const verifyJoin = async () => {
    setVerifying(true);
    try {
      await axios.post(
        "http://localhost:5000/api/leaderboard/verify-join",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Unlocked! Loading leaderboard...");
      await fetchLeaderboard();
    } catch {
      setMessage("Something went wrong. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const getMedal = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `#${rank + 1}`;
  };

  // ── Locked state ──────────────────────────────────────────────
  if (locked) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ fontSize: 60 }}>🔒</div>
          <h2 style={{ color: "white", margin: "12px 0 8px" }}>Leaderboard Locked</h2>
          <p style={{ color: "#aaa", marginBottom: 24 }}>
            Join our Telegram channel to unlock the leaderboard and compete with the community!
          </p>
          
            
          <a>href="https://t.me/yourchannel"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}</a>
            <button style={styles.telegramBtn}>
              ✈️ Join Telegram Channel
            </button>
          
          <br />
          <button
            onClick={verifyJoin}
            disabled={verifying}
            style={styles.verifyBtn}
          >
            {verifying ? "Checking..." : "✅ I Already Joined"}
          </button>
          {message && <p style={{ color: "#538d4e", marginTop: 12 }}>{message}</p>}
        </div>
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.page}>
        <p style={{ color: "white" }}>Loading leaderboard...</p>
      </div>
    );
  }

  // ── Leaderboard table ─────────────────────────────────────────
  return (
    <div style={styles.page}>
      <h1 style={{ color: "white", marginBottom: 8 }}>🏆 Leaderboard</h1>
      <p style={{ color: "#aaa", marginBottom: 24 }}>Top players this month</p>

      <div style={styles.table}>
        {/* Header */}
        <div style={styles.headerRow}>
          <span style={{ width: 50 }}>Rank</span>
          <span style={{ flex: 1 }}>Player</span>
          <span style={{ width: 80, textAlign: "center" }}>Streak 🔥</span>
          <span style={{ width: 80, textAlign: "right" }}>Points</span>
        </div>

        {/* Rows */}
        {data.map((player, index) => {
          const isMe = player.username === user?.username;
          return (
            <div
              key={index}
              style={{
                ...styles.row,
                backgroundColor: isMe ? "#1e3a2f" : index % 2 === 0 ? "#1a1a1b" : "#121213",
                border: isMe ? "1px solid #538d4e" : "1px solid transparent",
              }}
            >
              <span style={{ width: 50, fontSize: 20 }}>{getMedal(index)}</span>
              <span style={{ flex: 1, color: isMe ? "#538d4e" : "white", fontWeight: isMe ? "bold" : "normal" }}>
                {player.username} {isMe && "(You)"}
              </span>
              <span style={{ width: 80, textAlign: "center", color: "#aaa" }}>
                {player.streak}
              </span>
              <span style={{ width: 80, textAlign: "right", color: "#f9c74f", fontWeight: "bold" }}>
                {player.points}
              </span>
            </div>
          );
        })}
      </div>

      {/* Your rank if not in top 20 */}
      {!data.find((p) => p.username === user?.username) && (
        <p style={{ color: "#aaa", marginTop: 16 }}>
          Keep playing to appear on the leaderboard!
        </p>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#121213",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 40,
    fontFamily: "sans-serif",
  },
  card: {
    background: "#1a1a1b",
    borderRadius: 16,
    padding: 40,
    textAlign: "center",
    maxWidth: 400,
    width: "90%",
    border: "1px solid #333",
  },
  table: {
    width: "90%",
    maxWidth: 560,
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #333",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    background: "#272729",
    color: "#818384",
    fontWeight: "bold",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "14px 16px",
    color: "white",
    fontSize: 15,
    transition: "background 0.2s",
  },
  telegramBtn: {
    background: "#0088cc",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
  },
  verifyBtn: {
    background: "#538d4e",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
  },
};