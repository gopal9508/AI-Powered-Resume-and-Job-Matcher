import express from "express";
import {
  uploadResume,
  analyzeResume,
  getJobRecommendations,
  getAnalysisHistory,
  getAnalysis,
} from "../controllers/resumeController.js";

import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* =====================================================
   RESUME ROUTES
===================================================== */

// Upload resume file
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

// Analyze resume
router.post(
  "/analyze",
  protect,
  analyzeResume
);

// Get job recommendations based on resume
router.post(
  "/job-recommendations",
  protect,
  getJobRecommendations
);

// Get analysis history
router.get(
  "/analysis-history",
  protect,
  getAnalysisHistory
);

// Get specific analysis by ID
router.get(
  "/analysis/:id",
  protect,
  getAnalysis
);

export default router;

