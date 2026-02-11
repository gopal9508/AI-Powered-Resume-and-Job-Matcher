import React, { useEffect, useState } from "react";
import JobSearch from "../components/Jobs/JobSearch";
import JobList from "../components/Jobs/JobList";
import { searchJobs } from "../services/resumeService";


const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    setError("");

    try {
      const res = await searchJobs(filters);

      const list = res?.data || res || [];
      setJobs(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load job recommendations");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto load recommended jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>💼 Job Recommendations</h1>
      <p style={{ color: "#6b7280", marginBottom: 20 }}>
        Jobs matched with your uploaded resume
      </p>

      {/* 🔍 SEARCH */}
      <JobSearch onSearch={fetchJobs} />

      {/* ⏳ LOADING */}
      {loading && <p>Loading jobs...</p>}

      {/* ❌ ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 📭 EMPTY */}
      {!loading && !error && jobs.length === 0 && (
        <p>No matching jobs found.</p>
      )}

      {/* 📋 JOB LIST */}
      {!loading && !error && jobs.length > 0 && (
        <JobList jobs={jobs} />
      )}
    </div>
  );
};

export default Jobs;
