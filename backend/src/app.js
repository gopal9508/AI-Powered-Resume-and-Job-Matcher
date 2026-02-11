import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import morgan from "morgan";
import compression from "compression";
import { fileURLToPath } from "url";

/* ===============================
   PATH FIX FOR ES MODULE
================================ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   ROUTES
================================ */

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

/* ===============================
   MIDDLEWARE
================================ */

import errorHandler from "./middleware/errorHandler.js";

const app = express();

/* ===============================
   BASIC MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());

/* ===============================
   GLOBAL CONFIG
================================ */

// Trust proxy (needed for rate-limit behind proxy)
app.set("trust proxy", 1);

/* ===============================
   SECURITY & PERFORMANCE
================================ */

// Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Compression
app.use(compression());

// Logger
app.use(morgan("dev"));

/* ===============================
   CORS CONFIG
================================ */

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===============================
   RATE LIMITING
================================ */

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

/* ===============================
   BODY PARSERS
================================ */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ===============================
   STATIC FILES
================================ */

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/public", express.static(path.join(__dirname, "../public")));

/* ===============================
   ROOT ROUTE
================================ */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Resume Matcher API 🚀",
    version: "1.0.0",
    health: "/health",
    docs: "/api-docs",
  });
});

/* ===============================
   API ROUTES
================================ */

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);

/* ===============================
   HEALTH CHECK
================================ */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy",
    service: "Resume Matcher API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    memoryUsage: process.memoryUsage(),
    database: process.env.MONGO_URI ? "Configured" : "Not Configured",
  });
});

/* ===============================
   API DOCUMENTATION
================================ */

app.get("/api-docs", (req, res) => {
  res.json({
    baseURL: `${req.protocol}://${req.get("host")}`,
    endpoints: {
      auth: [
        "POST /api/auth/register",
        "POST /api/auth/login",
        "GET  /api/auth/me",
      ],
      resume: [
        "POST /api/resume/upload",
        "POST /api/resume/analyze",
        "GET  /api/resume/analysis-history",
      ],
      jobs: [
        "GET  /api/jobs",
        "POST /api/jobs/search",
      ],
    },
  });
});

/* ===============================
   404 HANDLER
================================ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* ===============================
   ERROR HANDLER
================================ */

app.use(errorHandler);

export default app;
