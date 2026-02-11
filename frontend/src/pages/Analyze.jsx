import React, { useEffect, useRef, useState } from "react";
import { analyzeResume } from "../services/resumeService";
import "./Analyze.css";

/* ===============================
   Utility: safely read saved result
================================ */
const getSavedResult = () => {
  try {
    const saved = sessionStorage.getItem("analysisResult");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const Analyze = () => {
  const resultRef = useRef(null);

  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(getSavedResult);
  const [error, setError] = useState("");

  /* ===============================
     Auto-scroll when result appears
  ================================ */
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  /* ===============================
     Handle Analyze
  ================================ */
  const handleAnalyze = async () => {
    if (jobDescription.trim().length < 50) {
      setError("Please enter a job description (minimum 50 characters)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await analyzeResume(jobDescription);

      // 🔥 ALWAYS unwrap backend response correctly
      const data =
  res?.data?.data || res?.data;

if (!data || !data.matchScore) {
  throw new Error("Invalid analysis response");
}


      // 🔥 Persist result to survive reloads
      sessionStorage.setItem(
        "analysisResult",
        JSON.stringify(data)
      );

      setResult(data);
    } catch (err) {
      console.error("Analyze error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to analyze resume"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyze-container">
      <div className="analyze-card">
        <h1>Analyze Resume</h1>

        <textarea
          rows="6"
          placeholder="Paste Job Description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {loading && (
          <p style={{ textAlign: "center", marginTop: "12px" }}>
            Analyzing your resume…
          </p>
        )}

        {/* ===============================
            RESULT (ALWAYS RENDERS WHEN DATA EXISTS)
        ================================ */}
        {result && (
          <div className="result-box" ref={resultRef}>
            <div className="score">
              <strong>Match Score:</strong>{" "}
              {result.matchScore ?? "N/A"}%
            </div>

            <div className="score">
              <strong>ATS Score:</strong>{" "}
              {result.atsScore ?? "N/A"}/100
            </div>

            <div className="result-section">
              <h4>Section-wise Breakdown</h4>
              {Object.entries(result.sectionScores || {}).map(
                ([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value}%
                  </p>
                )
              )}
            </div>

            <div className="result-section">
              <h4>Missing Keywords</h4>
              <p className="help-text">
                Add these keywords naturally to improve ATS ranking:
              </p>
              <p>
                {result.missingKeywords?.length
                  ? result.missingKeywords.join(", ")
                  : "No major keywords missing"}
              </p>
            </div>

            <div className="result-section">
              <h4>How to Improve Your Resume</h4>
              <ul>
                {result.suggestions?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
