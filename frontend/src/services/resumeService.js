import API from "../api/api";

/* ===============================
   RESUME SERVICES
================================ */

// UPLOAD RESUME
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await API.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ANALYZE RESUME AGAINST JOB DESCRIPTION
export const analyzeResume = async (jobDescription) => {
  const res = await API.post("/resume/analyze", {
    jobDescription,
  });

  return res.data;
};

// GET ANALYSIS HISTORY (OPTIONAL – FOR DASHBOARD)
export const getAnalysisHistory = async () => {
  const res = await API.get("/resume/analysis-history");
  return res.data;
};

// GET SINGLE ANALYSIS BY ID
export const getAnalysisById = async (analysisId) => {
  const res = await API.get(`/resume/analysis/${analysisId}`);
  return res.data;
};

// GET JOB RECOMMENDATIONS BASED ON RESUME
// (USED BY DASHBOARD / ANALYSIS FLOW)
export const getJobRecommendations = async (data) => {
  const res = await API.post("/resume/job-recommendations", data);
  return res.data;
};

/* ===============================
   🔥 JOB SERVICES (NEW – DO NOT REMOVE ABOVE)
================================ */

// SEARCH JOBS (USED BY JOBS PAGE)
export const searchJobs = async (filters) => {
  const res = await API.post("/jobs/search", filters);
  return res.data;
};
