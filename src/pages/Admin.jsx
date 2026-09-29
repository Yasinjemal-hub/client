import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API = "http://localhost:5000/api/admin";

export default function Admin() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [tab, setTab] = useState("words");  // "words" | "users" | "stats"

  // Words state
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [editingWord, setEditingWord] = useState(null);
  const [wordMsg, setWordMsg] = useState("");

  // Users state
  const [users, setUsers] = useState([]);
  const [userMsg, setUserMsg] = useState("");

  // Stats state
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (tab === "words") fetchWords();
    if (tab === "users") fetchUsers();
    if (tab === "stats") fetchStats();
  }, [tab]);

  // ── Words ──────────────────────────────────────────────────────
  const fetchWords = async () => {
    const res = await axios.get(`${API}/words`, { headers });
    setWords(res.data);
  };

  const addWord = async () => {
    if (newWord.length !== 5) return setWordMsg("Word must be exactly 5 letters");
    const dateStr = newDate.toISOString().split("T")[0];
    try {
      await axios.post(`${API}/words`, { word: newWord, date: dateStr }, { headers });
      setWordMsg("✅ Word added!");
      setNewWord("");
      fetchWords();
    } catch (err) {
      setWordMsg(err.response?.data?.message || "Error");
    }
  };

  const deleteWord = async (id) => {
    if (!window.confirm("Delete this word?")) return;
    await axios.delete(`${API}/words/${id}`, { headers });
    fetchWords();
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API}/words/${editingWord._id}`,
        { word: editingWord.word, date: editingWord.date },
        { headers }
      );
      setEditingWord(null);
      fetchWords();
    } catch (err) {
      setWordMsg(err.response?.data?.message || "Error");
    }
  };

  // ── Users ──────────────────────────────────────────────────────
  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users`, { headers });
    setUsers(res.data);
  };

  const toggleAdmin = async (id, username) => {
    if (!window.confirm(`Toggle admin for ${username}?`)) return;
    const res = await axios.put(`${API}/users/${id}/toggle-admin`, {}, { headers });
    setUserMsg(res.data.message);
    fetchUsers();
  };

  const resetPoints = async (id, username) => {
    if (!window.confirm(`Reset points for ${username}?`)) return;
    await axios.put(`${API}/users/${id}/reset-points`, {}, { headers });
    setUserMsg(`${username}'s points reset`);
    fetchUsers();
  };

  // ── Stats ──────────────────────────────────────────────────────
  const fetchStats = async () => {
    const res = await axios.get(`${API}/stats`, { headers });
    setStats(res.data);
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <h1 style={{ color: "white", marginBottom: 8 }}>⚙️ Admin Panel</h1>
      <p style={{ color: "#aaa", marginBottom: 24 }}>Manage words, users, and view stats</p>

      {/* Tabs */}
      <div style={s.tabs}>
        {["words", "users", "stats"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.activeTab : {}) }}>
            {t === "words" ? "📅 Words" : t === "users" ? "👥 Users" : "📊 Stats"}
          </button>
        ))}
      </div>

      {/* ── WORDS TAB ── */}
      {tab === "words" && (
        <div style={s.card}>
          <h2 style={s.cardTitle}>Schedule Daily Words</h2>

          {/* Add word form */}
          <div style={s.row}>
            <input
              style={s.input}
              placeholder="5-letter word (e.g. CRANE)"
              value={newWord}
              maxLength={5}
              onChange={(e) => setNewWord(e.target.value.toUpperCase())}
            />
            <DatePicker
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              dateFormat="yyyy-MM-dd"
              customInput={<input style={s.input} />}
            />
            <button style={s.greenBtn} onClick={addWord}>+ Add Word</button>
          </div>
          {wordMsg && <p style={{ color: "#538d4e", marginBottom: 12 }}>{wordMsg}</p>}

          {/* Word list */}
          <table style={s.table}>
            <thead>
              <tr>
                {["Date", "Word", "Actions"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {words.map((w) => (
                <tr key={w._id} style={s.tr}>
                  <td style={s.td}>
                    {editingWord?._id === w._id ? (
                      <input
                        style={{ ...s.input, width: 140 }}
                        value={editingWord.date}
                        onChange={(e) => setEditingWord({ ...editingWord, date: e.target.value })}
                      />
                    ) : w.date}
                  </td>
                  <td style={s.td}>
                    {editingWord?._id === w._id ? (
                      <input
                        style={{ ...s.input, width: 100 }}
                        value={editingWord.word}
                        maxLength={5}
                        onChange={(e) => setEditingWord({ ...editingWord, word: e.target.value.toUpperCase() })}
                      />
                    ) : (
                      <span style={{ fontWeight: "bold", letterSpacing: 3, color: "#538d4e" }}>{w.word}</span>
                    )}
                  </td>
                  <td style={s.td}>
                    {editingWord?._id === w._id ? (
                      <>
                        <button style={s.greenBtn} onClick={saveEdit}>Save</button>
                        <button style={s.grayBtn} onClick={() => setEditingWord(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button style={s.grayBtn} onClick={() => setEditingWord({ ...w })}>Edit</button>
                        <button style={s.redBtn} onClick={() => deleteWord(w._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {words.length === 0 && (
                <tr><td colSpan={3} style={{ ...s.td, textAlign: "center", color: "#555" }}>No words scheduled yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {tab === "users" && (
        <div style={s.card}>
          <h2 style={s.cardTitle}>Manage Users</h2>
          {userMsg && <p style={{ color: "#538d4e", marginBottom: 12 }}>{userMsg}</p>}

          <table style={s.table}>
            <thead>
              <tr>
                {["Username", "Email", "Points", "Streak", "Telegram", "Role", "Actions"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={s.tr}>
                  <td style={s.td}>{u.username}</td>
                  <td style={{ ...s.td, color: "#aaa", fontSize: 13 }}>{u.email}</td>
                  <td style={{ ...s.td, color: "#f9c74f", fontWeight: "bold" }}>{u.points}</td>
                  <td style={s.td}>🔥 {u.streak}</td>
                  <td style={s.td}>{u.telegramJoined ? "✅" : "❌"}</td>
                  <td style={s.td}>
                    <span style={{
                      background: u.isAdmin ? "#b59f3b" : "#3a3a3c",
                      padding: "2px 8px", borderRadius: 4, fontSize: 12
                    }}>
                      {u.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.grayBtn} onClick={() => toggleAdmin(u._id, u.username)}>
                      Toggle Admin
                    </button>
                    <button style={s.redBtn} onClick={() => resetPoints(u._id, u.username)}>
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── STATS TAB ── */}
      {tab === "stats" && stats && (
        <div style={s.card}>
          <h2 style={s.cardTitle}>📊 Overview</h2>

          {/* Stat boxes */}
          <div style={s.statGrid}>
            {[
              { label: "Total Users",      value: stats.totalUsers,      icon: "👥" },
              { label: "Total Games",      value: stats.totalGames,      icon: "🎮" },
              { label: "Total Wins",       value: stats.totalWins,       icon: "🏆" },
              { label: "Telegram Joined",  value: stats.joinedTelegram,  icon: "✈️" },
              { label: "Win Rate",
                value: stats.totalGames
                  ? `${Math.round((stats.totalWins / stats.totalGames) * 100)}%`
                  : "0%",
                icon: "📈" },
            ].map((stat) => (
              <div key={stat.label} style={s.statBox}>
                <div style={{ fontSize: 32 }}>{stat.icon}</div>
                <div style={{ fontSize: 28, fontWeight: "bold", color: "white" }}>{stat.value}</div>
                <div style={{ color: "#aaa", fontSize: 13 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Daily activity */}
          <h3 style={{ color: "white", marginTop: 32, marginBottom: 12 }}>Games Played — Last 7 Days</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {stats.dailyActivity.map((day) => {
              const max = Math.max(...stats.dailyActivity.map((d) => d.count));
              const height = max ? (day.count / max) * 100 : 10;
              return (
                <div key={day._id} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ color: "#aaa", fontSize: 11, marginBottom: 4 }}>{day.count}</div>
                  <div style={{
                    height: `${height}%`, minHeight: 8,
                    background: "#538d4e", borderRadius: "4px 4px 0 0",
                  }} />
                  <div style={{ color: "#555", fontSize: 10, marginTop: 4 }}>
                    {day._id?.slice(5)}
                  </div>
                </div>
              );
            })}
            {stats.dailyActivity.length === 0 && (
              <p style={{ color: "#555" }}>No activity yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = {
  page:      { minHeight: "100vh", background: "#121213", padding: "30px 20px", fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto" },
  tabs:      { display: "flex", gap: 8, marginBottom: 24 },
  tab:       { padding: "10px 20px", borderRadius: 8, border: "1px solid #333", background: "#1a1a1b", color: "#aaa", cursor: "pointer", fontSize: 14 },
  activeTab: { background: "#538d4e", color: "white", border: "1px solid #538d4e" },
  card:      { background: "#1a1a1b", borderRadius: 12, padding: 24, border: "1px solid #333" },
  cardTitle: { color: "white", marginTop: 0, marginBottom: 20 },
  row:       { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  input:     { padding: "10px 12px", borderRadius: 8, border: "1px solid #444", background: "#121213", color: "white", fontSize: 14 },
  table:     { width: "100%", borderCollapse: "collapse" },
  th:        { textAlign: "left", padding: "10px 12px", color: "#818384", fontSize: 12, textTransform: "uppercase", borderBottom: "1px solid #333" },
  tr:        { borderBottom: "1px solid #222" },
  td:        { padding: "12px 12px", color: "white", fontSize: 14 },
  greenBtn:  { padding: "7px 14px", background: "#538d4e", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 6, fontSize: 13 },
  grayBtn:   { padding: "7px 14px", background: "#3a3a3c", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 6, fontSize: 13 },
  redBtn:    { padding: "7px 14px", background: "#8b1a1a", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  statGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 },
  statBox:   { background: "#121213", borderRadius: 10, padding: 20, textAlign: "center", border: "1px solid #333" },
};