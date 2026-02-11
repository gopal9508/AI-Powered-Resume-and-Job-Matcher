/* ===============================
   ENV CONFIG
================================ */

import dotenv from "dotenv";
dotenv.config();

/* ===============================
   CORE IMPORTS
================================ */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/* ===============================
   APP & CONFIG IMPORTS
================================ */

import app from "./src/app.js";
import connectDB from "./src/config/database.js";

/* ===============================
   ROUTES IMPORTS
================================ */

import resumeRoutes from "./src/routes/resumeRoutes.js";

/* ===============================
   PATH FIX (ES MODULE)
================================ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   REGISTER ROUTES
================================ */

app.use("/api/resume", resumeRoutes);

/* ===============================
   DATABASE CONNECTION
================================ */

connectDB();

/* ===============================
   SERVER CONFIG
================================ */

const PORT = process.env.PORT || 5000;

/* ===============================
   ENSURE UPLOADS DIRECTORY
================================ */

const uploadDir = path.join(__dirname, "uploads", "resumes");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Uploads directory created");
}

/* ===============================
   START SERVER
================================ */

const server = app.listen(PORT, () => {
  console.log(`
🚀 Resume Matcher Backend Started Successfully!

🌐 Environment: ${process.env.NODE_ENV || "development"}
🔗 Server URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
📁 Uploads Directory: ${uploadDir}

📚 API Endpoints:
├── Auth
│   ├── POST   /api/auth/register
│   ├── POST   /api/auth/login
│   └── GET    /api/auth/me
│
├── Resume
│   ├── POST   /api/resume/upload
│   ├── POST   /api/resume/analyze
│   ├── POST   /api/resume/ats-suggestions
│   └── GET    /api/resume/analysis-history
│
└── Jobs
    ├── GET    /api/jobs
    └── POST   /api/jobs/search

⚡ Database: ${process.env.MONGO_URI ? "Connected" : "Not Configured"}
🧠 AI Service: ${
    process.env.OPENAI_API_KEY ? "Configured" : "Not Configured"
  }
`);
});

/* ===============================
   ERROR HANDLING
================================ */

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down...");
  server.close(() => {
    console.log("💤 Server closed");
  });
});
