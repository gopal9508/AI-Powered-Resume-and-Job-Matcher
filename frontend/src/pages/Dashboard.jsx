import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const hasResume = localStorage.getItem("resumeUploaded") === "true";

  const handleLogout = () => {
    localStorage.removeItem("resumeUploaded");
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1>Dashboard</h1>

        {/* ✅ UPLOAD RESUME (RESTORED) */}
        <button
          className="dashboard-btn upload-btn"
          onClick={() => navigate("/upload")}
        >
          Upload Resume
        </button>

        {/* ANALYZE */}
        <button
          className="dashboard-btn analyze-btn"
          onClick={() => navigate("/analyze")}
          disabled={!hasResume}
        >
          Analyze Resume
        </button>

        {!hasResume && (
          <p className="helper-text">
            Upload resume first to enable analysis
          </p>
        )}

        {/* HISTORY */}
        <button
          className="dashboard-btn analyze-btn"
          onClick={() => navigate("/history")}
        >
          View Analysis History
        </button>

<button
  className="dashboard-btn analyze-btn"
  onClick={() => navigate("/jobs")}
>
  View Job Recommendations
</button>


        {/* LOGOUT */}
        <button
          className="dashboard-btn logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;






    





