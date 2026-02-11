import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>AI Resume & Job Matcher</h1>

        <p className="tagline">
          Upload your resume, improve ATS score, and find better jobs
        </p>

        {/* Status */}
        <p className="status">
          {user ? "✅ You are logged in" : "❌ You are not logged in"}
        </p>

        {/* Features */}
        <div className="features">
          <div>📄 Resume Upload</div>
          <div>🧠 ATS Resume Analysis</div>
          <div>🔍 Keyword Matching</div>
          <div>💼 Job Suggestions</div>
        </div>

        {/* Actions */}
        <div className="actions">
          {user ? (
            <button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>
                Login
              </button>
              <button onClick={() => navigate("/register")}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;


