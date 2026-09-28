const COLORS = { correct: "#538d4e", present: "#b59f3b", absent: "#3a3a3c" };

export default function Board({ guesses, results, currentGuess }) {
  const rows = Array(6).fill(null);

  return (
    <div style={{ display: "inline-block", margin: "20px auto" }}>
      {rows.map((_, i) => {
        const guess = guesses[i] || (i === guesses.length ? currentGuess : "");
        const result = results[i];
        return (
          <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
            {Array(5).fill(null).map((_, j) => (
              <div key={j} style={{
                width: 60, height: 60, border: "2px solid #555",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: "bold", color: "white",
                backgroundColor: result ? COLORS[result[j]] : "#121213",
                textTransform: "uppercase",
              }}>
                {guess[j] || ""}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}