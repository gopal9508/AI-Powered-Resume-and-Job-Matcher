import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/resumeService";
import "./UploadResume.css";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

 const handleUpload = async (e) => {
  e.preventDefault();

  if (!file) {
    setError("Please select a resume file");
    return;
  }

  setLoading(true);

  try {
    await uploadResume(file);

    // ✅ resume uploaded flag
    localStorage.setItem("resumeUploaded", "true");

    // ✅ BACK TO DASHBOARD (PREVIOUS FEATURE)
    navigate("/dashboard");
  } catch (err) {
    setError(
      err.response?.data?.message || "Resume upload failed"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Your Resume</h2>
        <p className="subtitle">
          Upload your resume to analyze and match with jobs
        </p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;
