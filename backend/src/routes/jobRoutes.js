import express from "express";
const router = express.Router();

import * as jobController from "../controllers/jobController.js";
import { protect, admin } from "../middleware/auth.js";

/* ===============================
   PUBLIC ROUTES
================================ */

// Get all jobs
router.get("/", jobController.getJobs);

// Get single job by ID
router.get("/:id", jobController.getJobById);

// Search jobs
router.post("/search", jobController.searchJobs);

/* ===============================
   ADMIN ROUTES
================================ */

// Refresh jobs (admin only)
router.post(
  "/refresh",
  protect,
  admin,
  jobController.refreshJobs
);

export default router;

