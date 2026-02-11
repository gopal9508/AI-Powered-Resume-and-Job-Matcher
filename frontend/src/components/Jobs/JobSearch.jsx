import React, { useState } from "react";

const JobSearch = ({ onSearch }) => {
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // send trimmed values to parent
    onSearch({
      keywords: keywords.trim(),
      location: location.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={cardStyle}>
      <h3 style={{ marginBottom: 8 }}>🔍 Search Jobs</h3>

      <input
        type="text"
        placeholder="Keywords (React, Node, AI...)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={inputStyle}
      />

      <button
        type="submit"
        style={buttonStyle}
        disabled={!keywords && !location}
      >
        Search
      </button>
    </form>
  );
};

/* ===============================
   Inline Styles
================================ */

const cardStyle = {
  padding: 16,
  borderRadius: 12,
  background: "#f9fafb",
  display: "grid",
  gap: 10,
  marginBottom: 20,
  border: "1px solid #e5e7eb",
};

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
};

const buttonStyle = {
  padding: "10px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  marginTop: 6,
};

export default JobSearch;
