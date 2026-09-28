import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ResultModal({ won, secret, guesses }) {
  const { token } = useAuth();

  const verifyJoin = async () => {
    await axios.post("http://localhost:5000/api/leaderboard/verify-join", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Leaderboard unlocked! 🎉");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ background: "#1a1a1b", padding: 30, borderRadius: 12, textAlign: "center", color: "white" }}>
        <h2>{won ? "🎉 You Won!" : "😢 Game Over"}</h2>
        <p>The word was: <strong>{secret}</strong></p>
        <p>Guesses used: {guesses.length}</p>
        <hr style={{ borderColor: "#333" }} />
        <p>Join our Telegram channel to unlock the leaderboard and get tomorrow's hint!</p>
        <a href="https://t.me/yourchannel" target="_blank" rel="noreferrer">
          <button style={{ background: "#0088cc", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", margin: "8px" }}>
            Join Telegram Channel
          </button>
        </a>
        <br />
        <button onClick={verifyJoin} style={{ background: "#538d4e", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", margin: "8px" }}>
          ✅ I Already Joined
        </button>
      </div>
    </div>
  );
}