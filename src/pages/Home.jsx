import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";
import ResultModal from "../components/ResultModal";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export default function Home() {
  const { token } = useAuth();
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [results, setResults] = useState([]);   // array of result arrays
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [secret, setSecret] = useState(null);
  const [message, setMessage] = useState("");

  const submitGuess = async () => {
    if (currentGuess.length !== WORD_LENGTH) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/game/guess",
        { guess: currentGuess },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { result, won, secret } = res.data;
      setGuesses([...guesses, currentGuess]);
      setResults([...results, result]);
      setCurrentGuess("");
      if (won) { setWon(true); setGameOver(true); setSecret(secret); }
      else if (guesses.length + 1 >= MAX_GUESSES) { setGameOver(true); setSecret(secret); }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  const onKey = (key) => {
    if (gameOver) return;
    if (key === "ENTER") { submitGuess(); return; }
    if (key === "BACKSPACE") { setCurrentGuess(c => c.slice(0, -1)); return; }
    if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess(c => c + key);
    }
  };

  useEffect(() => {
    const handler = (e) => onKey(e.key.toUpperCase());
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentGuess, guesses, gameOver]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Word Guess Daily</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <Board guesses={guesses} results={results} currentGuess={currentGuess} />
      <Keyboard onKey={onKey} results={results} guesses={guesses} />
      {gameOver && <ResultModal won={won} secret={secret} guesses={guesses} />}
    </div>
  );
}