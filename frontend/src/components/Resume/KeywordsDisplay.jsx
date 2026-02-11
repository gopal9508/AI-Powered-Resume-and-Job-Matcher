function KeywordsDisplay({ present = [], missing = [] }) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div>
        <h3>✅ Present Keywords</h3>
        {present.map((k, i) => (
          <span key={i} style={chipStyle("#dcfce7")}>{k}</span>
        ))}
      </div>

      <div>
        <h3>❌ Missing Keywords</h3>
        {missing.map((k, i) => (
          <span key={i} style={chipStyle("#fee2e2")}>{k}</span>
        ))}
      </div>
    </div>
  );
}

const chipStyle = (bg) => ({
  display: "inline-block",
  padding: "6px 10px",
  margin: 4,
  background: bg,
  borderRadius: 12,
  fontSize: 12,
});

export default KeywordsDisplay;
