const ROWS = [
["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACKSPACE"],];

const COLORS = {
  correct: "#538d4e",
  present: "#b59f3b",
  absent:  "#3a3a3c",
  unused:  "#818384",
};

// Build a map of letter → best status from all past guesses
function getLetterStatuses(guesses, results) {
  const STATUS_RANK = { correct: 3, present: 2, absent: 1 };
  const map = {};
  guesses.forEach((guess, gi) => {
    guess.split("").forEach((letter, li) => {
      const status = results[gi]?.[li];
      if (!status) return;
      if (!map[letter] || STATUS_RANK[status] > STATUS_RANK[map[letter]]) {
        map[letter] = status;
      }
    });
  });
  return map;
}

export default function Keyboard({ onKey, guesses, results }) {
  const letterStatuses = getLetterStatuses(guesses, results);

  return (
    <div style={{ margin: "12px auto", maxWidth: 500 }}>
      {ROWS.map((row, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 6 }}>
          {row.map((key) => {
            const status = letterStatuses[key];
            const isWide = key === "ENTER" || key === "BACKSPACE";
            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                style={{
                  width: isWide ? 66 : 43,
                  height: 58,
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                  fontSize: isWide ? 11 : 16,
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: COLORS[status] || "#818384",
                  transition: "background-color 0.3s",
                }}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}